
"use client"

import { useState } from 'react';
import { HeroSectionSw } from "@/components/sections/hero-section";
import { MissionSectionSw } from "@/components/sections/mission-section-sw";
import { WatchAndGrowSectionSw } from "@/components/sections/watch-and-grow-section-sw";
import { DecisionPathwaySectionSw } from "@/components/sections/decision-pathway-section-sw";
import { EventsSectionSw } from "@/components/sections/events-section";
import { PartnershipSectionSw } from "@/components/sections/partnership-section";

import { LeadMagnetModal } from "@/components/modals/lead-magnet-modal";
import { VisitPlannerModal } from "@/components/modals/visit-planner-modal";
import { ExitIntentModal } from "@/components/modals/exit-intent-modal";

export default function HomePageSwahili() {
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
  const [isVisitPlannerOpen, setIsVisitPlannerOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <HeroSectionSw onOpenLeadMagnet={() => setIsLeadMagnetOpen(true)} />

      <div className="w-full space-y-12 md:space-y-16 lg:space-y-24">
        <MissionSectionSw />
        <WatchAndGrowSectionSw />
        <DecisionPathwaySectionSw />
        <EventsSectionSw onOpenVisitPlanner={() => setIsVisitPlannerOpen(true)} />
        <PartnershipSectionSw onOpenVisitPlanner={() => setIsVisitPlannerOpen(true)} />
      </div>

      <LeadMagnetModal open={isLeadMagnetOpen} onOpenChange={setIsLeadMagnetOpen} />
      <VisitPlannerModal open={isVisitPlannerOpen} onOpenChange={setIsVisitPlannerOpen} />
      <ExitIntentModal />
    </div>
  );
}
