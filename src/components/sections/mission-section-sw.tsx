
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
          Kuunganisha watu na Mungu, wao kwa wao, na na kusudi walilopewa na Mungu—ndio moyo wa Holy Spirit Connect. Sisi ni jamii inayojengwa juu ya tumaini la Yesu, na kutiwa nguvu na Roho kuleta nuru na uzima Tanzania na ulimwenguni kote.
        </p>
        <div className="w-32 h-1 mx-auto bg-muted-foreground/30 mt-10"></div>
      </div>
    </section>
  );
}
