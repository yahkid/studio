import { HomePageClient } from "./home-page-client";
import { getFeaturedSermon, getLatestPodcast, getLatestTestimonial } from '@/lib/media';

export default async function HomePageSwahili() {
  const sermon = await getFeaturedSermon();
  const podcast = await getLatestPodcast();
  const testimonial = await getLatestTestimonial();
  
  // This page now passes ALL data needed by its client children
  return (
    <div className="flex flex-col items-center">
      <HomePageClient 
        sermon={sermon}
        podcast={podcast}
        testimonial={testimonial}
      />
    </div>
  );
}
