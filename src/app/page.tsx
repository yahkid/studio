import { StoriesAndMediaSection } from "@/components/sections/stories-and-media-section";
import { HomePageClient } from "./home-page-client";

export default async function HomePageSwahili() {
  return (
    <div className="flex flex-col items-center">
      <HomePageClient>
        {/* The new section is passed as a child to the client component */}
        <StoriesAndMediaSection />
      </HomePageClient>
    </div>
  );
}
