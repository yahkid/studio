
"use client";

import * as React from 'react';
import Link from 'next/link';
import { UsersRound, Loader2, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { EventDoc } from '@/types/firestore';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EventCard } from '@/components/cards/event-card'; 

interface EnrichedEvent extends EventDoc {
  id: string;
}

export default function YouthMinistryPage() {
  const [events, setEvents] = React.useState<EnrichedEvent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const today = Timestamp.now();
        const q = query(
          collection(db, "events"),
          where("event_date", ">=", today),
          orderBy("event_date", "asc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedEvents = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as EnrichedEvent[];
        // Chuja kwa upande wa mteja kwa kubadilika kwa herufi ndogo/kubwa
        setEvents(fetchedEvents.filter(e => e.audience.toLowerCase().includes('youth') || e.audience.toLowerCase().includes('vijana')));
      } catch (error: any) {
        console.error("Kosa la kupata matukio ya vijana:", error);
        toast({ title: "Kosa", description: "Imeshindwa kupata matukio ya vijana.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [toast]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Link href="/staff" className="text-sm text-primary hover:underline">&larr; Rudi kwenye Dashibodi ya Wafanyakazi</Link>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
          <UsersRound className="h-8 w-8 text-primary" />
          Huduma ya Vijana
        </h1>
        <p className="text-muted-foreground font-body">
          Simamia matukio ya vijana na mawasiliano na wazazi.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Matukio Yajayo ya Vijana</CardTitle>
          <CardDescription>Orodha ya matukio yote yajayo yaliyolenga vijana.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : events.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Hakuna Matukio Yajayo ya Vijana</AlertTitle><AlertDescription>Hakuna matukio yajayo mahususi kwa vijana. Ongeza moja katika Meneja wa Matukio.</AlertDescription></Alert>
            ) : (
                <div className="space-y-4">
                    {events.map(event => (
                        <EventCard key={event.id} event={{
                            id: event.id,
                            title: event.title,
                            description: event.description || '',
                            date: format(event.event_date.toDate(), 'yyyy-MM-dd'),
                            startTime: event.start_time,
                            endTime: event.end_time,
                            eventType: event.event_type,
                            platform: event.platform,
                            streamUrl: event.stream_url,
                            audience: event.audience
                        }} />
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
