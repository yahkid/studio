
"use client";

import * as React from 'react';
import Link from 'next/link';
import { Baby, Loader2, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { VolunteerPartnerSignupDoc } from '@/types/firestore';
import { format } from 'date-fns';
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
        console.error("Error fetching volunteers:", error);
        toast({ title: "Error", description: "Could not fetch volunteer data for Children's Ministry.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchVolunteers();
  }, [toast]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Link href="/staff" className="text-sm text-primary hover:underline">&larr; Back to Staff Dashboard</Link>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
          <Baby className="h-8 w-8 text-primary" />
          Children's Ministry
        </h1>
        <p className="text-muted-foreground font-body">
          Manage volunteers for the children's department.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Children's Ministry Volunteers</CardTitle>
          <CardDescription>Below is a list of individuals who have expressed interest in serving in the children's department.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : volunteers.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>No Specific Volunteers Found</AlertTitle><AlertDescription>No one has signed up specifically for the Children's Ministry yet. Check the main <Link href="/staff/humanitarian" className="underline">volunteer list</Link> for general interest.</AlertDescription></Alert>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Date Signed Up</TableHead>
                            <TableHead>Department</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {volunteers.map(v => (
                            <TableRow key={v.id}>
                                <TableCell className="font-medium">{v.first_name} {v.last_name}</TableCell>
                                <TableCell><a href={`mailto:${v.email}`} className="text-primary hover:underline">{v.email}</a></TableCell>
                                <TableCell>{format(v.created_at.toDate(), 'PPP')}</TableCell>
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
