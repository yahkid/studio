"use client";

import type { SermonDoc, PublishedTestimonyDoc } from '@/types/firestore';
import type { BuzzsproutEpisode } from '@/types/podcast';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlayCircle, MicVocal, Quote, Share2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PodcastMediaCard } from '../cards/podcast-media-card';

// New props interface
interface StoriesAndMediaSectionProps {
  sermon: (SermonDoc & { id: string }) | null;
  podcast: BuzzsproutEpisode | null;
  testimonial: PublishedTestimonyDoc | null;
  onOpenTestimonyModal: () => void;
}

// Component is no longer async
export function StoriesAndMediaSection({ sermon, podcast, testimonial, onOpenTestimonyModal }: StoriesAndMediaSectionProps) {

  return (
    <section id="tazama-na-ukue" className="w-full py-16 md:py-24 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
            Kua Nasi Kupitia Hadithi na Midia
          </h2>
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Gundua jumbe za hivi punde, sikiliza podikasti yetu, na upate kutiwa moyo na hadithi za mabadiliko kutoka kwa jamii yetu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Column 1: Featured Sermon */}
          <div className="md:col-span-1">
            {sermon ? (
              <Card className="flex flex-col h-full overflow-hidden">
                <CardHeader>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg group">
                    <Link href={`/sermons/${sermon.id}`}>
                      <Image
                        src={`https://img.youtube.com/vi/${sermon.youtube_video_id}/mqdefault.jpg`}
                        alt={`Thumbnail for ${sermon.title}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="bg-muted group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint="sermon thumbnail abstract"
                      />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider">Ujumbe wa Hivi Punde</p>
                  <CardTitle className="font-headline text-xl mt-2 line-clamp-2">
                    <Link href={`/sermons/${sermon.id}`} className="hover:text-primary transition-colors">
                      {sermon.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm font-body">Na {sermon.speaker}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full font-headline">
                    <Link href={`/sermons/${sermon.id}`}><PlayCircle className="mr-2 h-4 w-4" /> Tazama Sasa</Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Alert><PlayCircle className="h-4 w-4" /><AlertTitle>Hakuna Ujumbe</AlertTitle><AlertDescription>Hakuna ujumbe wa kuangaziwa uliopatikana.</AlertDescription></Alert>
            )}
          </div>
          
          {/* Column 2: Latest Podcast */}
          <div className="md:col-span-1">
            {podcast ? (
              <PodcastMediaCard episode={podcast} />
            ) : (
              <Alert><MicVocal className="h-4 w-4" /><AlertTitle>Hakuna Podikasti</AlertTitle><AlertDescription>Hakuna kipindi kipya cha podikasti kilichopatikana.</AlertDescription></Alert>
            )}
          </div>

          {/* Column 3: Testimonials */}
          <div className="md:col-span-2 lg:col-span-1">
            <Card className="flex flex-col h-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
               <CardHeader className="items-center text-center">
                 <div className="p-3 bg-card rounded-full mb-3">
                    <Quote className="h-6 w-6 text-primary" />
                 </div>
                 <CardTitle className="font-headline text-xl">Hadithi za Mabadiliko</CardTitle>
               </CardHeader>
               <CardContent className="flex-grow text-center">
                {testimonial ? (
                   <>
                    <blockquote className="font-body italic text-muted-foreground">
                      "{testimonial.quote}"
                    </blockquote>
                    <cite className="font-headline not-italic text-sm text-foreground mt-4 block">
                      – {testimonial.name}, {testimonial.location}
                    </cite>
                  </>
                ) : (
                  <p className="font-body text-muted-foreground">
                    Mungu anafanya mambo makuu katika jamii yetu. Kuwa wa kwanza kushiriki hadithi yako ya jinsi alivyogusa maisha yako.
                  </p>
                )}
               </CardContent>
               <CardFooter>
                <Button onClick={onOpenTestimonyModal} variant="outline" className="w-full font-headline bg-card/80 hover:bg-card" suppressHydrationWarning>
                   <Share2 className="mr-2 h-4 w-4"/>
                   Shiriki Hadithi Yako
                 </Button>
               </CardFooter>
             </Card>
          </div>

        </div>
      </div>
    </section>
  );
}
