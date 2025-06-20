
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface HeroSectionSwProps {
  onOpenLeadMagnet: () => void;
}

export function HeroSectionSw({ onOpenLeadMagnet }: HeroSectionSwProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden w-full">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/hscm-logo.png"
          alt="HSCM Connect Logo as background"
          fill
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          quality={85}
          className="opacity-5 dark:opacity-10"
          data-ai-hint="logo background"
          priority
          suppressHydrationWarning={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 z-10"></div>
      </motion.div>
      <div className="absolute inset-0 bg-black/60 z-10"></div> {/* Overlay */}

      <div className="relative z-20 container mx-auto px-6 py-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white mb-6"
          >
            PATA MATUMAINI.
            <br />
            GUNDUA KUSUDI LAKO KUU.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="font-body text-lg md:text-xl font-light text-slate-100 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Karibu kwenye familia ya kimataifa inayojengwa katika tumaini la Yesu. Tuko hapa kukusaidia ugundue kusudi lako na kuishi maisha yaliyojaa furaha na mwelekeo.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="font-headline font-semibold text-lg px-8 py-3 w-full sm:w-auto transition-transform hover:scale-105"
              suppressHydrationWarning={true}
            >
              <Link href="/#tazama-na-ukue">Tazama Ujumbe Mpya</Link>
            </Button>
            <Button
              onClick={onOpenLeadMagnet}
              variant="outline"
              size="lg"
              className="font-headline font-semibold text-lg px-8 py-3 w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary transition-transform hover:scale-105"
              suppressHydrationWarning={true}
            >
              Anza Safari Yako Hapa
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
