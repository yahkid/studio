"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; 

interface HeroSectionSwProps {
  onOpenLeadMagnet: () => void;
}

export function HeroSectionSw({ onOpenLeadMagnet }: HeroSectionSwProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden w-full">
      <Image
        src="/hscm-logo.png" 
        alt="Holy Spirit Connect Ministry Logo" 
        fill
        style={{ objectFit: 'contain' }} // Changed to contain for a logo
        quality={85}
        className="z-0 opacity-30 dark:opacity-20" // Made logo more subtle as background
        data-ai-hint="ministry logo background" 
        priority
        suppressHydrationWarning={true}
      />
      <div className="absolute inset-0 bg-black/70 z-10"></div> {/* Slightly darker Overlay for better text contrast if logo is light */}

      <div className="relative z-20 container mx-auto px-6 py-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white mb-6">
            PATA MATUMAINI.
            <br />
            GUNDUA KUSUDI LAKO KUU.
          </h1>

          <p className="font-body text-lg md:text-xl font-light text-slate-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Holy Spirit Connect: Familia ya kimataifa inayokuletea ujumbe wa Yesu Kristo unaobadilisha maisha yako, kukupa mwelekeo mpya, na kukujaza tumaini lisilokwisha.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="font-headline font-semibold text-lg px-8 py-3 w-full sm:w-auto"
              suppressHydrationWarning={true}
            >
              <Link href="/#tazama-na-ukue">Tazama Ujumbe Mpya</Link>
            </Button>
            <Button
              onClick={onOpenLeadMagnet}
              variant="outline"
              size="lg"
              className="font-headline font-semibold text-lg px-8 py-3 w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary"
              suppressHydrationWarning={true}
            >
              Anza Safari Yako Hapa
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
