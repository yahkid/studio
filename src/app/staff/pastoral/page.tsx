
"use client";

import { useEffect, useState, useTransition } from 'react';
import type { DecisionDoc } from '@/types/firestore';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, HandHeart, Check, MessageSquare, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { followUpOnDecision } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

interface EnrichedDecision extends DecisionDoc {
    id: string;
}

export default function PastoralCarePage() {
  const { user, loading: authLoading, initialLoadingComplete } = useAuthFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [decisions, setDecisions] = useState<EnrichedDecision[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialLoadingComplete && !authLoading) {
      // For now, we only check for the admin UID.
      // This will be expanded to check for roles like 'pastoral_care'.
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
      // Fetching all decisions for now, ordered by most recent.
      // In a real app, you'd add pagination and filter for 'pending_followup' status.
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

  const handleFollowUp = (id: string) => {
    startTransition(async () => {
      const result = await followUpOnDecision(id);
      if (result.success) {
        toast({ title: "Success", description: "Decision marked as followed up." });
        // Visually update the UI. A real implementation might hide the card
        // or change its style. For now, we'll just show a toast.
        // To refresh data from server: fetchDecisions();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    });
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
          Pastoral Care Follow-Up
        </CardTitle>
        <CardDescription>
          Review and manage new believer decisions and other commitments.
        </CardDescription>
      </CardHeader>
      
      {decisions.length === 0 ? (
        <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>All Clear!</AlertTitle>
            <AlertDescription>
                There are no new decisions to follow up on at this time.
            </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {decisions.map((decision) => (
            <Card key={decision.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-xl">{decision.name}</CardTitle>
                        <CardDescription>{decision.email}</CardDescription>
                    </div>
                    <Badge variant="outline">
                        {formatDistanceToNow(decision.created_at.toDate(), { addSuffix: true })}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Decision Made:</p>
                  <p className="font-body text-muted-foreground">{decision.decision_type}</p>
                </div>
                {decision.comments && (
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> Comments:
                    </p>
                    <blockquote className="border-l-4 border-muted pl-4 py-2 text-sm text-muted-foreground italic">
                      <p>{decision.comments}</p>
                    </blockquote>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button onClick={() => handleFollowUp(decision.id)} disabled={isPending}>
                  <Check className="mr-2 h-4 w-4" /> Mark as Contacted
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
