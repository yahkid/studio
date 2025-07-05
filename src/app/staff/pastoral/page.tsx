
"use client";

import { useEffect, useState } from 'react';
import type { DecisionDoc } from '@/types/firestore';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, HandHeart, MessageSquare, AlertCircle, MessagesSquare, Users, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { sw } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DecisionDetail } from './decision-detail';

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

export interface EnrichedDecision extends DecisionDoc {
    id: string;
}

export default function PastoralCarePage() {
  const { user, loading: authLoading, initialLoadingComplete } = useAuthFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [decisions, setDecisions] = useState<EnrichedDecision[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedDecision, setSelectedDecision] = useState<EnrichedDecision | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (initialLoadingComplete && !authLoading) {
      // For the prototype, any authenticated user is considered an admin/pastor.
      if (!user) {
        toast({
          title: "Ufikiaji Umezuiwa",
          description: "Huna ruhusa ya kuona ukurasa huu.",
          variant: "destructive",
        });
        router.push('/staff');
      } else {
        fetchDecisions();
      }
    }
  }, [user, authLoading, initialLoadingComplete, router, toast]);

  const fetchDecisions = async () => {
    setIsLoadingData(true);
    try {
      const q = query(collection(db, "decisions"), orderBy("created_at", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedDecisions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EnrichedDecision[];
      setDecisions(fetchedDecisions);
    } catch (error: any) {
      console.error("Kosa la kupata maamuzi:", error);
      toast({
        title: "Kosa",
        description: "Imeshindwa kupata maamuzi. " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleCardClick = (decision: EnrichedDecision) => {
    setSelectedDecision(decision);
    setIsSheetOpen(true);
  };
  
  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setSelectedDecision(null);
    fetchDecisions(); 
  }

  const getStatusBadgeVariant = (status: DecisionDoc['status']) => {
    switch (status) {
      case 'new': return 'destructive';
      case 'contacted': return 'secondary';
      case 'resolved': return 'default';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: DecisionDoc['status']) => {
    switch (status) {
      case 'new': return 'Mpya';
      case 'contacted': return 'Amewasiliana';
      case 'resolved': return 'Imetatuliwa';
      default: return status;
    }
  };

  const nonPrayerDecisions = decisions.filter(d => d.decision_type !== 'prayer');
  const newDecisions = nonPrayerDecisions.filter(d => d.status === 'new');
  const prayerRequests = decisions.filter(d => d.decision_type === 'prayer');
  const newPrayerRequestsCount = prayerRequests.filter(p => p.status === 'new').length;


  if (authLoading || isLoadingData) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 font-body">Inapakia Dashibodi ya Kichungaji...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <CardHeader className="px-0">
        <CardTitle className="font-headline text-3xl md:text-4xl flex items-center gap-3">
          <HandHeart className="h-8 w-8 text-primary" />
          Dashibodi ya Kichungaji
        </CardTitle>
        <CardDescription>
          Simamia maamuzi mapya ya waumini, maombi ya maombi, na majukumu mengine ya kichungaji.
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="decisions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="decisions" className="font-body">
             <HandHeart className="mr-2 h-4 w-4" />
             Maamuzi Mapya ({newDecisions.length})
          </TabsTrigger>
          <TabsTrigger value="prayer_requests" className="font-body">
            <MessagesSquare className="mr-2 h-4 w-4" />
            Maombi ya Maombi ({newPrayerRequestsCount > 0 ? `${newPrayerRequestsCount} Mpya` : prayerRequests.length})
          </TabsTrigger>
          <TabsTrigger value="all_contacts" className="font-body">
            <Users className="mr-2 h-4 w-4" />
            Anwani Zote ({decisions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="decisions" className="mt-6">
          {newDecisions.length === 0 ? (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Zote ziko sawa!</AlertTitle>
                <AlertDescription>
                    Hakuna maamuzi mapya ya kufuatilia kwa sasa.
                </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {newDecisions.map((decision) => (
                <Card key={decision.id} className="flex flex-col cursor-pointer hover:border-primary transition-colors" onClick={() => handleCardClick(decision)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="font-headline text-xl">{decision.name}</CardTitle>
                            <CardDescription>{decision.email}</CardDescription>
                        </div>
                        <Badge variant={getStatusBadgeVariant(decision.status)} className="capitalize">{getStatusLabel(decision.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">Uamuzi Uliofanywa:</p>
                      <p className="font-body text-muted-foreground">{decision.decision_type}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                      <p className="text-xs text-muted-foreground">
                        Imepokelewa {formatDistanceToNow(decision.created_at.toDate(), { addSuffix: true, locale: sw })}
                      </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="prayer_requests" className="mt-6">
           {prayerRequests.length === 0 ? (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Hakuna Maombi ya Maombi</AlertTitle>
                <AlertDescription>
                    Wakati mtu anapowasilisha ombi la maombi, litaonekana hapa.
                </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {prayerRequests.map((decision) => (
                <Card key={decision.id} className="flex flex-col cursor-pointer hover:border-primary transition-colors" onClick={() => handleCardClick(decision)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="font-headline text-xl">{decision.name}</CardTitle>
                            <CardDescription>{decision.email}</CardDescription>
                        </div>
                        <Badge variant={getStatusBadgeVariant(decision.status)} className="capitalize">{getStatusLabel(decision.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                     <div>
                      <p className="text-sm font-semibold text-foreground mb-1">Ombi:</p>
                      <p className="font-body text-muted-foreground line-clamp-3">{decision.comments || "Hakuna maelezo yaliyotolewa."}</p>
                    </div>
                  </CardContent>
                   <CardFooter>
                      <p className="text-xs text-muted-foreground">
                        Imepokelewa {formatDistanceToNow(decision.created_at.toDate(), { addSuffix: true, locale: sw })}
                      </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all_contacts" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {decisions.map((decision) => (
                <Card key={decision.id} className="flex flex-col cursor-pointer hover:border-primary transition-colors" onClick={() => handleCardClick(decision)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="font-headline text-xl">{decision.name}</CardTitle>
                            <CardDescription>{decision.email}</CardDescription>
                        </div>
                        <Badge variant={getStatusBadgeVariant(decision.status)} className="capitalize">{getStatusLabel(decision.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                     <div>
                      <p className="text-sm font-semibold text-foreground mb-1">Aina:</p>
                      <p className="font-body text-muted-foreground capitalize">{decision.decision_type}</p>
                    </div>
                  </CardContent>
                   <CardFooter>
                      <p className="text-xs text-muted-foreground">
                        Imepokelewa {formatDistanceToNow(decision.created_at.toDate(), { addSuffix: true, locale: sw })}
                      </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
        </TabsContent>
      </Tabs>
      
      <Sheet open={isSheetOpen} onOpenChange={handleSheetClose}>
        <SheetContent className="w-full sm:max-w-lg p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="font-headline text-2xl">{selectedDecision?.name}</SheetTitle>
            <p className="text-sm text-muted-foreground">{selectedDecision?.email}</p>
          </SheetHeader>
          {selectedDecision && <DecisionDetail decision={selectedDecision} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
