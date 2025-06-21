
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlayCircle, Mail, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';

const videoThumbnails = [
  { 
    id: 'unsplash-1', 
    src: 'https://images.unsplash.com/photo-1682263557097-6802ff30e59f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx2aWRlbyUyMHNlcm1vbnxlbnwwfHx8fDE3NTA0MzE5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080', 
    alt: 'Sermon video playing on a screen in a dark room.' 
  },
  { 
    id: 'unsplash-2', 
    src: 'https://images.unsplash.com/photo-1589320843284-4b70884083a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHx2aWRlbyUyMHNlcm1vbnxlbnwwfHx8fDE3NTA0MzE5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080', 
    alt: 'Person watching a sermon on a laptop with headphones.' 
  },
  { 
    id: 'unsplash-3', 
    src: 'https://images.unsplash.com/photo-1589227864558-dc4ed168ebcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx2aWRlbyUyMHNlcm1vbnxlbnwwfHx8fDE3NTA0MzE5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080', 
    alt: 'Church service being recorded from the back of the room.' 
  },
];

export function WatchAndGrowSectionSw() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [displayedThumbnails, setDisplayedThumbnails] = useState(videoThumbnails);

  useEffect(() => {
    const shuffleArray = (array: typeof videoThumbnails) => {
      let currentIndex = array.length;
      let randomIndex;
      const newArray = [...array];

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
      }
      return newArray;
    };
    setDisplayedThumbnails(shuffleArray(videoThumbnails));
  }, []);

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
    <motion.section 
      id="tazama-na-ukue" 
      className="w-full text-center py-16 md:py-24 space-y-6 bg-muted/30 dark:bg-muted/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <PlayCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-6">
          UJUMBE UNAOBADILISHA KILA KITU
        </h2>
        
        <div className="max-w-4xl mx-auto mb-12">
          <div className="aspect-video bg-slate-300 dark:bg-slate-700 rounded-lg border overflow-hidden mb-6 flex items-center justify-center">
             <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/DpA0drOZsKc" 
              title="Ujumbe Maalum wa Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayedThumbnails.map((thumb) => (
              <div key={thumb.id} className="group relative aspect-video overflow-hidden rounded-md border">
                <Image 
                  src={thumb.src} 
                  alt={thumb.alt} 
                  width={300} 
                  height={169} 
                  className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300" 
                  data-ai-hint="video sermon" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white/80" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="max-w-xl mx-auto mt-12 p-6 sm:p-8">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-foreground mb-2">
              Anza Wiki Yako kwa Nguvu
            </CardTitle>
            <CardDescription>
              Jisajili sasa upokee jumbe za kutia moyo na mafundisho mapya kila wiki, moja kwa moja kwenye barua pepe yako.
            </CardDescription>
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
                {isLoading ? 'Inasajili...' : 'Nitumie Neno la Wiki'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
