
"use client";

import * as React from 'react';
import Link from 'next/link';
import { Baby, Loader2, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { VolunteerPartnerSignupDoc } from '@/types/firestore';
import { format } from 'date-fns';
import { sw } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface EnrichedSignup extends VolunteerPartnerSignupDoc {
  id: string;
}

export default function ChildrensMinistryPage() {
  const [volunteers, setVolunteers] = React.useState<EnrichedSignup[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchVolunteers = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "volunteer_partner_signups"), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedVolunteers = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as EnrichedSignup[];
        setVolunteers(fetchedVolunteers.filter(v => v.department?.toLowerCase().includes("children") || v.department?.toLowerCase().includes("watoto")));
      } catch (error: any) {
        console.error("Kosa la kupata data ya wanaojitolea:", error);
        toast({ title: "Kosa", description: "Imeshindwa kupata data ya wanaojitolea kwa Huduma ya Watoto.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchVolunteers();
  }, [toast]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Link href="/staff" className="text-sm text-primary hover:underline">&larr; Rudi kwenye Dashibodi ya Wafanyakazi</Link>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
          <Baby className="h-8 w-8 text-primary" />
          Huduma ya Watoto
        </h1>
        <p className="text-muted-foreground font-body">
          Simamia wanaojitolea kwa idara ya watoto.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Wanaojitolea Katika Huduma ya Watoto</CardTitle>
          <CardDescription>Hapa chini kuna orodha ya watu walioonyesha nia ya kutumika katika idara ya watoto.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : volunteers.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Hakuna Wanaojitolea Waliopatikana</AlertTitle><AlertDescription>Hakuna aliyejisajili mahususi kwa Huduma ya Watoto bado. Angalia orodha kuu ya <Link href="/staff/human-resource" className="underline">wanaojitolea</Link> kwa nia ya jumla.</AlertDescription></Alert>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Jina</TableHead>
                            <TableHead>Barua Pepe</TableHead>
                            <TableHead>Tarehe ya Kujisajili</TableHead>
                            <TableHead>Idara</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {volunteers.map(v => (
                            <TableRow key={v.id}>
                                <TableCell className="font-medium">{v.first_name} {v.last_name}</TableCell>
                                <TableCell><a href={`mailto:${v.email}`} className="text-primary hover:underline">{v.email}</a></TableCell>
                                <TableCell>{format(v.created_at.toDate(), 'PPP', { locale: sw })}</TableCell>
                                <TableCell>{v.department}</TableCell>
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
