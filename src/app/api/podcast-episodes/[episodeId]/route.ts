
// src/app/api/podcast-episodes/[episodeId]/route.ts
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  const podcastId = process.env.NEXT_PUBLIC_BUZZSPROUT_PODCAST_ID;
  const apiKey = process.env.BUZZSPROUT_API_KEY;
  const { episodeId } = params;

  if (!podcastId || !apiKey) {
    return NextResponse.json(
      { error: 'Buzzsprout API credentials not configured.' },
      { status: 500 }
    );
  }

  if (!episodeId) {
    return NextResponse.json({ error: 'Episode ID is required.' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://www.buzzsprout.com/api/${podcastId}/episodes/${episodeId}.json`,
      {
        headers: {
          Authorization: `Token token=${apiKey}`,
        },
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Buzzsprout API Error:', response.status, errorData);
      return NextResponse.json(
        { error: `Failed to fetch episode ${episodeId} from Buzzsprout: ${response.statusText}` },
        { status: response.status }
      );
    }

    const episode = await response.json();
    return NextResponse.json(episode);
  } catch (error) {
    console.error(`Error fetching Buzzsprout episode ${episodeId}:`, error);
    return NextResponse.json(
      { error: 'Internal server error while fetching episode.' },
      { status: 500 }
    );
  }
}
