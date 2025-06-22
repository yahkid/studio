"use client"

import { useState } from 'react';
import dynamic from 'next/dynamic';

import { HeroSectionSw } from "@/components/sections/hero-section";
import { MissionSectionSw } from "@/components/sections/mission-section-sw";
import { WatchAndGrowSectionSw } from "@/components/sections/watch-and-grow-section-sw";
import { DecisionPathwaySectionSw } from "@/components/sections/decision-pathway-section-sw";
import { EventsSectionSw } from "@/components/sections/events-section";
import { PartnershipSectionSw } from "@/components/sections/partnership-section";

const LeadMagnetModal = dynamic(() => import('@/components/modals/lead-magnet-modal').then(mod => mod.LeadMagnetModal), { ssr: false });
const VisitPlannerModal = dynamic(() => import('@/components/modals/visit-planner-modal').then(mod => mod.VisitPlannerModal), { ssr: false });
const DecisionModal = dynamic(() => import('@/components/modals/decision-modal').then(mod => mod.DecisionModal), { ssr: false });
const ExitIntentModal = dynamic(() => import('@/components/modals/exit-intent-modal').then(mod => mod.ExitIntentModal), { ssr: false });

export function HomePageClient({ children }: { children: React.ReactNode }) {
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
  const [isVisitPlannerOpen, setIsVisitPlannerOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  return (
    <>
      <HeroSectionSw onOpenLeadMagnet={() => setIsLeadMagnetOpen(true)} />

      <div className="w-full space-y-12 md:space-y-16 lg:space-y-24">
        <MissionSectionSw />
        <WatchAndGrowSectionSw />

        <DecisionPathwaySectionSw onOpenDecisionModal={() => setIsDecisionModalOpen(true)} />
        
        {children}

        <EventsSectionSw onOpenVisitPlanner={() => setIsVisitPlannerOpen(true)} />
        <PartnershipSectionSw />
      </div>

      <LeadMagnetModal open={isLeadMagnetOpen} onOpenChange={setIsLeadMagnetOpen} />
      <VisitPlannerModal open={isVisitPlannerOpen} onOpenChange={setIsVisitPlannerOpen} />
      <DecisionModal open={isDecisionModalOpen} onOpenChange={setIsDecisionModalOpen} />
      <ExitIntentModal />
    </>
  );
}
