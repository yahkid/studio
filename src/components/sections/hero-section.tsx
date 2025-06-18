
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
        src="https://placehold.co/1920x1080.png"
        alt="Woman reading a book, symbolizing finding wisdom and peace through HSCM Connect"
        fill
        style={{ objectFit: 'cover' }}
        quality={85}
        className="z-0"
        data-ai-hint="woman reading"
        priority
        suppressHydrationWarning={true}
      />
      <div className="absolute inset-0 bg-black/50 z-10"></div> {/* Overlay */}

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-headline font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tight">
            PATA MATUMAINI.
            <span className="block text-hscm-gold drop-shadow-md">GUNDUA KUSUDI.</span>
          </h1>

          <p className="font-body text-xl md:text-2xl text-slate-100 mb-10 max-w-xl mx-auto leading-relaxed">
            Holy Spirit Connect ni familia ya kimataifa inayounganisha ulimwengu na ujumbe wa Yesu Kristo unaoleta uzima.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button asChild size="lg" className="font-body font-semibold" suppressHydrationWarning={true}>
              <Link href="/#tazama-na-ukue">Tazama Ujumbe wa Karibuni</Link>
            </Button>
          </div>

          <div className="mt-12">
            <button
              onClick={onOpenLeadMagnet}
              className="font-body text-lg text-white hover:text-hscm-gold underline underline-offset-4 transition-colors duration-300"
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
