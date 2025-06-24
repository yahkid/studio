
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
      if (!user || user.uid !== ADMIN_UID) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to view this page.",
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
      console.error("Error fetching decisions:", error);
      toast({
        title: "Error",
        description: "Could not fetch decisions. " + error.message,
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
    // Re-fetch data in case status was updated
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


  if (authLoading || isLoadingData) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 font-body">Loading Pastoral Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <CardHeader className="px-0">
        <CardTitle className="font-headline text-3xl md:text-4xl flex items-center gap-3">
          <HandHeart className="h-8 w-8 text-primary" />
          Pastoral Dashboard
        </CardTitle>
        <CardDescription>
          Manage new believer decisions, prayer requests, and other pastoral duties.
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="decisions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="decisions" className="font-body">
             <HandHeart className="mr-2 h-4 w-4" />
             New Decisions ({decisions.filter(d => d.status === 'new').length})
          </TabsTrigger>
          <TabsTrigger value="prayer_requests" className="font-body">
            <MessagesSquare className="mr-2 h-4 w-4" />
            Prayer Requests
          </TabsTrigger>
          <TabsTrigger value="all_contacts" className="font-body">
            <Users className="mr-2 h-4 w-4" />
            All Contacts ({decisions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="decisions" className="mt-6">
          {decisions.filter(d => d.status === 'new').length === 0 ? (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>All Clear!</AlertTitle>
                <AlertDescription>
                    There are no new decisions to follow up on at this time.
                </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {decisions.filter(d => d.status === 'new').map((decision) => (
                <Card key={decision.id} className="flex flex-col cursor-pointer hover:border-primary transition-colors" onClick={() => handleCardClick(decision)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="font-headline text-xl">{decision.name}</CardTitle>
                            <CardDescription>{decision.email}</CardDescription>
                        </div>
                        <Badge variant={getStatusBadgeVariant(decision.status)} className="capitalize">{decision.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">Decision Made:</p>
                      <p className="font-body text-muted-foreground">{decision.decision_type}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                      <p className="text-xs text-muted-foreground">
                        Received {formatDistanceToNow(decision.created_at.toDate(), { addSuffix: true })}
                      </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="prayer_requests" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Prayer Request Hub</CardTitle>
              <CardDescription>This feature is under construction. Soon, prayer requests from the website will appear here in real-time for follow-up.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Stay tuned for updates!</p>
            </CardContent>
          </Card>
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
                        <Badge variant={getStatusBadgeVariant(decision.status)} className="capitalize">{decision.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                     <div>
                      <p className="text-sm font-semibold text-foreground mb-1">Decision Made:</p>
                      <p className="font-body text-muted-foreground">{decision.decision_type}</p>
                    </div>
                  </CardContent>
                   <CardFooter>
                      <p className="text-xs text-muted-foreground">
                        Received {formatDistanceToNow(decision.created_at.toDate(), { addSuffix: true })}
                      </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
        </TabsContent>
      </Tabs>
      
      <Sheet open={isSheetOpen} onOpenChange={handleSheetClose}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader className="pr-10">
            <SheetTitle className="font-headline text-2xl">{selectedDecision?.name}</SheetTitle>
            <p className="text-sm text-muted-foreground">{selectedDecision?.email}</p>
          </SheetHeader>
          {selectedDecision && <DecisionDetail decision={selectedDecision} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
