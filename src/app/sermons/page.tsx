import { type Metadata } from 'next';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { SermonDoc } from '@/types/firestore';
import { SermonCard } from '@/components/cards/sermon-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clapperboard, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mahubiri | HSCM Connect',
  description: 'Tazama na sikiliza jumbe za hivi karibuni kutoka HSCM Connect ili kukujenga na kukuimarisha katika safari yako ya kiroho.',
};

async function getSermons(): Promise<(SermonDoc & { id: string })[]> {
  if (!db) return [];
  try {
    const sermonsQuery = query(
      collection(db, "sermons"),
      orderBy("sermon_date", "desc")
    );
    const querySnapshot = await getDocs(sermonsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (SermonDoc & { id: string })[];
  } catch (error) {
    console.error("Error fetching sermons:", error);
    return [];
  }
}

export default async function SermonsPage() {
  const sermons = await getSermons();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <Clapperboard className="mx-auto h-16 w-16 text-primary mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
          Maktaba ya Mahubiri
        </h1>
        <p className="font-body text-xl text-muted-foreground">
          Pata maarifa, msukumo, na mafundisho ya kina kutoka kwa watumishi wetu. Chagua ujumbe unaokufaa na ubarikiwe.
        </p>
      </div>

      {sermons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sermons.map((sermon) => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>
      ) : (
        <Alert className="max-w-xl mx-auto">
            <Search className="h-4 w-4" />
            <AlertTitle>Hakuna Mahubiri Yaliyopatikana</AlertTitle>
            <AlertDescription>
              Samahani, hakuna mahubiri yaliyochapishwa kwa sasa. Tafadhali angalia tena hivi karibuni!
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
