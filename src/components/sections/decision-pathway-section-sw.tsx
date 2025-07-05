
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface DecisionPathwaySectionSwProps {
  onOpenDecisionModal: () => void;
}

export function DecisionPathwaySectionSw({ onOpenDecisionModal }: DecisionPathwaySectionSwProps) {
  return (
    <motion.section 
      id="njia-ya-uamuzi" 
      className="w-full max-w-5xl mx-auto text-center py-16 md:py-24 space-y-6 px-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
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
        HATUA MUHIMU ZAIDI
      </h2>
      <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
        Kufanya uamuzi wa kumfuata Yesu ni hatua muhimu zaidi utakayowahi kuichukua. Tunasherehekea nawe! Bofya hapa chini ili tushiriki furaha hii na tukuongoze katika safari yako mpya.
      </p>
      <Button onClick={onOpenDecisionModal} size="lg" className="text-lg font-headline" suppressHydrationWarning={true}>
        Nimeamua Leo <HandHeart className="ml-2 h-5 w-5" />
      </Button>
    </motion.section>
  );
}
