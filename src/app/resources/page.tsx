
import { type Metadata } from 'next';
import { ResourceCard } from '@/components/cards/resource-card';
import { Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rasilimali | HSCM Connect',
  description: 'Pakua nyenzo za kujifunza, muongozo wa ibada, na zaidi ili kukuza safari yako ya kiroho.',
};

// Sample data - in a real app, this would come from Firestore
const sampleResources = [
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
    id: '3',
    title: 'Orodha ya Nyimbo za Ibada',
    description: 'Pata orodha ya nyimbo tunazoimba katika ibada zetu za Jumapili ili uweze kuabudu nasi.',
    category: 'Worship Guides',
    fileUrl: '#',
    fileType: 'DOCX' as const,
  },
  {
    id: '4',
    title: 'Podcast Episode 5: Overcoming Fear',
    description: 'Sikiliza kipindi hiki cha podikasti kinachozungumzia jinsi ya kushinda hofu kwa nguvu ya Neno la Mungu.',
    category: 'Audio',
    fileUrl: '#',
    fileType: 'MP3' as const,
  },
    {
    id: '5',
    title: 'Video ya Mafundisho: Maombi',
    description: 'Tazama video hii ya mafundisho kuhusu nguvu na umuhimu wa maombi katika maisha ya muumini.',
    category: 'Video',
    fileUrl: '#',
    fileType: 'MP4' as const,
  },
  {
    id: '6',
    title: 'Picha za Matukio (Zipped)',
    description: 'Pakua mkusanyiko wa picha za matukio yetu ya hivi karibuni katika faili moja.',
    category: 'Media',
    fileUrl: '#',
    fileType: 'ZIP' as const,
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
