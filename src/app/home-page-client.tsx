"use client"

import React from 'react';
import dynamic from 'next/dynamic';

// Import types for props
import type { SermonDoc, PublishedTestimonyDoc } from '@/types/firestore';
import type { BuzzsproutEpisode } from '@/types/podcast';

import { HeroSectionSw } from "@/components/sections/hero-section";
import { MissionSectionSw } from "@/components/sections/mission-section-sw";
import { DecisionPathwaySectionSw } from "@/components/sections/decision-pathway-section-sw";
import { EventsSectionSw } from "@/components/sections/events-section";
import { PartnershipSectionSw } from "@/components/sections/partnership-section";
import { ThemeOfTheYearSection } from '@/components/sections/theme-of-the-year-section';
import { StoriesAndMediaSection } from '@/components/sections/stories-and-media-section';

const LeadMagnetModal = dynamic(() => import('@/components/modals/lead-magnet-modal').then(mod => mod.LeadMagnetModal), { ssr: false });
const VisitPlannerModal = dynamic(() => import('@/components/modals/visit-planner-modal').then(mod => mod.VisitPlannerModal), { ssr: false });
const DecisionModal = dynamic(() => import('@/components/modals/decision-modal').then(mod => mod.DecisionModal), { ssr: false });
const ExitIntentModal = dynamic(() => import('@/components/modals/exit-intent-modal').then(mod => mod.ExitIntentModal), { ssr: false });
const TestimonyModal = dynamic(() => import('@/components/modals/testimony-modal').then(mod => mod.TestimonyModal), { ssr: false });

// Define props interface
interface HomePageClientProps {
  sermon: (SermonDoc & { id: string }) | null;
  podcast: BuzzsproutEpisode | null;
  testimonial: PublishedTestimonyDoc | null;
}

export function HomePageClient({ sermon, podcast, testimonial }: HomePageClientProps) {
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = React.useState(false);
  const [isVisitPlannerOpen, setIsVisitPlannerOpen] = React.useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = React.useState(false);
  const [isTestimonyModalOpen, setIsTestimonyModalOpen] = React.useState(false);

  return (
    <>
      <HeroSectionSw onOpenLeadMagnet={() => setIsLeadMagnetOpen(true)} />

      <div className="w-full space-y-12 md:space-y-16 lg:space-y-24">
        <ThemeOfTheYearSection />
        <MissionSectionSw />
        
        {/* Render StoriesAndMediaSection directly, passing props */}
        <StoriesAndMediaSection 
          sermon={sermon}
          podcast={podcast}
          testimonial={testimonial}
          onOpenTestimonyModal={() => setIsTestimonyModalOpen(true)} 
        />

        <DecisionPathwaySectionSw onOpenDecisionModal={() => setIsDecisionModalOpen(true)} />
        <EventsSectionSw onOpenVisitPlanner={() => setIsVisitPlannerOpen(true)} />
        <PartnershipSectionSw />
      </div>

      <LeadMagnetModal open={isLeadMagnetOpen} onOpenChange={setIsLeadMagnetOpen} />
      <VisitPlannerModal open={isVisitPlannerOpen} onOpenChange={setIsVisitPlannerOpen} />
      <DecisionModal open={isDecisionModalOpen} onOpenChange={setIsDecisionModalOpen} />
      <TestimonyModal open={isTestimonyModalOpen} onOpenChange={setIsTestimonyModalOpen} />
      <ExitIntentModal />
    </>
  );
}
