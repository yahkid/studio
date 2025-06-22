
"use client"

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExternalLink, MicVocal } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

import { HeroSectionSw } from "@/components/sections/hero-section";
import { MissionSectionSw } from "@/components/sections/mission-section-sw";
import { WatchAndGrowSectionSw } from "@/components/sections/watch-and-grow-section-sw";
// PodcastSectionSw removed
import { DecisionPathwaySectionSw } from "@/components/sections/decision-pathway-section-sw";
import { TestimonialsSectionSw } from "@/components/sections/testimonials-section";
import { EventsSectionSw } from "@/components/sections/events-section";
import { PartnershipSectionSw } from "@/components/sections/partnership-section";

// Dynamically import modals to code-split them from the main bundle
const LeadMagnetModal = dynamic(() => import('@/components/modals/lead-magnet-modal').then(mod => mod.LeadMagnetModal), { ssr: false });
const VisitPlannerModal = dynamic(() => import('@/components/modals/visit-planner-modal').then(mod => mod.VisitPlannerModal), { ssr: false });
const DecisionModal = dynamic(() => import('@/components/modals/decision-modal').then(mod => mod.DecisionModal), { ssr: false });
const ExitIntentModal = dynamic(() => import('@/components/modals/exit-intent-modal').then(mod => mod.ExitIntentModal), { ssr: false });


export default function HomePageSwahili() {
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
  const [isVisitPlannerOpen, setIsVisitPlannerOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <HeroSectionSw onOpenLeadMagnet={() => setIsLeadMagnetOpen(true)} />

      <div className="w-full space-y-12 md:space-y-16 lg:space-y-24">
        <MissionSectionSw />
        <WatchAndGrowSectionSw />

        {/* New Simplified Podcast Link Section */}
        <motion.section 
          id="podcast-link" 
          className="w-full max-w-5xl mx-auto text-center py-12 md:py-16 space-y-6 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <MicVocal className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="font-headline font-bold text-3xl md:text-4xl text-foreground mb-4">
            Jilishe Imani Yako,Popote ulipo
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Sikiliza mafundisho yenye nguvu, mahojiano ya kusisimua, na jumbe za kukutia moyo. Podikasti yetu imeundwa kwa ajili ya safari yako ya kiroho.
          </p>
          <Button asChild size="lg" className="font-headline text-lg" suppressHydrationWarning={true}>
            <Link href="https://innocentmorris.buzzsprout.com" target="_blank" rel="noopener noreferrer">
              Nenda Kwenye Podikasti <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.section>

        <DecisionPathwaySectionSw onOpenDecisionModal={() => setIsDecisionModalOpen(true)} />
        <TestimonialsSectionSw />
        <EventsSectionSw onOpenVisitPlanner={() => setIsVisitPlannerOpen(true)} />
        <PartnershipSectionSw />
      </div>

      <LeadMagnetModal open={isLeadMagnetOpen} onOpenChange={setIsLeadMagnetOpen} />
      <VisitPlannerModal open={isVisitPlannerOpen} onOpenChange={setIsVisitPlannerOpen} />
      <DecisionModal open={isDecisionModalOpen} onOpenChange={setIsDecisionModalOpen} />
      <ExitIntentModal />
    </div>
  );
}
