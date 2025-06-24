
"use client";

import * as React from 'react';
import Link from 'next/link';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { EventDoc } from '@/types/firestore';
import { format } from 'date-fns';
import { sw } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

interface EnrichedEvent extends EventDoc {
  id: string;
}

export default function TransportSecurityPage() {
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
        setEvents(fetchedEvents);
      } catch (error: any) {
        console.error("Kosa la kupata matukio:", error);
        toast({ title: "Kosa", description: "Imeshindwa kupata matukio yajayo.", variant: "destructive" });
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
          <Shield className="h-8 w-8 text-primary" />
          Uchukuzi na Usalama
        </h1>
        <p className="text-muted-foreground font-body">
          Tazama matukio yajayo kwa ajili ya uratibu wa vifaa na usalama.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ratiba ya Matukio Yajayo</CardTitle>
          <CardDescription>Orodha ya matukio yote yajayo yaliyopangwa.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : events.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Hakuna Matukio Yajayo</AlertTitle><AlertDescription>Hakuna matukio yajayo yaliyopangwa kwenye database.</AlertDescription></Alert>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Tukio</TableHead>
                            <TableHead>Tarehe na Muda</TableHead>
                            <TableHead>Jukwaa</TableHead>
                            <TableHead>Walengwa</TableHead>
                            <TableHead>Hali</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {events.map(event => (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>{format(event.event_date.toDate(), 'PPP', { locale: sw })} @ {event.start_time}</TableCell>
                                <TableCell>{event.platform}</TableCell>
                                <TableCell>{event.audience}</TableCell>
                                <TableCell><Badge variant={event.is_active ? "default" : "outline"}>{event.is_active ? 'Inaendelea' : 'Imezimwa'}</Badge></TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
