import { NextRequest, NextResponse } from 'next/server';
import { VibeMatchSchema } from '@/lib/validations';
import { MOCK_PLACES } from '@/lib/mockData';
import {
  computeCosineSimilarity,
  getVectorEmbedding,
  VIBE_SIMILARITY_CUTOFF,
} from '@/lib/ai/cosineSimilarity';
import { VibeMatchResponse, VibeMatchResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = VibeMatchSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed: ' + validation.error.issues.map((i) => i.message).join(', '),
        },
        { status: 400 }
      );
    }

    const { imageFile, textQuery, userCoords, theme } = validation.data;
    const apiKey = process.env.OPENAI_API_KEY;

    let extractedTags: string[] = [];
    let atmosphereSummary = '';

    // 1. Vision / Natural Language Mood Analysis (OpenAI or Local NLP Synthesizer)
    if (apiKey && apiKey !== 'your_openai_api_key_here') {
      try {
        const messages: any[] = [
          {
            role: 'system',
            content:
              'You are a multimodal vibe-analyzer for a travel app. Analyze the visual or textual mood input and return a JSON object with: { "tags": string[], "atmosphereSummary": string } representing atmospheric aesthetic, spatial vibe, and venue keywords.',
          },
        ];

        if (imageFile) {
          messages.push({
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract atmospheric, aesthetic, and venue tags from this image for journey waypoint matching.',
              },
              {
                type: 'image_url',
                image_url: { url: imageFile },
              },
            ],
          });
        } else {
          messages.push({
            role: 'user',
            content: `Extract atmospheric vibe tags and summary for: "${textQuery}"`,
          });
        }

        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages,
          }),
        });

        if (openaiRes.ok) {
          const completion = await openaiRes.json();
          const parsed = JSON.parse(completion.choices[0].message.content);
          extractedTags = parsed.tags || [];
          atmosphereSummary = parsed.atmosphereSummary || 'Atmospheric aesthetic matched from visual analysis.';
        }
      } catch (aiErr) {
        console.warn('OpenAI Vision parsing fallback triggered:', aiErr);
      }
    }

    // Fallback tag synthesizer if OpenAI offline or not configured
    if (extractedTags.length === 0) {
      const queryLower = (textQuery || 'aesthetic chill overlook coffee').toLowerCase();
      if (queryLower.includes('coffee') || queryLower.includes('cafe')) {
        extractedTags = ['Specialty Coffee', 'Artisan Bakeries', 'Aesthetic Cafes', 'Filter Coffee'];
        atmosphereSummary = 'Cozy artisanal cafe ambiance with rich roast aroma and warm wood tones.';
      } else if (queryLower.includes('temple') || queryLower.includes('spiritual') || queryLower.includes('peace')) {
        extractedTags = ['Ancient Temple', 'Spiritual', 'Sanctuary', 'Meditation', 'Peaceful'];
        atmosphereSummary = 'Serene meditative sanctuary surrounded by historic stone architecture.';
      } else if (queryLower.includes('hill') || queryLower.includes('view') || queryLower.includes('scenic')) {
        extractedTags = ['Scenic Overlook', 'Sunset View', 'Outdoor Patio', 'Ridge View'];
        atmosphereSummary = 'Panoramic misty ridge overlook with crisp mountain breezes and expansive vistas.';
      } else if (queryLower.includes('party') || queryLower.includes('rooftop') || queryLower.includes('drink')) {
        extractedTags = ['Rooftop', 'Craft Cocktails', 'Nightlife', 'DJ Music', 'Lively'];
        atmosphereSummary = 'Vibrant neon rooftop lounge with upbeat tempo and craft mixology.';
      } else {
        extractedTags = ['Scenic', 'Artisanal', 'Quiet Courtyard', 'Heritage', 'Hidden Gem'];
        atmosphereSummary = 'Tranquil hidden gem blending organic textures and scenic tranquility.';
      }
    }

    // 2. Vector Cosine Matching against Candidate Spots
    const queryVibeText = `${extractedTags.join(' ')} ${atmosphereSummary}`;
    const queryVector = await getVectorEmbedding(queryVibeText);

    const matches: VibeMatchResult[] = [];

    for (const place of MOCK_PLACES) {
      const placeVector = await getVectorEmbedding(`${place.name} ${place.category} ${place.tags.join(' ')}`);
      const sim = computeCosineSimilarity(queryVector, placeVector);

      const matchedTags = place.tags.filter((t) =>
        extractedTags.some((et) => et.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(et.toLowerCase()))
      );

      // Match confidence percentage (normalized between 75% and 98%)
      const matchPercentage = Math.min(98, Math.round(75 + sim * 23));

      matches.push({
        placeId: place.placeId,
        name: place.name,
        category: place.category,
        lat: place.lat,
        lng: place.lng,
        photoUrl: place.photoUrl,
        address: place.address,
        rating: place.rating,
        matchPercentage,
        matchedTags: matchedTags.length > 0 ? matchedTags : place.tags.slice(0, 2),
        vibeDescription: `${matchPercentage}% alignment with your mood: "${extractedTags.slice(0, 3).join(', ')}"`,
        detourMinutes: place.detourDeltaMinutes,
      });
    }

    // Sort by match percentage descending
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return NextResponse.json<VibeMatchResponse>({
      success: true,
      extractedTags,
      atmosphereSummary,
      matches: matches.slice(0, 4),
    });
  } catch (error: any) {
    console.error('Vibe match API error:', error);
    return NextResponse.json(
      {
        success: false,
        extractedTags: [],
        atmosphereSummary: 'Failed to process vibe match',
        matches: [],
      },
      { status: 500 }
    );
  }
}
