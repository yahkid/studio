import { db } from '@/lib/firebaseClient';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import type { SermonDoc, PublishedTestimonyDoc } from '@/types/firestore';
import type { BuzzsproutEpisode } from '@/types/podcast';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlayCircle, MicVocal, MessageSquare, Quote } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PodcastMediaCard } from '../cards/podcast-media-card';

async function getFeaturedSermon() {
  try {
    const sermonsQuery = query(
      collection(db, "sermons"),
      where("is_featured", "==", true),
      where("is_published", "==", true),
      orderBy("sermon_date", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(sermonsQuery);
    if (querySnapshot.empty) return null;
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as SermonDoc & { id: string };
  } catch (error) {
    console.error("Error fetching featured sermon for media section:", error);
    return null;
  }
}

async function getLatestPodcast() {
  try {
    // We assume the API endpoint is running on the same host
    // In a real production environment, use the full absolute URL
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9002';
    const response = await fetch(`${baseUrl}/api/podcast-episodes?limit=1`, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    const episodes: BuzzsproutEpisode[] = await response.json();
    return episodes[0] || null;
  } catch (error) {
    console.error("Error fetching latest podcast for media section:", error);
    return null;
  }
}

async function getLatestTestimonials() {
  try {
    const testimonialsQuery = query(
      collection(db, "published_testimonials"),
      orderBy("published_at", "desc"),
      limit(2)
    );
    const querySnapshot = await getDocs(testimonialsQuery);
    return querySnapshot.docs.map(doc => doc.data() as PublishedTestimonyDoc);
  } catch (error) {
    console.error("Error fetching latest testimonials for media section:", error);
    return [];
  }
}

export async function StoriesAndMediaSection() {
  const [sermon, podcast, testimonials] = await Promise.all([
    getFeaturedSermon(),
    getLatestPodcast(),
    getLatestTestimonials(),
  ]);

  return (
    <section id="stories-and-media" className="w-full py-16 md:py-24 bg-muted/30 dark:bg-muted/10">
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
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            {testimonials.length > 0 ? (
              testimonials.map((testimony, index) => (
                <Card key={index} className="bg-background/70">
                    <CardContent className="p-6">
                        <Quote className="h-5 w-5 text-primary mb-2" />
                        <blockquote className="font-body italic text-muted-foreground">
                        "{testimony.quote}"
                        </blockquote>
                        <cite className="font-headline not-italic text-sm text-foreground mt-4 block text-right">
                        – {testimony.name}
                        </cite>
                    </CardContent>
                </Card>
              ))
            ) : (
                <Alert><MessageSquare className="h-4 w-4" /><AlertTitle>Hakuna Shuhuda</AlertTitle><AlertDescription>Hakuna shuhuda za umma zilizopatikana.</AlertDescription></Alert>
            )}
             {testimonials.length === 0 && (
                <Card className="bg-background/70">
                    <CardContent className="p-6">
                        <Quote className="h-5 w-5 text-primary mb-2" />
                        <blockquote className="font-body italic text-muted-foreground">
                        "Nilikuwa nimekata tamaa, lakini HSCM ilinipa tumaini. Sasa nina furaha na nguvu mpya."
                        </blockquote>
                        <cite className="font-headline not-italic text-sm text-foreground mt-4 block text-right">
                        – John Peter (Mfano)
                        </cite>
                    </CardContent>
                </Card>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
