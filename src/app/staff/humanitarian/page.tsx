
"use client";

import * as React from 'react';
import Link from 'next/link';
import { Globe, Loader2, AlertCircle } from 'lucide-react';
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

export default function HumanitarianPage() {
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
          <Globe className="h-8 w-8 text-primary" />
          Huduma za Kijamii na Ufikiaji
        </h1>
        <p className="text-muted-foreground font-body">
          Simamia miradi ya kijamii na ratibu wanaojitolea.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Waliojisajili Kujitolea</CardTitle>
          <CardDescription>Hapa chini kuna orodha ya watu wote walioonyesha nia ya kujitolea.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : volunteers.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Hakuna Wanaojitolea Bado</AlertTitle><AlertDescription>Hakuna aliyejisajili kujitolea bado.</AlertDescription></Alert>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Jina</TableHead>
                            <TableHead>Barua Pepe</TableHead>
                            <TableHead>Tarehe ya Kujisajili</TableHead>
                            <TableHead>Idara/Vipaji</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {volunteers.map(v => (
                            <TableRow key={v.id}>
                                <TableCell className="font-medium">{v.first_name} {v.last_name}</TableCell>
                                <TableCell><a href={`mailto:${v.email}`} className="text-primary hover:underline">{v.email}</a></TableCell>
                                <TableCell>{format(v.created_at.toDate(), 'PPP', { locale: sw })}</TableCell>
                                <TableCell>
                                    <p className="font-semibold">{v.department || 'Nia ya Jumla'}</p>
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
