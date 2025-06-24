
"use client";

import * as React from 'react';
import Link from 'next/link';
import { DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { FinancialPartnerSignupDoc } from '@/types/firestore';
import { format } from 'date-fns';
import { sw } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface EnrichedSignup extends FinancialPartnerSignupDoc {
  id: string;
}

export default function FinancePage() {
  const [signups, setSignups] = React.useState<EnrichedSignup[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchSignups = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "financial_partner_signups"), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedSignups = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as EnrichedSignup[];
        setSignups(fetchedSignups);
      } catch (error: any) {
        console.error("Kosa la kupata washirika wa kifedha:", error);
        toast({ title: "Kosa", description: "Imeshindwa kupata data ya washirika wa kifedha.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSignups();
  }, [toast]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Link href="/staff" className="text-sm text-primary hover:underline">&larr; Rudi kwenye Dashibodi ya Wafanyakazi</Link>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
          <DollarSign className="h-8 w-8 text-primary" />
          Utoaji na Fedha
        </h1>
        <p className="text-muted-foreground font-body">
          Tazama watu walioonyesha nia ya kuwa washirika wa kifedha.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Maombi ya Ushirika wa Kifedha</CardTitle>
          <CardDescription>Orodha hii ina taarifa za mawasiliano kwa ajili ya ufuatiliaji kuhusu michango.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : signups.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Hakuna Maombi Bado</AlertTitle><AlertDescription>Hakuna aliyeonyesha nia ya ushirika wa kifedha bado.</AlertDescription></Alert>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Jina</TableHead>
                            <TableHead>Barua Pepe</TableHead>
                            <TableHead>Simu</TableHead>
                            <TableHead>Nchi</TableHead>
                            <TableHead>Tarehe</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {signups.map(signup => (
                            <TableRow key={signup.id}>
                                <TableCell className="font-medium">{signup.first_name} {signup.last_name}</TableCell>
                                <TableCell><a href={`mailto:${signup.email}`} className="text-primary hover:underline">{signup.email}</a></TableCell>
                                <TableCell>{signup.phone_number || 'H/A'}</TableCell>
                                <TableCell>{signup.country || 'H/A'}</TableCell>
                                <TableCell>{format(signup.created_at.toDate(), 'PPP', { locale: sw })}</TableCell>
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
