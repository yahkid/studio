
"use client";

import { useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import type { UserTestimonyDoc } from '@/types/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, Check, X as XIcon, AlertCircle, Quote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { approveTestimony, rejectTestimony } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface EnrichedTestimony extends UserTestimonyDoc {
    id: string;
}

export default function ReviewTestimoniesPage() {
  const { user, loading: authLoading, initialLoadingComplete } = useAuthFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [testimonies, setTestimonies] = useState<EnrichedTestimony[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialLoadingComplete && !authLoading) {
      // Simplified check: is any user logged in?
      if (!user) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to view this page.",
          variant: "destructive",
        });
        router.push('/');
      } else {
        fetchPendingTestimonies();
      }
    }
  }, [user, authLoading, initialLoadingComplete, router, toast]);

  const fetchPendingTestimonies = async () => {
    setIsLoadingData(true);
    try {
      const q = query(collection(db, "user_testimonies"), where("status", "==", "pending_review"));
      const querySnapshot = await getDocs(q);
      const pendingTestimonies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EnrichedTestimony[];
      setTestimonies(pendingTestimonies.sort((a, b) => b.submittedAt.toMillis() - a.submittedAt.toMillis()));
    } catch (error: any) {
      console.error("Error fetching pending testimonies:", error);
      toast({
        title: "Error",
        description: "Could not fetch testimonies. " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const result = await approveTestimony(id);
      if (result.success) {
        toast({ title: "Success", description: "Testimony approved and published." });
        setTestimonies(prev => prev.filter(t => t.id !== id));
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    });
  };

  const handleReject = (id: string) => {
    startTransition(async () => {
      const result = await rejectTestimony(id);
      if (result.success) {
        toast({ title: "Success", description: "Testimony rejected." });
        setTestimonies(prev => prev.filter(t => t.id !== id));
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    });
  };

  if (authLoading || isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 font-body">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <CardHeader className="px-0">
        <CardTitle className="font-headline text-3xl md:text-4xl flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Testimony Review Dashboard
        </CardTitle>
        <CardDescription>
          Review and approve user-submitted testimonies. Approved stories will appear on the homepage.
        </CardDescription>
      </CardHeader>
      
      {testimonies.length === 0 ? (
        <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>All Clear!</AlertTitle>
            <AlertDescription>
                There are no pending testimonies to review at this time.
            </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testimonies.map((testimony) => (
            <Card key={testimony.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-xl">{testimony.userName}</CardTitle>
                        <CardDescription>{testimony.userEmail}</CardDescription>
                    </div>
                    <Badge variant="outline">
                        {formatDistanceToNow(testimony.submittedAt.toDate(), { addSuffix: true })}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                {testimony.fileUrl && (
                    <div className="relative w-full h-48 rounded-md overflow-hidden border">
                        <Image src={testimony.fileUrl} alt={`Image for ${testimony.userName}'s testimony`} fill style={{ objectFit: 'cover' }} />
                    </div>
                )}
                {testimony.aiSuggestedQuote && (
                  <blockquote className="border-l-4 border-primary pl-4 py-2 bg-muted/50 rounded-r-md">
                     <Quote className="h-5 w-5 text-primary/50 mb-1" />
                    <p className="font-semibold italic text-foreground">{testimony.aiSuggestedQuote}</p>
                    <p className="text-xs text-muted-foreground mt-1">- AI Suggested Quote</p>
                  </blockquote>
                )}
                <div className="prose prose-sm dark:prose-invert max-w-none font-body text-muted-foreground h-32 overflow-y-auto p-2 border rounded-md">
                    <p>{testimony.story}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="destructive" onClick={() => handleReject(testimony.id)} disabled={isPending}>
                  <XIcon className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button onClick={() => handleApprove(testimony.id)} disabled={isPending}>
                  <Check className="mr-2 h-4 w-4" /> Approve & Publish
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
