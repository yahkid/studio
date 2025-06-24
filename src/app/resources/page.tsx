
import { type Metadata } from 'next';
import { ResourceCard } from '@/components/cards/resource-card';
import { Download } from 'lucide-react';
import type { ResourceDoc } from '@/types/firestore';

export const metadata: Metadata = {
  title: 'Rasilimali | HSCM Connect',
  description: 'Pakua nyenzo za kujifunza, muongozo wa ibada, na zaidi ili kukuza safari yako ya kiroho.',
};

// Sample data - in a real app, this would come from Firestore
const sampleResources: ResourceDoc[] = [
  {
    id: '7',
    title: 'HSCM Desktop Wallpaper: Hope',
    description: 'A beautiful wallpaper for your desktop to remind you of the hope we have.',
    category: 'Wallpapers',
    fileUrl: 'https://placehold.co/1920x1080.png',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    fileType: 'PNG',
    aiHint: 'inspirational landscape sunrise'
  },
  {
    id: '8',
    title: 'HSCM Phone Wallpaper: Faith',
    description: 'Carry a reminder of faith with you on your phone with this inspiring wallpaper.',
    category: 'Wallpapers',
    fileUrl: 'https://placehold.co/1080x1920.png',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    fileType: 'PNG',
    aiHint: 'abstract faith light'
  },
  {
    id: '1',
    title: 'Mwongozo wa Misingi ya Imani',
    description: 'Anza safari yako ya imani na mwongozo huu wa kina unaoelezea misingi mikuu ya Ukristo.',
    category: 'E-Books',
    fileUrl: '#', // Placeholder link
    fileType: 'PDF' as const,
  },
  {
    id: '2',
    title: 'Noti za Mahubiri: Kitabu cha Yohana',
    description: 'Fuatilia mfululizo wetu wa mahubiri kuhusu Injili ya Yohana na noti hizi za kina.',
    category: 'Sermon Notes',
    fileUrl: '#',
    fileType: 'PDF' as const,
  },
    {
    id: '9',
    title: 'HSCM Desktop Wallpaper: Purpose',
    description: 'A daily reminder of your God-given purpose, for your desktop.',
    category: 'Wallpapers',
    fileUrl: 'https://placehold.co/1920x1080.png',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    fileType: 'PNG',
    aiHint: 'path mountain journey'
  },
  {
    id: '4',
    title: 'Podcast Episode 5: Overcoming Fear',
    description: 'Sikiliza kipindi hiki cha podikasti kinachozungumzia jinsi ya kushinda hofu kwa nguvu ya Neno la Mungu.',
    category: 'Audio',
    fileUrl: '#',
    fileType: 'MP3' as const,
  },
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <Download className="mx-auto h-16 w-16 text-primary mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
          Kituo cha Rasilimali
        </h1>
        <p className="font-body text-xl text-muted-foreground">
          Jipatie nyenzo mbalimbali zilizoundwa kukusaidia kukua katika imani na maarifa yako. Pakua, jifunze, na ushiriki na wengine.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {sampleResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}
