
"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { CourseDoc } from '@/types/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { deleteCourse } from "./actions";
import { Loader2, PlusCircle, Trash2, Edit, AlertCircle, BookOpenCheck, BookOpen } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { CourseForm } from "./course-form";
import { Skeleton } from "@/components/ui/skeleton";

interface EnrichedCourse extends CourseDoc {
    id: string;
}

function CourseCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="p-0 relative">
                <Skeleton className="aspect-video w-full" />
            </CardHeader>
            <CardContent className="pt-4 flex-grow space-y-2">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
            </CardFooter>
        </Card>
    )
}

export default function CourseManagerPage() {
    const [courses, setCourses] = useState<EnrichedCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<EnrichedCourse | null>(null);
    const [isDeleting, startDeleteTransition] = useTransition();
    const { toast } = useToast();

    const fetchCourses = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const coursesQuery = query(collection(db, "courses"), orderBy("order", "asc"));
            const querySnapshot = await getDocs(coursesQuery);
            const fetchedCourses = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as EnrichedCourse[];
            setCourses(fetchedCourses);
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast({ title: "Error", description: "Could not fetch course data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleEdit = (course: EnrichedCourse) => {
        setEditingCourse(course);
        setIsSheetOpen(true);
    };
    
    const handleAdd = () => {
        setEditingCourse(null);
        setIsSheetOpen(true);
    };

    const handleDelete = (courseId: string) => {
        startDeleteTransition(async () => {
            const result = await deleteCourse(courseId);
            if (result.success) {
                toast({ title: "Course Deleted" });
                fetchCourses();
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        });
    };

    const handleFormSubmit = () => {
      setIsSheetOpen(false);
      fetchCourses();
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <Link href="/staff/content" className="text-sm text-primary hover:underline">&larr; Back to Content Management</Link>
                    <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
                        <BookOpenCheck className="h-8 w-8 text-primary" />
                        Course Manager
                    </h1>
                    <p className="text-muted-foreground font-body">
                        Create, edit, and manage learning courses.
                    </p>
                </div>
                <Button onClick={handleAdd} suppressHydrationWarning={true}><PlusCircle className="mr-2 h-4 w-4" /> Add New Course</Button>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-2xl">
                    <SheetHeader>
                        <SheetTitle>{editingCourse ? "Edit Course" : "Add New Course"}</SheetTitle>
                        <SheetDescription>Fill out the details for the course and its lessons.</SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 pr-4 h-[calc(100vh-8rem)] overflow-y-auto">
                       <CourseForm onFormSubmit={handleFormSubmit} course={editingCourse} />
                    </div>
                </SheetContent>
            </Sheet>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => <CourseCardSkeleton key={i} />)}
                </div>
            ) : courses.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>No Courses Found</AlertTitle><AlertDescription>Click "Add New Course" to get started.</AlertDescription></Alert>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <Card key={course.id} className="flex flex-col">
                            <CardHeader className="p-0 relative">
                                <Image src={course.image_url || 'https://placehold.co/600x400.png'} alt={course.title} width={600} height={400} className="aspect-video object-cover rounded-t-lg" />
                                <Badge variant={course.is_published ? "default" : "secondary"} className="absolute top-2 right-2">{course.is_published ? "Published" : "Draft"}</Badge>
                            </CardHeader>
                             <CardContent className="pt-4 flex-grow">
                                <CardTitle className="font-headline text-lg">{course.title}</CardTitle>
                                <CardDescription className="text-xs">Instructor: {course.instructor}</CardDescription>
                                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" /> {course.lessons.length} lessons
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(course)}><Edit className="h-4 w-4" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon" disabled={isDeleting}><Trash2 className="h-4 w-4"/></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this course and its image.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(course.id)} disabled={isDeleting}>
                                                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Yes, delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
