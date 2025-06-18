
"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MicVocal, ExternalLink } from 'lucide-react';

import { HeroSectionSw } from "@/components/sections/hero-section";
import { MissionSectionSw } from "@/components/sections/mission-section-sw";
import { WatchAndGrowSectionSw } from "@/components/sections/watch-and-grow-section-sw";
// PodcastSectionSw removed
import { DecisionPathwaySectionSw } from "@/components/sections/decision-pathway-section-sw";
import { TestimonialsSectionSw } from "@/components/sections/testimonials-section";
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

        {/* New Simplified Podcast Link Section */}
        <section id="podcast-link" className="w-full max-w-5xl mx-auto text-center py-12 md:py-16 space-y-6 px-4">
          <MicVocal className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="font-headline font-bold text-3xl md:text-4xl text-foreground mb-4">
            Sikiliza Podikasti Yetu
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Pata mafundisho yenye nguvu, mahojiano ya kuvutia, na jumbe za kukujenga katika imani yako. Bofya hapa chini kusikiliza vipindi vyote.
          </p>
          <Button asChild size="lg" className="font-headline text-lg" suppressHydrationWarning={true}>
            <Link href="https://innocentmorris.buzzsprout.com" target="_blank" rel="noopener noreferrer">
              Nenda Kwenye Podikasti <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>

        <DecisionPathwaySectionSw />
        <TestimonialsSectionSw />
        <EventsSectionSw onOpenVisitPlanner={() => setIsVisitPlannerOpen(true)} />
        <PartnershipSectionSw />
      </div>

      <LeadMagnetModal open={isLeadMagnetOpen} onOpenChange={setIsLeadMagnetOpen} />
      <VisitPlannerModal open={isVisitPlannerOpen} onOpenChange={setIsVisitPlannerOpen} />
      <ExitIntentModal />
    </div>
  );
}
