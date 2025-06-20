
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase';
import type { Course } from '@/lib/courses-data';
import { getCourseById } from '@/lib/courses-data';
import { ProgressCourseCard } from '@/components/cards/progress-course-card';
import { Loader2, User, Edit, KeyRound, BookOpen, CheckSquare, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebaseClient'; // Firebase
import { collection, query, where, getDocs } from 'firebase/firestore'; // Firebase
import type { FirestoreDocTypes } from '@/types/firestore'; // Updated types

interface EnrichedProgress extends FirestoreDocTypes['user_course_progress'] {
  courseDetails?: Course;
  docId: string; // Firestore document ID
}

const getInitials = (name?: string) => {
  if (!name) return '';
  const nameParts = name.trim().split(' ');
  if (nameParts.length === 0 || nameParts[0] === '') return '';
  if (nameParts.length === 1 && nameParts[0].length > 0) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  return nameParts
    .map((part) => (part.length > 0 ? part[0] : ''))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export default function ProfilePage() {
  const { user, loading: authLoading, initialLoadingComplete } = useAuthFirebase();
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState<EnrichedProgress[]>([]);
  const [isProgressLoading, setIsProgressLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const userDisplayName = user?.displayName || user?.email;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !initialLoadingComplete || !user) {
      setIsProgressLoading(false);
      if (initialLoadingComplete && !user) setUserProgress([]);
      return;
    }

    const fetchProgress = async () => {
      setIsProgressLoading(true);
      try {
        const progressQuery = query(
          collection(db, 'user_course_progress'),
          where('user_id', '==', user.uid)
        );
        const querySnapshot = await getDocs(progressQuery);
        
        const progressData: EnrichedProgress[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as FirestoreDocTypes['user_course_progress'];
          const courseDetails = getCourseById(data.course_id);
          if (courseDetails) {
            progressData.push({ ...data, courseDetails, docId: doc.id });
          }
        });
        
        setUserProgress(progressData);
      } catch (error: any) {
        console.error("Error fetching user progress from Firestore:", error);
        toast({
          title: 'Error Fetching Learning Progress',
          description: error.message || 'An unexpected error occurred.',
          variant: 'destructive',
        });
        setUserProgress([]);
      } finally {
        setIsProgressLoading(false);
      }
    };

    fetchProgress();
  }, [user, initialLoadingComplete, mounted, toast]);

  const totalCoursesStarted = userProgress.length;
  const totalLessonsCompleted = userProgress.reduce((sum, p) => sum + (p.completed_lessons?.length || 0), 0);

  if (!mounted || (!initialLoadingComplete && authLoading)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 font-body text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="mb-10 w-full overflow-hidden">
        <CardHeader className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:items-center sm:p-8 sm:text-left sm:gap-6 bg-muted/30 dark:bg-muted/10">
          {user && (
            <Avatar className="h-24 w-24 text-3xl sm:h-32 sm:w-32 sm:text-5xl border-2 border-primary dark:border-primary shadow-md">
              <AvatarFallback className="bg-background">
                {userDisplayName ? getInitials(userDisplayName) : <User className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            {user ? (
              <>
                <CardTitle className="font-headline text-3xl sm:text-4xl text-foreground">
                  {userDisplayName || 'Mtumiaji'}
                </CardTitle>
                {user.email && (
                  <CardDescription className="font-body text-lg text-muted-foreground mt-1">
                    {user.email}
                  </CardDescription>
                )}
              </>
            ) : (
              <div className="py-4 sm:py-8 text-center w-full">
                <User className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="font-headline text-2xl sm:text-3xl text-foreground mb-2">
                  Wasifu Wako
                </CardTitle>
                <CardDescription className="font-body text-muted-foreground mb-6">
                  Tafadhali ingia ili kuona maelezo yako na safari ya kujifunza.
                </CardDescription>
                <Button asChild className="font-headline text-base px-6 py-3" size="lg">
                  <Link href="/auth?mode=login">Ingia / Jisajili</Link>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">Taarifa za Akaunti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="profile-name" className="font-body text-sm text-muted-foreground">Jina Kamili</Label>
                  <p id="profile-name" className="font-body text-foreground">{userDisplayName || 'Haikuwekwa'}</p>
                </div>
                <div>
                  <Label htmlFor="profile-email" className="font-body text-sm text-muted-foreground">Anwani ya Barua Pepe</Label>
                  <p id="profile-email" className="font-body text-foreground">{user.email}</p>
                </div>
                <div className="flex flex-col space-y-2 pt-3">
                   <Button asChild variant="outline" size="sm" className="font-body justify-start">
                     <Link href="/settings">
                       <Edit className="mr-2 h-4 w-4" /> Badilisha Wasifu
                     </Link>
                   </Button>
                   <Button asChild variant="outline" size="sm" className="font-body justify-start">
                     <Link href="/settings#password">
                       <KeyRound className="mr-2 h-4 w-4" /> Badilisha Nenosiri
                     </Link>
                   </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-8">
            {!isProgressLoading && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Muhtasari wa Mafunzo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center p-4 bg-muted/50 rounded-lg">
                      <BookOpen className="h-8 w-8 text-primary mr-4" />
                      <div>
                        <p className="text-2xl font-bold text-foreground">{totalCoursesStarted}</p>
                        <p className="text-sm text-muted-foreground">Kozi Zilizoanzishwa</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-muted/50 rounded-lg">
                      <CheckSquare className="h-8 w-8 text-primary mr-4" />
                      <div>
                        <p className="text-2xl font-bold text-foreground">{totalLessonsCompleted}</p>
                        <p className="text-sm text-muted-foreground">Masomo Yaliyokamilika</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="font-headline text-2xl md:text-3xl text-foreground mb-6 flex items-center">
                <BookOpen className="mr-3 h-7 w-7 text-primary" />
                Safari Yangu ya Kujifunza
              </h2>
              {isProgressLoading || authLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="ml-4 font-body text-muted-foreground">Inapakia maendeleo yako...</p>
                </div>
              ) : userProgress.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {userProgress.map((progress) => (
                    progress.courseDetails && progress.docId && (
                      <ProgressCourseCard
                        key={progress.docId}
                        course={progress.courseDetails}
                        progressPercentage={progress.progress_percentage ?? 0}
                        completedLessonsCount={progress.completed_lessons?.length ?? 0}
                      />
                    )
                  ))}
                </div>
              ) : (
                <Card className="text-center">
                  <CardContent className="pt-8 pb-10">
                    <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-6" />
                    <h3 className="font-headline text-xl text-foreground mb-3">
                      Safari Yako ya Kujifunza Inasubiri!
                    </h3>
                    <p className="font-body text-muted-foreground mb-6 max-w-md mx-auto">
                      Gundua kozi zetu za kina na anza kukua katika ufahamu wako wa Neno la Mungu leo.
                    </p>
                    <Button asChild size="lg" className="font-headline">
                      <Link href="/kozi">Anza Kujifunza Sasa</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
