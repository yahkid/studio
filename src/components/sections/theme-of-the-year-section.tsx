
"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ThemeOfTheYearSection() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const verseText = `"Ee Naftali, uliyeshiba fadhili, Uliyejawa na baraka ya Bwana; Umiliki magharibi na kusini." - Kumbukumbu la Torati 33:23`;

  const handleCopy = () => {
    navigator.clipboard.writeText(verseText).then(() => {
      toast({
        title: "Copied to Clipboard!",
        description: "The theme verse has been copied.",
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Copy Failed",
        description: "Could not copy the verse. Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
    <motion.section
      id="neno-la-mwaka"
      className="relative w-full py-24 md:py-32 text-white overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1 }}
    >
      {/* Background Image */}
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="Celestial background with golden sun rays"
        fill
        style={{ objectFit: 'cover' }}
        quality={90}
        className="z-0"
        data-ai-hint="celestial light gold"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl font-bold uppercase tracking-wider mb-8">
            2025: MWAKA WAKO WA <span className="text-secondary">KUMILIKI</span>
          </h2>
          
          <div className="relative max-w-2xl mx-auto my-12">
            <blockquote className="font-body text-2xl md:text-3xl italic leading-relaxed md:leading-relaxed">
              <p>
                "Ee Naftali, uliyeshiba fadhili, Uliyejawa na baraka ya Bwana;
                <br />
                Umiliki magharibi na kusini."
              </p>
            </blockquote>
            <cite className="block text-right not-italic mt-4 text-base text-slate-300 font-body">
              — Kumbukumbu la Torati 33:23
            </cite>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="absolute -top-4 -right-4 h-10 w-10 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
                aria-label="Copy verse"
              >
                {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
              </Button>
            )}
          </div>

          <div className="font-body text-slate-200 space-y-6 max-w-3xl mx-auto text-lg leading-loose">
            <p>
              Hii sio kauli mbiu tu; hii ni <strong className="text-white">ahadi ya kinabii</strong> kwa ajili yako mwaka huu. Ni tamko kutoka mbinguni kwamba kila eneo la maisha yako limeandaliwa kwa ajili ya ushindi na upanuzi.
            </p>
            
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 my-8">
              <p className="font-semibold text-white mb-2">Fanya Hili Neno Kuwa Lako:</p>
              <p className="italic text-slate-200">
                "Ee Naftali (<span className="font-bold text-secondary">taja jina lako</span>), niliyeshiba fadhili, niliyejawa na baraka za Bwana; Ninamiliki magharibi na kusini."
              </p>
            </div>
            
            <p className="font-semibold text-white">Tembea Katika Ahadi Hii:</p>
            <p>
              Fanya tamko hili liwe pumzi ya maombi yako. Anza na maliza siku yako nalo. Kiri kwa ujasiri, amini kwa undani, na tazama Mungu akifungua milango ambayo hakuna awezaye kuifunga. Huu si mwaka mwingine tu—<strong className="text-secondary">huu ni mwaka wako wa kumiliki</strong>. Katika Jina la Yesu!
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
