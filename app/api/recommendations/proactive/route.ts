import { NextRequest, NextResponse } from 'next/server';
import { ProactiveRecommendationSchema } from '@/lib/validations';
import { MOCK_PLACES, MOCK_USER } from '@/lib/mockData';
import {
  computeCosineSimilarity,
  getVectorEmbedding,
  THEME_SEMANTIC_ANCHORS,
  VIBE_SIMILARITY_CUTOFF,
} from '@/lib/ai/cosineSimilarity';
import { RankedPlace, ProactiveRecommendationResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = ProactiveRecommendationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          triggered: false,
          reason: 'Invalid payload: ' + validation.error.issues.map((i) => i.message).join(', '),
          recommendations: [],
        },
        { status: 400 }
      );
    }

    const { currentLat, currentLng, speed, theme, userTastes } = validation.data;

    // Workflow 1: Velocity Gate
    // If cruising at highway speed (>50 km/h), do not distract driver
    if (speed > 50) {
      return NextResponse.json<ProactiveRecommendationResponse>({
        triggered: false,
        reason: 'Velocity gate engaged (>50 km/h). Proactive notifications paused for driving safety.',
        recommendations: [],
      });
    }

    // Velocity < 15 km/h or dwell state -> execute discovery engine
    const themeAnchorText = THEME_SEMANTIC_ANCHORS[theme] || theme;
    const themeVector = await getVectorEmbedding(themeAnchorText);

    const userTasteTags = userTastes || MOCK_USER.explicitTastes;

    // 1. Fetch Candidate Places (live Google Places API or rich local dataset)
    let candidatePool = MOCK_PLACES;

    // 2. Vector Cosine Similarity Filter (Workflow 2)
    const filteredAndRanked: RankedPlace[] = [];

    for (const place of candidatePool) {
      const placeVector = await getVectorEmbedding(`${place.name} ${place.category} ${place.tags.join(' ')}`);
      const similarity = computeCosineSimilarity(themeVector, placeVector);

      // Strict Hard Cutoff Threshold (>= 0.75)
      if (similarity < VIBE_SIMILARITY_CUTOFF) {
        continue; // Discard spots incompatible with theme
      }

      // Compute taste match score S_taste based on explicit user tastes
      const matchedTasteCount = place.tags.filter((tag) =>
        userTasteTags.some((ut) => ut.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(ut.toLowerCase()))
      ).length;
      const sTaste = Math.min(1.0, 0.5 + (matchedTasteCount * 0.25));

      // Rating normalized to 0.0 - 1.0
      const ratingNormalized = (place.rating || 4.0) / 5.0;

      // Detour delta penalty Δt in minutes (normalized to scale 0 - 30 mins)
      const deltaT = place.detourDeltaMinutes || 5;
      const deltaTNormalized = Math.min(1.0, deltaT / 30.0);

      // Workflow 1 Formula: Score = (0.5 * S_taste) + (0.3 * Rating) - (0.2 * Δt)
      const score = (0.5 * sTaste) + (0.3 * ratingNormalized) - (0.2 * deltaTNormalized);

      filteredAndRanked.push({
        ...place,
        detourDeltaMinutes: deltaT,
        tasteMatchScore: Number(sTaste.toFixed(2)),
        cosineSimilarity: Number(similarity.toFixed(2)),
        finalScore: Number(Math.max(0.1, Math.min(0.99, score)).toFixed(2)),
        matchReason: `High vibe sync (${Math.round(similarity * 100)}%) with your ${theme.replace('_', ' ')} itinerary.`,
      });
    }

    // Sort by final score descending and select top 3 micro-cards
    filteredAndRanked.sort((a, b) => b.finalScore - a.finalScore);
    const topRecommendations = filteredAndRanked.slice(0, 3);

    return NextResponse.json<ProactiveRecommendationResponse>({
      triggered: true,
      reason: `Found ${topRecommendations.length} verified spots matching velocity & vibe criteria.`,
      recommendations: topRecommendations,
    });
  } catch (error: any) {
    console.error('Proactive recommendation route error:', error);
    return NextResponse.json<ProactiveRecommendationResponse>(
      {
        triggered: false,
        reason: 'Internal discovery engine exception: ' + (error?.message || 'Unknown error'),
        recommendations: [],
      },
      { status: 500 }
    );
  }
}
