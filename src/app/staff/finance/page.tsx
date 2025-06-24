
"use client";

import * as React from 'react';
import Link from 'next/link';
import { DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { FinancialPartnerSignupDoc } from '@/types/firestore';
import { format } from 'date-fns';
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
        console.error("Error fetching financial partners:", error);
        toast({ title: "Error", description: "Could not fetch financial partner data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSignups();
  }, [toast]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Link href="/staff" className="text-sm text-primary hover:underline">&larr; Back to Staff Dashboard</Link>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
          <DollarSign className="h-8 w-8 text-primary" />
          Giving & Finance
        </h1>
        <p className="text-muted-foreground font-body">
          View individuals who have expressed interest in becoming financial partners.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Financial Partner Inquiries</CardTitle>
          <CardDescription>This list contains contact information for follow-up regarding donations.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : signups.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>No Inquiries Yet</AlertTitle><AlertDescription>No one has submitted a financial partnership inquiry yet.</AlertDescription></Alert>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {signups.map(signup => (
                            <TableRow key={signup.id}>
                                <TableCell className="font-medium">{signup.first_name} {signup.last_name}</TableCell>
                                <TableCell><a href={`mailto:${signup.email}`} className="text-primary hover:underline">{signup.email}</a></TableCell>
                                <TableCell>{signup.phone_number || 'N/A'}</TableCell>
                                <TableCell>{signup.country || 'N/A'}</TableCell>
                                <TableCell>{format(signup.created_at.toDate(), 'PPP')}</TableCell>
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
