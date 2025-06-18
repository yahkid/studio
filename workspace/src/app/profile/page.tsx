
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link'; // Added for login button
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';
import type { Course } from '@/lib/courses-data';
import { getCourseById } from '@/lib/courses-data';
import { ProgressCourseCard } from '@/components/cards/progress-course-card';
import { Loader2, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Added Avatar components
import { Button } from '@/components/ui/button'; // Added Button for login
import { useToast } from '@/hooks/use-toast';

type UserProgressRecord = Database['public']['Tables']['user_course_progress']['Row'];
interface EnrichedProgress extends UserProgressRecord {
  courseDetails?: Course;
}

// Helper function to get initials from a name string
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
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState<EnrichedProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Covers both session and progress loading initially
  const [isProgressLoading, setIsProgressLoading] = useState(true); // Specific for course progress
  const [mounted, setMounted] = useState(false);

  const userDisplayName = session?.user?.user_metadata?.full_name || session?.user?.email;

  useEffect(() => {
    setMounted(true);
    if (session === undefined) { // Still loading session
        setIsLoading(true);
    } else {
        setIsLoading(false); // Session loaded (or is null)
    }
  }, [session]);

  useEffect(() => {
    if (!mounted || !session?.user) {
      setIsProgressLoading(false); // No progress to load if not mounted or no user
      if (session !== undefined) setIsLoading(false); // Ensure main loading is off if session is determined
      return;
    }

    const fetchProgress = async () => {
      setIsProgressLoading(true);
      setIsLoading(false); // Main page structure can show, progress is loading separately
      try {
        const { data: progressData, error: progressError } = await supabase
          .from('user_course_progress')
          .select('id, course_id, completed_lessons, progress_percentage')
          .eq('user_id', session.user.id);

        if (progressError) {
          throw progressError;
        }

        if (progressData) {
          const enrichedData = progressData.map(progressRecord => {
            const courseDetails = getCourseById(progressRecord.course_id);
            return { ...progressRecord, courseDetails };
          }).filter(record => record.courseDetails);
          setUserProgress(enrichedData as EnrichedProgress[]);
        } else {
          setUserProgress([]);
        }
      } catch (error: any) {
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
  }, [session, supabase, mounted, toast]);


  if (!mounted || isLoading) { // Combined loading state for initial mount and session check
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 font-body text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* New Profile Header Card */}
      <Card className="mb-10 w-full overflow-hidden">
        <CardHeader className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:items-center sm:p-8 sm:text-left sm:gap-6 bg-muted/30 dark:bg-muted/10">
          {session?.user && (
            <Avatar className="h-24 w-24 text-3xl sm:h-32 sm:w-32 sm:text-5xl border-2 border-primary dark:border-primary shadow-md">
              {/* Placeholder for AvatarImage if you implement avatar uploads */}
              {/* <AvatarImage src={session.user.user_metadata?.avatar_url} alt={userDisplayName || 'User Avatar'} /> */}
              <AvatarFallback className="bg-background">
                {userDisplayName ? getInitials(userDisplayName) : <User className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            {session?.user ? (
              <>
                <CardTitle className="font-headline text-3xl sm:text-4xl text-foreground">
                  {userDisplayName || 'Mtumiaji'}
                </CardTitle>
                {session.user.email && (
                  <CardDescription className="font-body text-lg text-muted-foreground mt-1">
                    {session.user.email}
                  </CardDescription>
                )}
              </>
            ) : (
              // Logged out state within the card
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

      {/* Learning Journey Section - only shown if logged in */}
      {session?.user && (
        <section>
          <h2 className="font-headline text-3xl md:text-4xl text-foreground mb-8">
            Safari Yangu ya Kujifunza
          </h2>
          {isProgressLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="ml-4 font-body text-muted-foreground">Inapakia maendeleo yako...</p>
            </div>
          ) : userProgress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProgress.map((progress) => (
                progress.courseDetails && progress.id && (
                  <ProgressCourseCard
                    key={progress.id}
                    course={progress.courseDetails}
                    progressPercentage={progress.progress_percentage ?? 0}
                    completedLessonsCount={progress.completed_lessons?.length ?? 0}
                  />
                )
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="font-body text-muted-foreground text-center py-8">
                  Bado haujaanza kozi yoyote au hakuna maendeleo yaliyorekodiwa. Tembelea sehemu ya kozi ili kuanza kujifunza!
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      )}
    </div>
  );
}
