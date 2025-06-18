
// src/app/api/podcast-episodes/route.ts
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const podcastId = process.env.NEXT_PUBLIC_BUZZSPROUT_PODCAST_ID;
  const apiKey = process.env.BUZZSPROUT_API_KEY;

  if (!podcastId || !apiKey) {
    return NextResponse.json(
      { error: 'Buzzsprout API credentials not configured.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');

  try {
    const response = await fetch(
      `https://www.buzzsprout.com/api/${podcastId}/episodes.json${limit ? `?limit=${limit}` : ''}`,
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
        { error: `Failed to fetch episodes from Buzzsprout: ${response.statusText}` },
        { status: response.status }
      );
    }

    const episodes = await response.json();
    return NextResponse.json(episodes);
  } catch (error) {
    console.error('Error fetching Buzzsprout episodes:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching episodes.' },
      { status: 500 }
    );
  }
}
