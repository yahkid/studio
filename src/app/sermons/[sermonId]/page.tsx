import { db } from '@/lib/firebaseClient';
import { doc, getDoc, type Timestamp } from 'firebase/firestore';
import type { SermonDoc } from '@/types/firestore';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, User, Calendar, Headphones, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
  params: { sermonId: string };
};

async function getSermonById(id: string): Promise<(SermonDoc & { id: string }) | null> {
  if (!db) return null;
  try {
    const docRef = doc(db, 'sermons', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }
    return { id: docSnap.id, ...docSnap.data() } as (SermonDoc & { id: string });
  } catch (error) {
    console.error(`Error fetching sermon with id ${id}:`, error);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const sermon = await getSermonById(params.sermonId);

  if (!sermon) {
    return {
      title: 'Hubiri Halikupatikana | HSCM Connect',
    };
  }

  const description = sermon.description.substring(0, 160).replace(/\s\w+$/, '...');
  const imageUrl = `https://img.youtube.com/vi/${sermon.youtube_video_id}/maxresdefault.jpg`;

  return {
    title: `${sermon.title} | Mahubiri ya HSCM Connect`,
    description: description,
    openGraph: {
      title: sermon.title,
      description: description,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: 'video.episode',
      publishedTime: sermon.sermon_date.toDate().toISOString(),
      authors: [sermon.speaker],
    },
  };
}

export default async function SermonPage({ params }: Props) {
  const sermon = await getSermonById(params.sermonId);

  if (!sermon) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
        <Button asChild variant="outline" className="mb-8 font-body">
          <Link href="/sermons">
            &larr; Rudi Kwenye Mahubiri Yote
          </Link>
        </Button>
      <Card>
        <CardHeader>
            <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden mb-6 border">
                <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${sermon.youtube_video_id}`}
                title={sermon.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                ></iframe>
            </div>
            <CardTitle className="font-headline text-3xl md:text-4xl text-foreground">
                {sermon.title}
            </CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-muted-foreground font-body text-sm mt-2">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Mzungumzaji: {sermon.speaker}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={sermon.sermon_date.toDate().toISOString()}>
                    {format(sermon.sermon_date.toDate(), 'MMMM d, yyyy')}
                    </time>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <h3 className="font-headline text-xl text-foreground mb-2">Maelezo:</h3>
            <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                {sermon.description}
            </p>
            
            {(sermon.audioDownloadUrl || sermon.videoDownloadUrl) && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-headline text-lg font-semibold mb-3 text-foreground">Pakua Rasilimali:</h4>
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                  {sermon.audioDownloadUrl && (
                    <Button asChild variant="link" className="p-0 h-auto justify-start">
                      <a href={sermon.audioDownloadUrl} download className="flex items-center gap-2 text-primary hover:underline font-body">
                        <Headphones />
                        <span>Pakua Sauti (MP3)</span>
                      </a>
                    </Button>
                  )}
                  {sermon.videoDownloadUrl && (
                    <Button asChild variant="link" className="p-0 h-auto justify-start">
                      <a href={sermon.videoDownloadUrl} download className="flex items-center gap-2 text-primary hover:underline font-body">
                        <PlayCircle />
                        <span>Pakua Video (MP4)</span>
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {sermon.tags && sermon.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                    <h3 className="font-headline text-md text-foreground mb-3 flex items-center gap-2"><Tag className="h-4 w-4" /> Maneno Muhimu:</h3>
                    <div className="flex flex-wrap gap-2">
                        {sermon.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  );
}
