
"use client";

import * as React from 'react';
import Link from 'next/link';
import { HeartHandshake, Loader2, AlertCircle, PlusCircle, Users, HandHelping, ListChecks } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { VolunteerPartnerSignupDoc, VisitRequestDoc } from '@/types/firestore';
import { format } from 'date-fns';
import { sw } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NeedsRegistryTab } from './needs-registry';

interface EnrichedVolunteer extends VolunteerPartnerSignupDoc {
  id: string;
}
interface EnrichedVisitor extends VisitRequestDoc {
  id: string;
}

export default function HospitalityPage() {
  const [volunteers, setVolunteers] = React.useState<EnrichedVolunteer[]>([]);
  const [visitors, setVisitors] = React.useState<EnrichedVisitor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Volunteers
        const volQuery = query(collection(db, "volunteer_partner_signups"), orderBy("created_at", "desc"));
        const volSnapshot = await getDocs(volQuery);
        const fetchedVolunteers = volSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as EnrichedVolunteer[];
        setVolunteers(fetchedVolunteers.filter(v => 
            v.department?.toLowerCase().includes("hospitality") || 
            v.department?.toLowerCase().includes("ukarimu") ||
            v.department?.toLowerCase().includes("matendo ya rehema")
        ));

        // Fetch Visitors
        const visQuery = query(collection(db, "visit_requests"), orderBy("created_at", "desc"));
        const visSnapshot = await getDocs(visQuery);
        const fetchedVisitors = visSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as EnrichedVisitor[];
        setVisitors(fetchedVisitors);

      } catch (error: any) {
        console.error("Kosa la kupata data ya ukarimu:", error);
        toast({ title: "Kosa", description: "Imeshindwa kupata data ya idara ya ukarimu.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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
          Simamia wageni wapya, wanaojitolea, na mahitaji ya jamii.
        </p>
      </div>

      <Tabs defaultValue="visitors">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visitors"><ListChecks className="mr-2 h-4 w-4" /> Ufuatiliaji wa Wageni</TabsTrigger>
            <TabsTrigger value="volunteers"><Users className="mr-2 h-4 w-4" />Wanaojitolea</TabsTrigger>
            <TabsTrigger value="needs"><HandHelping className="mr-2 h-4 w-4" /> Daftari la Mahitaji</TabsTrigger>
        </TabsList>
        <TabsContent value="visitors" className="mt-6">
            <Card>
                <CardHeader>
                <CardTitle>Ufuatiliaji wa Wageni Wapya</CardTitle>
                <CardDescription>Orodha ya wageni waliojaza fomu ya "Panga Ujio Wako".</CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : visitors.length === 0 ? (
                    <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Hakuna Wageni Wapya</AlertTitle><AlertDescription>Hakuna mtu aliyejaza fomu ya kupanga ujio bado.</AlertDescription></Alert>
                ) : (
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Jina</TableHead>
                                <TableHead>Barua Pepe</TableHead>
                                <TableHead>Ujumbe</TableHead>
                                <TableHead>Tarehe</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {visitors.map(v => (
                                <TableRow key={v.id}>
                                    <TableCell className="font-medium">{v.name}</TableCell>
                                    <TableCell><a href={`mailto:${v.email}`} className="text-primary hover:underline">{v.email}</a></TableCell>
                                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{v.message || "-"}</TableCell>
                                    <TableCell>{format(v.created_at.toDate(), 'PPP', { locale: sw })}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="volunteers" className="mt-6">
            <Card>
                <CardHeader>
                <CardTitle>Wanaojitolea Katika Idara ya Ukarimu</CardTitle>
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
                                            <div className="flex flex-wrap gap-1">
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
        </TabsContent>
         <TabsContent value="needs" className="mt-6">
            <NeedsRegistryTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
