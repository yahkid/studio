"use client";

import Link from 'next/link';
import Image from 'next/image';
import { HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DecisionPathwaySectionSwProps {
  onOpenDecisionModal: () => void;
}

export function DecisionPathwaySectionSw({ onOpenDecisionModal }: DecisionPathwaySectionSwProps) {
  return (
    <section id="njia-ya-uamuzi" className="w-full max-w-5xl mx-auto text-center py-16 md:py-24 space-y-6 px-4">
      <div className="aspect-video w-full rounded-lg border overflow-hidden relative">
        <Image
          src="/Gemini_Generated_Image_asrt4uasrt4uasrt.png"
          alt="Inspirational image related to making a faith decision"
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint="inspirational faith"
        />
      </div>
      <h2 className="font-headline text-4xl md:text-5xl text-foreground mt-10 mb-4">
        UMEFANYA UAMUZI LEO?
      </h2>
      <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
        Hongera kwa uamuzi wako mkuu! Sisi sote katika HSCM Connect tunafurahi pamoja nawe. Tuko hapa kukushika mkono na kukuongoza katika hatua zako za kwanza za safari hii mpya na ya kusisimua.
      </p>
      <Button onClick={onOpenDecisionModal} size="lg" className="text-lg font-headline" suppressHydrationWarning={true}>
        Nimeamua Leo <HandHeart className="ml-2 h-5 w-5" />
      </Button>
    </section>
  );
}
