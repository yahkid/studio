
import { type Metadata } from 'next';
import { ResourceCard } from '@/components/cards/resource-card';
import { Download, Search } from 'lucide-react';
import type { ResourceDoc } from '@/types/firestore';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'Rasilimali | HSCM Connect',
  description: 'Pakua nyenzo za kujifunza, muongozo wa ibada, na zaidi ili kukuza safari yako ya kiroho.',
};

async function getResources(): Promise<(ResourceDoc & { id: string })[]> {
  if (!db) return [];
  try {
    const resourcesQuery = query(
      collection(db, "resources"),
      orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(resourcesQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (ResourceDoc & { id: string })[];
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
}


export default async function ResourcesPage() {
  const resources = await getResources();

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

       {resources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
         <Alert className="max-w-xl mx-auto">
            <Search className="h-4 w-4" />
            <AlertTitle>Hakuna Rasilimali Zilizopatikana</AlertTitle>
            <AlertDescription>
              Samahani, hakuna rasilimali zilizochapishwa kwa sasa. Tafadhali angalia tena hivi karibuni!
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
