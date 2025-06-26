"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookMarked } from 'lucide-react';

export function ThemeOfTheYearSection() {
  return (
    <motion.section
      id="neno-la-mwaka"
      className="w-full py-16 md:py-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="bg-muted/30 dark:bg-muted/10 border-primary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <BookMarked className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="font-headline text-4xl md:text-5xl text-foreground">
              2025 ni MWAKA WA KUMILIKI
            </CardTitle>
            <CardDescription className="font-body text-lg md:text-xl text-muted-foreground pt-2">
              Mstari wa Mwaka 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="font-body text-muted-foreground space-y-6 text-center leading-relaxed">
            <blockquote className="border-l-4 border-primary pl-6 py-2 text-left bg-background/50 my-6">
              <p className="text-lg md:text-xl italic">
                "Ee Naftali, uliyeshiba fadhili, Uliyejawa na baraka ya Bwana; Umiliki magharibi na kusini."
              </p>
              <cite className="block text-right not-italic mt-2 text-foreground font-semibold">
                Kumbukumbu la Torati 33:23
              </cite>
            </blockquote>

            <div>
              <p className="font-semibold text-foreground mb-2">
                Huu ni mstari ambao utatembea nao mwaka mzima ukikiri kumiliki katika kila eneo la maisha yako.
              </p>
              <p>
                Utakiri namna hii: <br />
                <span className="font-bold text-primary">"Ee Naftali (taja jina lako hapa), uliyeshiba fadhili, Uliyejawa na baraka ya Bwana; Umiliki magharibi na kusini."</span>
              </p>
            </div>

            <p>
              Kiri mstari huu asubuhi, kiri mchana na usiku pia. Tembea na mstari huu kwa imani, ukiri tena na tena. Na hakika utamiliki magharibi na utamiliki na kusini pia. Huu ni mwaka wa kumiliki kwako.
            </p>

            <div>
              <p className="font-semibold text-foreground">
                Wajibu wako mwaka huu ni:
              </p>
              <p>
                Kukiri ahadi za Bwana alizokuahidi, kuziamini ahadi hizo, kutenda sawasawa na neno lake, kumruhusu Roho Mtakatifu atawale maisha yako na kuishi maisha ya MAOMBI.
              </p>
            </div>
            
            <p className="text-lg font-bold text-foreground mt-4">
              Mpendwa, tembea katika neema ya kumiliki katika kila eneo la maisha yako katika jina la Yesu Kristo.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
