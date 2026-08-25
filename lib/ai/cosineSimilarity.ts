import { TripTheme } from '@/types';
import { generateMockEmbedding } from '@/lib/mockData';

export const THEME_SEMANTIC_ANCHORS: Record<TripTheme, string> = {
  SPIRITUAL_PILGRIMAGE: 'peaceful ancient temple shrine meditation sacred serenity silence prayer chant architecture sanctuary tranquil',
  HERITAGE_CULTURE: 'historic royal palace monument stone carvings museum artisan heritage craftsmanship fortress antiquity classical',
  ROAD_TRIP_ADVENTURE: 'scenic highway ridge viewpoint mountain pass outdoor cliff valley winding roads nature adrenaline trek waterfall',
  FOODIE_CRAWL: 'authentic filter coffee crispy vada artisan sourdough heritage bakery local cuisine specialty roast single origin gourmet',
  UNWIND_CHILL: 'quiet lakeside aesthetic cafe garden courtyard relaxing hammock reading slow living tranquil calm ambient books tea',
  NIGHTLIFE_PARTY: 'high-energy neon rooftop bar craft cocktails dj music nightlife dance lounge vibrant electronic beats pub live music',
};

/**
 * Computes exact cosine similarity between two 1536-dimensional vectors A and B:
 * Cosine(A, B) = (A • B) / (||A|| * ||B||)
 */
export function computeCosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length || a.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;

  const similarity = dotProduct / (normA * normB);
  return Math.max(0, Math.min(1, similarity));
}

/**
 * Strict threshold filter (>0.75 cutoff) from ALGORITHMS.md Workflow 2
 */
export const VIBE_SIMILARITY_CUTOFF = 0.75;

export function isVibeCompatible(themeVector: number[], venueVector: number[]): boolean {
  const similarity = computeCosineSimilarity(themeVector, venueVector);
  return similarity >= VIBE_SIMILARITY_CUTOFF;
}

/**
 * Generate embedding for a theme or query string.
 * Uses OpenAI text-embedding-3-small if API key is present, otherwise deterministic fallback.
 */
export async function getVectorEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey !== 'your_openai_api_key_here') {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.data[0].embedding;
      }
    } catch (err) {
      console.warn('OpenAI Embedding API error, falling back to local vector math:', err);
    }
  }

  // Fallback high-dimensional embedding simulation
  return generateMockEmbedding(text);
}
