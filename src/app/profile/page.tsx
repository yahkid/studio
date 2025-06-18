
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
      setUserProgress([]);
      return;
    }

    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('UserCourseProgress')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) throw error;

        if (data) {
          const enrichedData = data.map(progressRecord => {
            const courseDetails = getCourseById(progressRecord.course_id);
            return { ...progressRecord, courseDetails };
          }).filter(record => record.courseDetails); // Filter out any progress for courses not found
          setUserProgress(enrichedData as EnrichedProgress[]);
        }
      } catch (error: any) {
        console.error("Error fetching user progress:", error);
        // Consider adding a toast notification for the user here
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, [session, supabase, mounted]);

  const userDisplayName = session?.user?.user_metadata?.full_name || session?.user?.email;

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
                  Bado haujaanza kozi yoyote. Tembelea sehemu ya kozi ili kuanza kujifunza!
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      )}
    </div>
  );
}
