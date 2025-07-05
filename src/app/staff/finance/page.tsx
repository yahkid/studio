
"use client";

import * as React from 'react';
import Link from 'next/link';
import { DollarSign, Loader2, AlertCircle, TrendingUp, Repeat, CalendarCheck, CheckCircle2, Hourglass, XCircle } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, type Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { DonationDoc } from '@/types/firestore';
import { format } from 'date-fns';
import { sw } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface EnrichedDonation extends DonationDoc {
  id: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  isLoading: boolean;
}

function MetricCard({ title, value, icon: Icon, description, isLoading }: MetricCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-3/4" />
                ) : (
                  <div className="text-2xl font-bold">{value}</div>
                )}
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    )
}

const getStatusBadge = (status: DonationDoc['status']) => {
  switch (status) {
    case 'succeeded':
      return <Badge variant="default"><CheckCircle2 className="mr-1 h-3 w-3" /> Imefanikiwa</Badge>;
    case 'pending':
      return <Badge variant="secondary"><Hourglass className="mr-1 h-3 w-3" /> Inasubiri</Badge>;
    case 'failed':
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Imeshindwa</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};


export default function FinancePage() {
  const [donations, setDonations] = React.useState<EnrichedDonation[]>([]);
  const [stats, setStats] = React.useState({
    totalAmount: 0,
    oneTimeCount: 0,
    monthlyCount: 0,
    totalDonations: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);
  const { toast } = useToast();
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "donations"), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        
        let totalAmount = 0;
        let oneTimeCount = 0;
        let monthlyCount = 0;
        
        const fetchedDonations = querySnapshot.docs.map(doc => {
            const data = doc.data() as DonationDoc;
            if (data.status === 'succeeded') {
                totalAmount += data.amount;
                if (data.frequency === 'onetime') oneTimeCount++;
                if (data.frequency === 'monthly') monthlyCount++;
            }
            return {
                id: doc.id,
                ...data
            } as EnrichedDonation;
        });

        setDonations(fetchedDonations);
        setStats({
          totalAmount,
          oneTimeCount,
          monthlyCount,
          totalDonations: fetchedDonations.filter(d => d.status === 'succeeded').length,
        });

      } catch (error: any) {
        console.error("Kosa la kupata data ya michango:", error);
        toast({ title: "Kosa", description: "Imeshindwa kupata data ya michango.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonations();
  }, [toast]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Link href="/staff" className="text-sm text-primary hover:underline">&larr; Rudi kwenye Dashibodi ya Wafanyakazi</Link>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
          <DollarSign className="h-8 w-8 text-primary" />
          Dashibodi ya Utoaji
        </h1>
        <p className="text-muted-foreground font-body">
          Tazama na simamia michango na ushirika wa kifedha.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title="Jumla ya Michango (Imefanikiwa)" 
            value={isClient ? `TZS ${stats.totalAmount.toLocaleString('en-US')}` : `TZS ${stats.totalAmount}`} 
            icon={TrendingUp} 
            description={`Kutoka kwa michango ${stats.totalDonations}`} 
            isLoading={isLoading}
          />
          <MetricCard 
            title="Michango ya Mara Moja" 
            value={stats.oneTimeCount} 
            icon={Repeat} 
            description="Jumla ya michango ya mara moja" 
            isLoading={isLoading}
          />
          <MetricCard 
            title="Washirika wa Kila Mwezi" 
            value={stats.monthlyCount} 
            icon={CalendarCheck} 
            description="Jumla ya michango ya kila mwezi" 
            isLoading={isLoading}
          />
          <MetricCard 
            title="Jumla ya Miamala" 
            value={donations.length} 
            icon={DollarSign} 
            description="Ikiwemo inayosubiri na iliyoshindwa" 
            isLoading={isLoading}
          />
      </div>


      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Historia ya Miamala</CardTitle>
          <CardDescription>Orodha ya michango yote iliyoanzishwa kupitia tovuti.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : donations.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Hakuna Michango Bado</AlertTitle><AlertDescription>Hakuna michango iliyorekodiwa kwenye database bado.</AlertDescription></Alert>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Tarehe</TableHead>
                            <TableHead>Jina</TableHead>
                            <TableHead>Kiasi</TableHead>
                            <TableHead>Marudio</TableHead>
                            <TableHead>Njia</TableHead>
                            <TableHead>Hali</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {donations.map(donation => (
                            <TableRow key={donation.id}>
                                <TableCell className="text-xs">{format(donation.created_at.toDate(), 'PPp', { locale: sw })}</TableCell>
                                <TableCell className="font-medium">{donation.name}<br/><span className="text-xs text-muted-foreground">{donation.email}</span></TableCell>
                                <TableCell>{isClient ? donation.amount.toLocaleString('en-US') : donation.amount} {donation.currency}</TableCell>
                                <TableCell className="capitalize">{donation.frequency === 'onetime' ? 'Mara Moja' : 'Kila Mwezi'}</TableCell>
                                <TableCell className="capitalize">{donation.paymentMethod}</TableCell>
                                <TableCell>{getStatusBadge(donation.status)}</TableCell>
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
