import { type Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { LeadershipDoc } from '@/types/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Uongozi Wetu | HSCM Connect',
  description: 'Kutana na timu ya uongozi iliyojitolea katika Huduma ya Holy Spirit Connect.',
};

async function getLeadershipData(): Promise<(LeadershipDoc & { id: string })[]> {
  if (!db) {
    console.error("Firestore is not initialized.");
    return [];
  }
  try {
    const leadershipQuery = query(collection(db, "leadership"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(leadershipQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (LeadershipDoc & { id: string })[];
  } catch (error) {
    console.error("Error fetching leadership data from Firestore:", error);
    return []; // Return an empty array on error
  }
}

export default async function LeadershipPage() {
  const leaders = await getLeadershipData();

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">Uongozi Wetu</h1>
          <p className="font-body text-xl text-muted-foreground">
            Kutana na timu ya wachungaji na viongozi waliojitolea kuongoza na kulisha kundi la Mungu katika HSCM Connect kwa upendo na unyenyekevu.
          </p>
        </div>

        {leaders.length === 0 ? (
          <Alert className="max-w-xl mx-auto">
            <Info className="h-4 w-4" />
            <AlertTitle>Hakuna Viongozi Waliopatikana</AlertTitle>
            <AlertDescription>
              Inaonekana hakuna wasifu wa viongozi ulioongezwa bado. Tafadhali ongeza viongozi kupitia dashibodi ya wafanyakazi ili waonekane hapa.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {leaders.map((leader) => (
              <Card key={leader.id} className="flex flex-col items-center text-center overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out">
                <div className="w-full aspect-square relative">
                  <Image
                    src={leader.imageSrc || 'https://placehold.co/400x400.png'}
                    alt={`Picha ya ${leader.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="bg-muted"
                    data-ai-hint={leader.aiHint || 'portrait person'}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-foreground">{leader.name}</CardTitle>
                  <CardDescription className="font-body text-primary font-semibold">{leader.title}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">{leader.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
