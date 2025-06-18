
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlayCircle, Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';

const videoThumbnails = [
  { id: '7Ja9JmMign0', alt: 'Video thumbnail 1' },
  { id: 'zqZlRS_v4z8', alt: 'Video thumbnail 2' },
  { id: 'SP3FVbEP0ps', alt: 'Video thumbnail 3' },
];

export function WatchAndGrowSectionSw() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient<Database>();

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
      const { error } = await supabase
        .from('weekly_updates_signups') 
        .insert({ email: email });

      if (error) throw error;

      toast({
        title: "Umefanikiwa Kujisajili!",
        description: "Utapokea ujumbe na taarifa zetu za kila wiki za kukutia moyo.",
      });
      setEmail('');
    } catch (caughtError: any) {
      const defaultMessage = "Imeshindwa kuwasilisha barua pepe yako. Tafadhali jaribu tena.";
      let description = defaultMessage;
      
      console.error('--- Supabase Insert Error Details (WatchAndGrowSectionSw) ---');
      console.error('Type of caughtError:', typeof caughtError);
      if (caughtError) {
        console.error('Caught Error Object:', caughtError);
        if (typeof caughtError.message === 'string' && caughtError.message.trim() !== '') {
          description = caughtError.message;
          console.error('Message property:', caughtError.message);
        } else if (typeof caughtError.error_description === 'string' && caughtError.error_description.trim() !== '') {
          description = caughtError.error_description;
          console.error('Error Description property:', caughtError.error_description);
        } else if (typeof caughtError === 'string') {
          description = caughtError;
        }

        if (caughtError.details) { 
          console.error('Details:', caughtError.details);
        }
        if (caughtError.code) {
          console.error('Code:', caughtError.code);
        }
        if (caughtError.hint) {
            console.error('Hint:', caughtError.hint);
        }
        try {
          console.error('Error JSON:', JSON.stringify(caughtError, null, 2));
        } catch (e_stringify) {
          console.error('Could not stringify caughtError:', e_stringify);
        }
      } else {
        console.error('Caught error is undefined or null.');
      }
      console.error('--- End Supabase Error Details (WatchAndGrowSectionSw) ---');
      
      toast({
        title: "Hitilafu Imetokea",
        description: description,
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
              src="https://www.youtube.com/embed/zqZlRS_v4z8" 
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
                  src={`https://img.youtube.com/vi/${thumb.id}/mqdefault.jpg`} 
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

