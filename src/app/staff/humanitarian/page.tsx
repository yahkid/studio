
"use client";

import * as React from 'react';
import Link from 'next/link';
import { HeartHandshake, Loader2, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
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

export default function HospitalityPage() {
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
        setVolunteers(fetchedVolunteers.filter(v => 
            v.department?.toLowerCase().includes("hospitality") || 
            v.department?.toLowerCase().includes("ukarimu") ||
            v.department?.toLowerCase().includes("matendo ya rehema")
        ));
      } catch (error: any) {
        console.error("Kosa la kupata data ya wanaojitolea:", error);
        toast({ title: "Kosa", description: "Imeshindwa kupata data ya wanaojitolea kwa Ukarimu.", variant: "destructive" });
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
          <HeartHandshake className="h-8 w-8 text-primary" />
          Ukarimu (Hospitality)
        </h1>
        <p className="text-muted-foreground font-body">
          Simamia wanaojitolea katika idara ya ukarimu.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Wanaojitolea wa Idara ya Ukarimu</CardTitle>
          <CardDescription>Hapa chini ni orodha ya watu walioonyesha nia ya kutumika katika idara ya ukarimu.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : volunteers.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Hakuna Wanaojitolea Waliopatikana</AlertTitle><AlertDescription>Hakuna aliyejisajili mahususi kwa idara ya Ukarimu bado.</AlertDescription></Alert>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Jina</TableHead>
                            <TableHead>Barua Pepe</TableHead>
                            <TableHead>Tarehe ya Kujisajili</TableHead>
                            <TableHead>Majukumu/Vipaji</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {volunteers.map(v => (
                            <TableRow key={v.id}>
                                <TableCell className="font-medium">{v.first_name} {v.last_name}</TableCell>
                                <TableCell><a href={`mailto:${v.email}`} className="text-primary hover:underline">{v.email}</a></TableCell>
                                <TableCell>{format(v.created_at.toDate(), 'PPP', { locale: sw })}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {v.selected_roles?.map(role => <Badge key={role} variant="outline">{role}</Badge>)}
                                    </div>
                                    {v.interests_skills && <p className="text-xs text-muted-foreground mt-1">{v.interests_skills}</p>}
                                </TableCell>
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
