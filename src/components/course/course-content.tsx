
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Course, Lesson } from '@/lib/courses-data';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase';
import type { FirestoreDocTypes } from '@/types/firestore';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2, PlayCircle, Lock, AlertCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebaseClient';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp, type Timestamp } from 'firebase/firestore';

interface CourseContentProps {
  course: Course;
}

export function CourseContent({ course }: CourseContentProps) {
  const { user, loading: authLoading, initialLoadingComplete } = useAuthFirebase();
  const { toast } = useToast();

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [showGuestSignupPrompt, setShowGuestSignupPrompt] = useState(false);
  const [progressDocId, setProgressDocId] = useState<string | null>(null);

  const currentLesson = useMemo(() => {
    return course.lessons[currentLessonIndex];
  }, [course.lessons, currentLessonIndex]);

  const progressPercentage = useMemo(() => {
    if (course.lessons.length === 0) return 0;
    return Math.round((completedLessons.length / course.lessons.length) * 100);
  }, [completedLessons, course.lessons.length]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!initialLoadingComplete) return; // Wait for auth state to be determined

      if (!user) {
        setIsLoadingProgress(false);
        setCompletedLessons([]); 
        setProgressDocId(null);
        setShowGuestSignupPrompt(true); 
        return;
      }
      setShowGuestSignupPrompt(false); 
      setIsLoadingProgress(true);
      try {
        const progressQuery = query(
          collection(db, "user_course_progress"),
          where("user_id", "==", user.uid),
          where("course_id", "==", course.course_slug)
        );
        const querySnapshot = await getDocs(progressQuery);

        if (!querySnapshot.empty) {
          const progressDoc = querySnapshot.docs[0];
          setProgressDocId(progressDoc.id);
          const data = progressDoc.data() as FirestoreDocTypes['user_course_progress'];
          setCompletedLessons(data.completed_lessons || []);
        } else {
          setCompletedLessons([]);
          setProgressDocId(null); 
        }
      } catch (error: any) {
        console.error('Error fetching progress from Firestore:', error);
        toast({
          title: 'Hitilafu ya Kupata Maendeleo',
          description: error.message || 'Imeshindwa kupata maendeleo yako.',
          variant: 'destructive',
        });
        setCompletedLessons([]);
        setProgressDocId(null);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [user, course.course_slug, toast, initialLoadingComplete]);
  
  useEffect(() => {
    if (initialLoadingComplete && !user && currentLesson) {
      setShowGuestSignupPrompt(true);
    } else if (user) {
      setShowGuestSignupPrompt(false);
    }
  }, [user, currentLesson, initialLoadingComplete]);


  const handleMarkComplete = async () => {
    if (!user) {
      setShowGuestSignupPrompt(true); 
      toast({
        title: 'Unahitaji Kuingia Kwanza',
        description: 'Tafadhali ingia au jisajili ili kuhifadhi maendeleo yako.',
        variant: 'default', 
      });
      return;
    }

    if (!currentLesson || completedLessons.includes(currentLesson.id)) {
      return; 
    }

    setIsSavingProgress(true);
    const newCompletedLessons = Array.from(new Set([...completedLessons, currentLesson.id]));
    const newProgressPercentage = Math.round((newCompletedLessons.length / course.lessons.length) * 100);

    const progressData: Omit<FirestoreDocTypes['user_course_progress'], 'id' | 'created_at'> & { last_accessed: Timestamp, created_at?: Timestamp } = {
        user_id: user.uid,
        course_id: course.course_slug,
        completed_lessons: newCompletedLessons,
        last_accessed: serverTimestamp() as Timestamp,
        progress_percentage: newProgressPercentage,
    };

    try {
      if (progressDocId) {
        const docRef = doc(db, "user_course_progress", progressDocId);
        await updateDoc(docRef, progressData);
      } else {
        // If document doesn't exist, create it with created_at timestamp
        progressData.created_at = serverTimestamp() as Timestamp;
        const newDocRef = await addDoc(collection(db, "user_course_progress"), progressData);
        setProgressDocId(newDocRef.id); // Store new doc ID for future updates
      }

      setCompletedLessons(newCompletedLessons);
      toast({
        title: 'Somo Limekamilika!',
        description: `Umefanikiwa kumaliza "${currentLesson.title}".`,
      });
    } catch (error: any) {
      console.error('Error saving progress to Firestore:', error);
      toast({
        title: 'Hitilafu Kuhifadhi Maendeleo',
        description: error.message || 'Imeshindwa kuhifadhi maendeleo yako.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingProgress(false);
    }
  };
  
  const isLessonCompleted = (lessonId: number) => completedLessons.includes(lessonId);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            <Image
              src={course.image_url || "https://placehold.co/600x400.png"}
              alt={course.title}
              width={600}
              height={400}
              className="w-full h-48 md:h-full object-cover"
              data-ai-hint="online course illustration"
            />
          </div>
          <div className="md:w-2/3 p-6 md:p-8">
            <h1 className="font-headline text-3xl md:text-4xl text-foreground mb-3">{course.title}</h1>
            <p className="font-body text-muted-foreground mb-2">Na: {course.instructor}</p>
            <p className="font-body text-muted-foreground mb-4 leading-relaxed">{course.description}</p>
            <div className="font-body text-sm text-muted-foreground">
              Masomo: {course.lessons.length} | Maendeleo: {isLoadingProgress || authLoading ? <Loader2 className="inline-block h-4 w-4 animate-spin" /> : `${progressPercentage}%`}
            </div>
          </div>
        </div>
      </Card>

      <div className="lg:flex lg:gap-8">
        <div className="lg:w-2/3 mb-8 lg:mb-0">
          {currentLesson ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-foreground">{currentLesson.title}</CardTitle>
                <CardDescription className="font-body">Somo la {currentLessonIndex + 1} kati ya {course.lessons.length} &bull; Muda: {currentLesson.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden mb-6 border">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${currentLesson.videoId}`}
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                {currentLesson.description && (
                   <p className="font-body text-muted-foreground mb-6">{currentLesson.description}</p>
                )}

                {user ? (
                  <Button
                    onClick={handleMarkComplete}
                    disabled={isSavingProgress || completedLessons.includes(currentLesson.id) || authLoading}
                    className="w-full font-headline"
                    size="lg"
                    suppressHydrationWarning
                  >
                    {isSavingProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {completedLessons.includes(currentLesson.id) ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" /> Imekamilika
                      </>
                    ) : (
                      'Weka Kama Limekamilika'
                    )}
                  </Button>
                ) : (
                   <Button onClick={handleMarkComplete} className="w-full font-headline" size="lg" disabled={authLoading}>
                     {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                     {authLoading ? 'Inapakia...' : 'Ingia Ili Kuhifadhi Maendeleo'}
                   </Button>
                )}

                {showGuestSignupPrompt && !user && initialLoadingComplete && (
                  <Alert variant="default" className="mt-6 border-primary/50">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    <AlertTitle className="font-headline text-primary">Hifadhi Maendeleo Yako!</AlertTitle>
                    <AlertDescription className="font-body">
                      Unafurahia kozi hii? Jisajili bure au ingia ili kuhifadhi maendeleo yako na kuendelea wakati mwingine.
                      <Button asChild variant="link" className="p-0 h-auto ml-1 text-primary hover:underline">
                        <Link href="/auth?mode=signup">Jisajili Sasa</Link>
                      </Button>
                    </AlertDescription>
                    <button onClick={() => setShowGuestSignupPrompt(false)} className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4"/>
                        <span className="sr-only">Funga arifa</span>
                    </button>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="font-body text-muted-foreground">Chagua somo ili kuanza.</p>
          )}
        </div>

        <div className="lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl text-foreground">Masomo ya Kozi</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-350px)] md:h-[calc(100vh-400px)] lg:h-auto lg:max-h-[600px]">
                <ul className="divide-y border-t">
                  {course.lessons.map((lesson, index) => (
                    <li key={lesson.id}>
                      <button
                        onClick={() => setCurrentLessonIndex(index)}
                        disabled={isLoadingProgress || authLoading}
                        className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                          index === currentLessonIndex ? 'bg-muted' : ''
                        } ${(isLoadingProgress || authLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {user && !isLoadingProgress && initialLoadingComplete ? (
                                  <Checkbox
                                    id={`lesson-${lesson.id}`}
                                    checked={isLessonCompleted(lesson.id)}
                                    aria-label={`Mark lesson ${lesson.title} as ${isLessonCompleted(lesson.id) ? 'incomplete' : 'complete'}`}
                                    onCheckedChange={(checked) => {
                                      if (checked && currentLesson && currentLesson.id === lesson.id && !completedLessons.includes(lesson.id)) {
                                         handleMarkComplete();
                                      }
                                    }}
                                    disabled={isSavingProgress || (currentLesson && lesson.id === currentLesson.id && completedLessons.includes(lesson.id))}
                                  />
                                ) : (
                                  <div className="w-5 h-5 flex items-center justify-center">
                                    {isLoadingProgress || authLoading ? <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" /> : <PlayCircle className="h-4 w-4 text-muted-foreground"/>}
                                  </div>
                                )}
                                <span className={`font-body ${index === currentLessonIndex ? 'text-primary font-semibold' : 'text-foreground'}`}>
                                  {index + 1}. {lesson.title}
                                </span>
                            </div>
                            <span className="font-body text-xs text-muted-foreground">{lesson.duration}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
