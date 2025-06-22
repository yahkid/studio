import { TestimonialsSectionSw } from "@/components/sections/testimonials-section";
import { HomePageClient } from "./home-page-client";

export default async function HomePageSwahili() {
  return (
    <div className="flex flex-col items-center">
      <HomePageClient>
        <TestimonialsSectionSw />
      </HomePageClient>
    </div>
  );
}
