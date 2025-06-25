
"use client";

import * as React from 'react';
import Link from 'next/link';
import { Users, Loader2, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { VolunteerPartnerSignupDoc } from '@/types/firestore';
import { format } from 'date-fns';
import { sw } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

interface EnrichedSignup extends VolunteerPartnerSignupDoc {
  id: string;
}

export default function HumanResourcePage() {
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
        setVolunteers(fetchedVolunteers);
      } catch (error: any) {
        console.error("Kosa la kupata data ya wanaojitolea:", error);
        toast({ title: "Kosa", description: "Imeshindwa kupata data ya wanaojitolea.", variant: "destructive" });
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
          <Users className="h-8 w-8 text-primary" />
          Rasilimali Watu (HR)
        </h1>
        <p className="text-muted-foreground font-body">
          Simamia maombi yote ya wanaojitolea na fuatilia mawasiliano.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Maombi ya Kujitolea</CardTitle>
          <CardDescription>Orodha ya watu wote walioonyesha nia ya kutumika katika idara mbalimbali.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : volunteers.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Hakuna Maombi</AlertTitle><AlertDescription>Hakuna maombi ya kujitolea yaliyopokelewa bado.</AlertDescription></Alert>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Jina</TableHead>
                            <TableHead>Mawasiliano</TableHead>
                            <TableHead>Idara Iliyochaguliwa</TableHead>
                            <TableHead>Majukumu/Vipaji</TableHead>
                            <TableHead>Tarehe</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {volunteers.map(v => (
                            <TableRow key={v.id}>
                                <TableCell className="font-medium">{v.first_name} {v.last_name}</TableCell>
                                <TableCell><a href={`mailto:${v.email}`} className="text-primary hover:underline text-xs">{v.email}</a></TableCell>
                                <TableCell><Badge variant="secondary">{v.department}</Badge></TableCell>
                                <TableCell className="max-w-xs">
                                    {v.selected_roles && v.selected_roles.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {v.selected_roles.map(role => <Badge key={role} variant="outline" className="text-xs">{role}</Badge>)}
                                        </div>
                                    )}
                                    {v.interests_skills && <p className="text-xs text-muted-foreground mt-1 truncate">{v.interests_skills}</p>}
                                </TableCell>
                                <TableCell className="text-xs">{format(v.created_at.toDate(), 'PPP', { locale: sw })}</TableCell>
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
