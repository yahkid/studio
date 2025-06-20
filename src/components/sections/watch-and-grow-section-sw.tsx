
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlayCircle, Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Shuffled order of local image thumbnails
const videoThumbnails = [
  { id: 'local-thumb-2', src: '/images/video-thumb-2.jpg', alt: 'Video thumbnail 2 - Local' },
  { id: 'local-thumb-3', src: '/images/video-thumb-3.jpg', alt: 'Video thumbnail 3 - Local' },
  { id: 'local-thumb-1', src: '/images/video-thumb-1.jpg', alt: 'Video thumbnail 1 - Local' },
];

export function WatchAndGrowSectionSw() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Barua Pepe Batili",
        description: "Tafadhali ingiza anwani sahihi ya barua pepe.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'weekly_updates_signups'), { 
        email: email,
        created_at: serverTimestamp(),
        source: 'watch_grow_section'
      });

      toast({
        title: "Umefanikiwa Kujisajili!",
        description: "Utapokea ujumbe na taarifa zetu za kila wiki za kukutia moyo.",
      });
      setEmail('');
    } catch (error: any) {
      console.error('Error submitting weekly updates signup to Firestore:', error);
      toast({
        title: "Hitilafu Imetokea",
        description: `Imeshindwa kuwasilisha barua pepe yako. Tafadhali jaribu tena. ${error.message || ""}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="tazama-na-ukue" className="w-full text-center py-16 md:py-24 space-y-6 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <PlayCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-6">
          UJUMBE UNAOBADILISHA KILA KITU
        </h2>
        
        <div className="max-w-4xl mx-auto mb-12">
          <div className="aspect-video bg-slate-300 dark:bg-slate-700 rounded-lg border overflow-hidden mb-6 flex items-center justify-center">
             <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/otilKkEuRDg" 
              title="Ujumbe Maalum wa Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videoThumbnails.map((thumb) => (
              <div key={thumb.id} className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-md border flex items-center justify-center text-muted-foreground">
                <Image 
                  src={thumb.src} 
                  alt={thumb.alt} 
                  width={300} 
                  height={169} 
                  className="w-full h-auto object-cover rounded-md" 
                  data-ai-hint="video sermon" />
              </div>
            ))}
          </div>
        </div>

        <Card className="max-w-xl mx-auto mt-12 p-6 sm:p-8">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-foreground mb-2">
              Pokea Neno la Wiki Linaloweza Kubadilisha Maisha Yako
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email-watch-grow" className="sr-only">Barua pepe</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email-watch-grow" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Weka barua pepe yako hapa" 
                    required 
                    className="pl-10 font-body text-base"
                    suppressHydrationWarning={true}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">Hatutakutumia barua taka. Faragha yako ni muhimu.</p>
              <Button type="submit" className="w-full font-headline text-base" suppressHydrationWarning={true} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Inasajili...' : 'Pata Taarifa za Wiki'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

