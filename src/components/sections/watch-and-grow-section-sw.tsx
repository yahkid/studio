
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlayCircle, Mail } from 'lucide-react';

export function WatchAndGrowSectionSw() {
  // Placeholder for form state and submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add email submission logic here
    console.log("Email submitted for weekly updates.");
  };

  return (
    <section id="tazama-na-ukue" className="w-full text-center py-16 md:py-24 space-y-6 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <PlayCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-6">
          UJUMBE UNAOBADILISHA KILA KITU
        </h2>
        
        {/* Featured Sermon Layout - Placeholder */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="aspect-video bg-slate-300 dark:bg-slate-700 rounded-lg shadow-xl overflow-hidden mb-6 flex items-center justify-center">
            {/* Large Featured Video */}
             <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/KMj5hG0FpEE" // Replace with actual Swahili sermon ID
              title="Ujumbe Maalum wa Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Small Thumbnails - Placeholder */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-md shadow-lg flex items-center justify-center text-muted-foreground">
                <Image src={`https://placehold.co/300x169.png`} alt={`Video ndogo ${item}`} width={300} height={169} className="w-full h-auto object-cover rounded-md" data-ai-hint="sermon video thumbnail" />
              </div>
            ))}
          </div>
        </div>

        {/* CRO #3: Email signup form */}
        <div className="max-w-xl mx-auto mt-12 p-6 sm:p-8 bg-card border rounded-lg shadow-xl">
          <h3 className="font-headline text-2xl text-foreground mb-4">
            Pata Ujumbe na Taarifa za Kila Wiki
          </h3>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email-watch-grow" className="sr-only">Barua pepe</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email-watch-grow" 
                  type="email" 
                  placeholder="Weka barua pepe yako hapa" 
                  required 
                  className="pl-10 font-body text-base"
                />
              </div>
            </div>
            <Button type="submit" className="w-full font-headline text-base">
              Jisajili Sasa
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
