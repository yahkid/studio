// src/lib/media.ts
import { db } from '@/lib/firebaseClient';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import type { SermonDoc, PublishedTestimonyDoc } from '@/types/firestore';
import type { BuzzsproutEpisode } from '@/types/podcast';

export async function getFeaturedSermon() {
  try {
    const sermonsQuery = query(
      collection(db, "sermons"),
      where("is_featured", "==", true),
      where("is_published", "==", true),
      orderBy("sermon_date", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(sermonsQuery);
    if (querySnapshot.empty) return null;
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as SermonDoc & { id: string };
  } catch (error) {
    console.error("Error fetching featured sermon for media section:", error);
    return null;
  }
}

export async function getLatestPodcast() {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9002';
    const response = await fetch(`${baseUrl}/api/podcast-episodes?limit=1`, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    const episodes: BuzzsproutEpisode[] = await response.json();
    return episodes[0] || null;
  } catch (error) {
    console.error("Error fetching latest podcast for media section:", error);
    return null;
  }
}

export async function getLatestTestimonial() {
  try {
    const testimonialsQuery = query(
      collection(db, "published_testimonials"),
      orderBy("published_at", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(testimonialsQuery);
    if (querySnapshot.empty) return null;
    return querySnapshot.docs[0].data() as PublishedTestimonyDoc;
  } catch (error) {
    console.error("Error fetching latest testimonials for media section:", error);
    return null;
  }
}
