
"use client";

import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';
import type { Course } from '@/lib/courses-data';
import { getCourseById } from '@/lib/courses-data';
import { ProgressCourseCard } from '@/components/cards/progress-course-card';
import { Loader2, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

type UserProgressRecord = Database['public']['Tables']['user_course_progress']['Row'];
interface EnrichedProgress extends UserProgressRecord {
  courseDetails?: Course;
}

export default function ProfilePage() {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState<EnrichedProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      setIsLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setIsLoading(true);
      console.log("ProfilePage: fetchProgress initiated.");

      if (!session?.user) {
        console.log("ProfilePage: No user session found. Cannot fetch progress.");
        setUserProgress([]);
        setIsLoading(false);
        return;
      }
      console.log("ProfilePage: User session found, attempting to fetch progress for user:", session.user.id);

      try {
        // Using the correct snake_case table name
        const { data: progressData, error: progressError } = await supabase
          .from('user_course_progress') // CORRECT snake_case name
          .select('id, course_id, completed_lessons, progress_percentage') // Select necessary columns
          .eq('user_id', session.user.id);

        console.log("ProfilePage: Supabase query executed. Error:", progressError, "Data:", progressData);

        if (progressError) {
          // Throw the actual error object if it exists.
          console.error("ProfilePage: Supabase returned an error:", progressError);
          throw progressError;
        }

        if (progressData) {
          console.log("ProfilePage: Successfully fetched user course progress (raw):", progressData);
          const enrichedData = progressData.map(progressRecord => {
            const courseDetails = getCourseById(progressRecord.course_id);
            console.log(`ProfilePage: Enriching course_id: ${progressRecord.course_id}. Found course details?`, !!courseDetails, courseDetails?.title);
            return { ...progressRecord, courseDetails };
          }).filter(record => record.courseDetails); // Ensure only records with valid course details are kept

          console.log("ProfilePage: Enriched and filtered user progress for display:", enrichedData);
          setUserProgress(enrichedData as EnrichedProgress[]);
        } else {
          // No error, but data is null or undefined (e.g. RLS returns nothing without error)
          console.log("ProfilePage: No error, but no data returned for UserCourseProgress. Setting progress to empty.");
          setUserProgress([]);
        }
      } catch (error: any) {
        // Log the entire error object for detailed debugging.
        console.error('ProfilePage: Error fetching or processing UserCourseProgress (with details):', error);
        
        let errorMessage = 'An unexpected error occurred while fetching your learning journey.';
        if (error && typeof error.message === 'string' && error.message.trim() !== '') {
          errorMessage = error.message.trim();
        }
        
        toast({
          title: 'Error Fetching Progress',
          description: errorMessage,
          variant: 'destructive',
        });
        setUserProgress([]); // Ensure progress is cleared on error
      } finally {
        setIsLoading(false);
        console.log("ProfilePage: Finished fetching progress, isLoading set to false.");
      }
    };

    fetchProgress();
  }, [session, supabase, mounted, toast]);

  const userDisplayName = session?.user?.user_metadata?.full_name || session?.user?.email;

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 font-body">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="mb-10">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-4">
            <User className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-3xl text-foreground">Wasifu Wako</CardTitle>
          </div>
          {session?.user ? (
            userDisplayName && (
              <CardDescription className="font-body text-muted-foreground">
                Karibu, <span className="font-semibold text-foreground">{userDisplayName}</span>!
              </CardDescription>
            )
          ) : (
            <CardDescription className="font-body text-muted-foreground">
              Tafadhali ingia ili kuona wasifu wako.
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      {session?.user && (
        <section>
          <h1 className="font-headline text-3xl md:text-4xl text-foreground mb-8">
            Safari Yangu ya Kujifunza
          </h1>
          {isLoading ? (
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
      {!session?.user && !isLoading && (
         <Card>
            <CardContent className="pt-6">
              <p className="font-body text-muted-foreground text-center py-8">
                Tafadhali ingia ili kuona safari yako ya kujifunza.
              </p>
            </CardContent>
          </Card>
      )}
    </div>
  );
}
