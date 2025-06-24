
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function MissionSectionSw() {
  return (
    <motion.section 
      id="dhamira" 
      className="w-full py-16 md:py-24 bg-background"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-6">
              WEWE NI SEHEMU YA FAMILIA
            </h2>
            <p className="font-body text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Sisi si jengo, bali ni watu. Familia ya kimataifa iliyounganishwa na upendo wa Yesu. Dhamira yetu ni rahisi: kukuunganisha na Mungu, na watu wengine, na kusudi la kipekee alilokuumbia.
            </p>
            <Button asChild size="lg" className="font-headline" suppressHydrationWarning={true}>
              <Link href="/about">
                Jifunze Zaidi Kuhusu Sisi
              </Link>
            </Button>
          </motion.div>
          <motion.div 
            className="aspect-square lg:aspect-[4/3] rounded-xl overflow-hidden shadow-lg border relative group"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Image
              src="/herosection.png"
              alt="HSCM Connect Leadership Team"
              fill
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-105 transition-transform duration-500 ease-in-out"
              data-ai-hint="leadership team diverse"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
