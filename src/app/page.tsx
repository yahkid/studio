import { StoriesAndMediaSection } from "@/components/sections/stories-and-media-section";
import { HomePageClient } from "./home-page-client";
import { ThemeOfTheYearSection } from "@/components/sections/theme-of-the-year-section";

export default async function HomePageSwahili() {
  return (
    <div className="flex flex-col items-center">
      <HomePageClient>
        {/* The new sections are passed as children to the client component */}
        <ThemeOfTheYearSection />
        <StoriesAndMediaSection />
      </HomePageClient>
    </div>
  );
}
