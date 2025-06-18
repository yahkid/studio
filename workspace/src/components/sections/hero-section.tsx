
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; 

export function HeroSectionSw() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden w-full">
      <Image
        src="/Gemini_Generated_Image_asrt4uasrt4uasrt.png" 
        alt="Joyful congregation celebrating at HSCM Connect." 
        fill
        style={{ objectFit: 'cover' }}
        quality={85}
        className="z-0"
        data-ai-hint="church congregation" 
        priority
        suppressHydrationWarning={true}
      />
      <div className="absolute inset-0 bg-black/60 z-10"></div> {/* Overlay */}

      <div className="relative z-20 container mx-auto px-6 py-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white mb-6">
            PATA MATUMAINI.
            <br />
            GUNDUA KUSUDI LAKO KUU.
          </h1>

          <p className="font-body text-lg md:text-xl font-light text-slate-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Holy Spirit Connect: Familia ya kimataifa inayokuletea ujumbe wa Yesu Kristo unaobadilisha maisha yako, kukupa mwelekeo mpya, na kukujaza tumaini lisilokwisha.
          </p>

          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="font-headline font-semibold text-lg px-8 py-3"
              suppressHydrationWarning={true}
            >
              <Link href="/#tazama-na-ukue">Tazama Ujumbe Mpya</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
