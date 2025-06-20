
"use client";

import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function MissionSectionSw() {
  return (
    <motion.section 
      id="dhamira" 
      className="w-full text-center py-16 md:py-24 space-y-8 bg-background"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <Heart className="h-16 w-16 text-primary mx-auto mb-6" /> 
        <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-6">
          FAMILIA ILIYOJENGWA KATIKA IMANI
        </h2>
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Dhamira yetu ni kukuunganisha: wewe na Mungu, wewe na wengine, na wewe na kusudi lako tukufu. Kama jamii ya kimataifa, tunashiriki nuru ya Yesu na kuleta tumaini, kuanzia hapa Tanzania hadi mwisho wa dunia.
        </p>
        <div className="w-32 h-1 mx-auto bg-muted-foreground/30 mt-10"></div>
      </div>
    </motion.section>
  );
}
