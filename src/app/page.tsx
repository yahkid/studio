import { StoriesAndMediaSection } from "@/components/sections/stories-and-media-section";
import { HomePageClient } from "./home-page-client";

export default async function HomePageSwahili() {
  return (
    <div className="flex flex-col items-center">
      <HomePageClient>
        {/* StoriesAndMediaSection is passed as a child to be rendered later */}
        <StoriesAndMediaSection />
      </HomePageClient>
    </div>
  );
}
