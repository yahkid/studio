"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://placehold.co/1920x1080.png" 
        alt="Abstract sunrise or light rays representing hope and Jesus as the light of the world"
        layout="fill"
        objectFit="cover"
        quality={85}
        className="z-0"
        data-ai-hint="sunrise light rays abstract"
        priority
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-headline font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tight">
            Connecting You to the 
            <span className="block text-hscm-gold-dark-theme drop-shadow-md">Light of Life</span>
          </h1>
          
          <p className="font-body text-xl md:text-2xl text-slate-200 mb-10 max-w-xl mx-auto leading-relaxed">
            Discover the life-changing power of faith and community at Holy Spirit Connect Ministry.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-hscm-green hover:bg-hscm-green/90 text-primary-foreground font-body font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Plan Your Visit
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-hscm-green dark:border-hscm-gold-dark-theme dark:text-hscm-gold-dark-theme dark:hover:bg-hscm-gold-dark-theme dark:hover:text-black font-body font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Watch a Sermon
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}