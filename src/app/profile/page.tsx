
"use client";

import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';
import type { Course } from '@/lib/courses-data';
import { getCourseById } from '@/lib/courses-data';
import { ProgressCourseCard } from '@/components/cards/progress-course-card';
import { Loader2, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

type UserProgressRecord = Database['public']['Tables']['UserCourseProgress']['Row'];
interface EnrichedProgress extends UserProgressRecord {
  courseDetails?: Course;
}

export default function ProfilePage() {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const [userProgress, setUserProgress] = useState<EnrichedProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !session?.user) {
      setIsLoading(false);
      setUserProgress([]); // Clear progress if no session or not mounted
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

        console.log("ProfilePage: Fetched UserCourseProgress data from Supabase:", data);
        if (error) {
          console.error("ProfilePage: Error fetching UserCourseProgress raw data:", error);
          throw error;
        }

        if (data) {
          const enrichedData = data.map(progressRecord => {
            const courseDetails = getCourseById(progressRecord.course_id);
            console.log(`ProfilePage: Enriching ${progressRecord.course_id}. Found course details?`, !!courseDetails, courseDetails?.title);
            return { ...progressRecord, courseDetails };
          }).filter(record => record.courseDetails); // Filter out any progress for courses not found (courseDetails will be undefined)
          
          console.log("ProfilePage: Enriched and filtered user progress for display:", enrichedData);
          setUserProgress(enrichedData as EnrichedProgress[]);
        } else {
          setUserProgress([]);
        }
      } catch (error: any) {
        console.error("ProfilePage: Error in fetchProgress function:", error);
        // Consider adding a toast notification for the user here
        setUserProgress([]); // Clear progress on error
      } finally {
        setIsLoading(false);
        console.log("ProfilePage: Finished fetching progress, isLoading set to false.");
      }
    };
    fetchProgress();
  }, [session, supabase, mounted]); // Dependencies for fetching progress

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
                // courseDetails should always exist here due to the filter
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
