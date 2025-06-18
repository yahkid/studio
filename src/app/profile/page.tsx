
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

type UserProgressRecord = Database['public']['Tables']['UserCourseProgress']['Row'];
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
    if (!mounted || !session?.user) {
      setIsLoading(false);
      setUserProgress([]); 
      return;
    }

    const fetchProgress = async () => {
      setIsLoading(true);
      console.log("ProfilePage: Attempting to fetch progress for user:", session.user.id);
      try {
        const { data, error } = await supabase
          .from('UserCourseProgress')
          .select('*')
          .eq('user_id', session.user.id);

        console.log("ProfilePage: Fetched UserCourseProgress data from Supabase (raw):", { data, error });

        if (error) {
          // Check for the "empty-ish" error object scenario (often RLS or permissions)
          if (typeof error === 'object' && error !== null && Object.keys(error).length === 0) {
            console.warn("ProfilePage: Supabase returned an error object with no enumerable properties while fetching UserCourseProgress. This might indicate an RLS configuration issue or the table is not accessible as expected. User progress will be shown as empty.", error);
            toast({
              title: 'Progress Unavailable',
              description: 'We could not retrieve your learning progress at this time. Please check your access permissions or try again later.',
              variant: 'default', 
            });
            setUserProgress([]); // Explicitly set progress to empty
          } else {
            // Handle other, more specific errors
            console.error("ProfilePage: Error fetching UserCourseProgress raw data (with details):", error);
            toast({
              title: 'Error Fetching Progress',
              description: error.message || 'An unexpected error occurred while fetching your learning journey.',
              variant: 'destructive',
            });
            setUserProgress([]); // Explicitly set progress to empty
          }
        } else if (data) {
          const enrichedData = data.map(progressRecord => {
            const courseDetails = getCourseById(progressRecord.course_id);
            console.log(`ProfilePage: Enriching course_id: ${progressRecord.course_id}. Found course details?`, !!courseDetails, courseDetails?.title);
            return { ...progressRecord, courseDetails };
          }).filter(record => record.courseDetails); 
          
          console.log("ProfilePage: Enriched and filtered user progress for display:", enrichedData);
          setUserProgress(enrichedData as EnrichedProgress[]);
        } else {
          // No error, but data is null or undefined (e.g. RLS returns nothing without error)
          console.log("ProfilePage: No error, but no data returned for UserCourseProgress.");
          setUserProgress([]);
        }
      } catch (outerError: any) {
        // This catch block handles errors from the data processing part (e.g., getCourseById) or other unexpected errors
        console.error("ProfilePage: Error in fetchProgress function (outer catch):", outerError);
        toast({ 
          title: 'Error Processing Data', 
          description: 'An unexpected error occurred while processing your progress.', 
          variant: 'destructive' 
        });
        setUserProgress([]);
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
                progress.courseDetails && ( 
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

