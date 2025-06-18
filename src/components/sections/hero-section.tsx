
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; 

interface HeroSectionSwProps {
  onOpenLeadMagnet: () => void;
}

export function HeroSectionSw({ onOpenLeadMagnet }: HeroSectionSwProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden w-full">
      <Image
        src="/DSC00243.png" 
        alt="Washirika wa Holy Spirit Connect Ministry wamesimama pamoja nje - Holy Spirit Connect Ministry members standing together outdoors"
        layout="fill"
        objectFit="cover"
        quality={85}
        className="z-0"
        data-ai-hint="group people"
        priority
        suppressHydrationWarning={true}
      />
      <div className="absolute inset-0 bg-black/50 z-10"></div> {/* Slightly increased overlay for text visibility */}

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-headline font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tight">
            PATA MATUMAINI.
            <span className="block text-hscm-gold-dark-theme drop-shadow-md">GUNDUA KUSUDI.</span>
          </h1>

          <p className="font-body text-xl md:text-2xl text-slate-100 mb-10 max-w-xl mx-auto leading-relaxed"> {/* Slightly lighter text color */}
            Holy Spirit Connect ni familia ya kimataifa inayounganisha ulimwengu na ujumbe wa Yesu Kristo unaoleta uzima.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-hscm-green hover:bg-hscm-green/90 text-primary-foreground font-body font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-shadow"
              href="/#tazama-na-ukue"
              suppressHydrationWarning={true}
            >
              <Link href="/#tazama-na-ukue">Tazama Ujumbe wa Karibuni</Link>
            </Button>
          </div>

          <div className="mt-8">
            <button
              onClick={onOpenLeadMagnet}
              className="font-body text-slate-200 hover:text-white underline transition-colors text-lg"
              suppressHydrationWarning={true}
            >
              Mgeni katika imani? Anza safari yako hapa.
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
