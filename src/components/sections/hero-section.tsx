
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // For CRO#1 text link

interface HeroSectionSwProps {
  onOpenLeadMagnet: () => void;
}

export function HeroSectionSw({ onOpenLeadMagnet }: HeroSectionSwProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden w-full">
      {/* Background Image */}
      <Image
        src="https://placehold.co/1920x1080.png" 
        alt="Abstract sunrise or light rays representing hope and Jesus as the light of the world - Picha ya miale ya nuru au jua linapochomoza kuwakilisha tumaini"
        layout="fill"
        objectFit="cover"
        quality={85}
        className="z-0"
        data-ai-hint="sunrise light rays abstract"
        priority
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-headline font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tight">
            PATA MATUMAINI. 
            <span className="block text-hscm-gold-dark-theme drop-shadow-md">GUNDUA KUSUDI.</span>
          </h1>
          
          <p className="font-body text-xl md:text-2xl text-slate-200 mb-10 max-w-xl mx-auto leading-relaxed">
            Holy Spirit Connect ni familia ya kimataifa inayounganisha ulimwengu na ujumbe wa Yesu Kristo unaoleta uzima.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="bg-hscm-green hover:bg-hscm-green/90 text-primary-foreground font-body font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-shadow"
              // onClick={() => { /* Link to watch page or open video modal */ }}
            >
              Tazama Ujumbe wa Karibuni
            </Button>
            {/* Secondary CTA from PRD (Plan your visit) is handled in Events section as per PRD */}
          </div>
          
          <div className="mt-8">
            <button 
              onClick={onOpenLeadMagnet}
              className="font-body text-slate-300 hover:text-white underline transition-colors text-lg"
            >
              Mgeni katika imani? Anza safari yako hapa.
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Renaming the old HeroSection to avoid conflict if it's still imported elsewhere, or it can be deleted.
export { HeroSectionSw as HeroSection };
