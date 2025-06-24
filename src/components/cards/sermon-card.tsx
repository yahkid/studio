import Link from 'next/link';
import Image from 'next/image';
import type { SermonDoc } from '@/types/firestore';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface SermonCardProps {
  sermon: SermonDoc & { id: string };
}

export function SermonCard({ sermon }: SermonCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden border rounded-lg hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0 relative group">
        <Link href={`/sermons/${sermon.id}`} aria-label={`Tazama hubiri: ${sermon.title}`}>
          <div className="aspect-[16/9] w-full overflow-hidden">
            <Image
              src={`https://img.youtube.com/vi/${sermon.youtube_video_id}/mqdefault.jpg`}
              alt={`Picha ya jalada ya ${sermon.title}`}
              width={320}
              height={180}
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="h-12 w-12 text-white/90" />
            </div>
          </div>
          {sermon.is_featured && <Badge className="absolute top-2 right-2">Featured</Badge>}
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-3">
        <Link href={`/sermons/${sermon.id}`} className="block">
          <CardTitle className="font-headline text-xl text-foreground hover:text-primary transition-colors duration-200 line-clamp-2">
            {sermon.title}
          </CardTitle>
        </Link>
        <div className="flex flex-col text-xs text-muted-foreground pt-1 space-y-1">
            <div className="flex items-center">
                <User className="h-3 w-3 mr-1.5" />
                <span>{sermon.speaker}</span>
            </div>
            <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1.5" />
                <span>{format(sermon.sermon_date.toDate(), 'MMM d, yyyy')}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full font-headline" size="sm">
          <Link href={`/sermons/${sermon.id}`}>
            Tazama Ujumbe
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
