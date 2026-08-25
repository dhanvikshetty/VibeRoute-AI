import { NextRequest, NextResponse } from 'next/server';
import { VoiceAgentSchema } from '@/lib/validations';
import { MOCK_PLACES } from '@/lib/mockData';
import { VoiceAgentResponse, RankedPlace } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = VoiceAgentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          spokenResponse: "I didn't quite catch that. Could you repeat what spot or vibe you're looking for?",
          action: { type: 'NONE' },
        },
        { status: 400 }
      );
    }

    const { audioTranscript, currentCoords, theme } = validation.data;
    const apiKey = process.env.OPENAI_API_KEY;

    let targetCategory = 'cafe';
    let maxDetourMins = 10;
    let selectedPlace: RankedPlace = MOCK_PLACES[0];
    let spokenText = '';

    // 1. LLM Function-Calling / Intent Extraction (OpenAI or Local Regex Classifier)
    if (apiKey && apiKey !== 'your_openai_api_key_here') {
      try {
        const tools = [
          {
            type: 'function',
            function: {
              name: 'search_nearby_places',
              description: 'Search for high-rated spots along the active route corridor',
              parameters: {
                type: 'object',
                properties: {
                  category: {
                    type: 'string',
                    description: 'The category or food item requested, e.g. filter_coffee, bakery, temple, viewpoint, drinks',
                  },
                  max_detour_mins: {
                    type: 'number',
                    description: 'Maximum detour time allowed in minutes',
                  },
                },
                required: ['category'],
              },
            },
          },
        ];

        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'You are a hands-free navigation voice co-pilot. When a user asks for a spot (coffee, bakery, temple, gas, viewpoint), call search_nearby_places.',
              },
              {
                role: 'user',
                content: audioTranscript,
              },
            ],
            tools,
            tool_choice: 'auto',
          }),
        });

        if (openaiRes.ok) {
          const aiData = await openaiRes.json();
          const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
          if (toolCall) {
            const args = JSON.parse(toolCall.function.arguments);
            targetCategory = args.category || targetCategory;
            maxDetourMins = args.max_detour_mins || maxDetourMins;
          }
        }
      } catch (err) {
        console.warn('Voice agent LLM call fallback triggered:', err);
      }
    }

    // Local classifier fallback based on transcript
    const tLower = audioTranscript.toLowerCase();
    if (tLower.includes('coffee') || tLower.includes('filter coffee') || tLower.includes('breakfast')) {
      selectedPlace = MOCK_PLACES[0]; // Brahmin's Coffee Bar
    } else if (tLower.includes('bakery') || tLower.includes('croissant') || tLower.includes('bread') || tLower.includes('sourdough')) {
      selectedPlace = MOCK_PLACES[5]; // Rustic Pine Bakery
    } else if (tLower.includes('view') || tLower.includes('hill') || tLower.includes('overlook') || tLower.includes('scenic')) {
      selectedPlace = MOCK_PLACES[1]; // Cloud Nine Overlook Cafe
    } else if (tLower.includes('temple') || tLower.includes('spiritual') || tLower.includes('meditation')) {
      selectedPlace = MOCK_PLACES[2]; // Sri Someshwara Temple
    } else if (tLower.includes('drink') || tLower.includes('bar') || tLower.includes('rooftop') || tLower.includes('party')) {
      selectedPlace = MOCK_PLACES[3]; // Velvet Horizon Rooftop
    } else {
      selectedPlace = MOCK_PLACES[0];
    }

    spokenText = `Found ${selectedPlace.name} just ahead on your corridor, adding a ${selectedPlace.detourDeltaMinutes}-minute detour. Say "Lock it in" to add it to your route.`;

    return NextResponse.json<VoiceAgentResponse>({
      spokenResponse: spokenText,
      action: {
        type: 'ADD_WAYPOINT',
        category: targetCategory,
        payload: selectedPlace,
      },
    });
  } catch (error: any) {
    console.error('Voice agent route error:', error);
    return NextResponse.json<VoiceAgentResponse>(
      {
        spokenResponse: "Sorry, I had trouble processing that request right now.",
        action: { type: 'NONE' },
      },
      { status: 500 }
    );
  }
}
