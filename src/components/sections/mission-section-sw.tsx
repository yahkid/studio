
"use client";

import { Heart } from 'lucide-react';

export function MissionSectionSw() {
  return (
    <section id="dhamira" className="w-full text-center py-16 md:py-24 space-y-8 bg-background">
      <div className="container mx-auto px-4">
        <Heart className="h-16 w-16 text-primary mx-auto mb-6" /> 
        <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-6">
          FAMILIA ILIYOJENGWA KATIKA IMANI
        </h2>
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Katika Holy Spirit Connect, tunakuletea pamoja: wewe na Mungu, wewe na wengine, na wewe na kusudi lako tukufu. Sisi ni jamii iliyojikita katika tumaini la Yesu, tukiongozwa na Roho Mtakatifu kuangaza nuru na kuleta uzima, hapa Tanzania na kote ulimwenguni.
        </p>
        <div className="w-32 h-1 mx-auto bg-muted-foreground/30 mt-10"></div>
      </div>
    </section>
  );
}

