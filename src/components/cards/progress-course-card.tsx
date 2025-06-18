
"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Course } from '@/lib/courses-data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface ProgressCourseCardProps {
  course: Course;
  progressPercentage: number;
  completedLessonsCount: number;
}

export function ProgressCourseCard({
  course,
  progressPercentage,
  completedLessonsCount,
}: ProgressCourseCardProps) {
  const totalLessons = course.lessons.length;

  return (
    <Card className="flex flex-col h-full overflow-hidden border rounded-lg hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0 relative group">
        <Link href={`/kozi/${course.id}`} aria-label={`Endelea na kozi ${course.title}`}>
          <div className="aspect-[16/9] w-full overflow-hidden">
            <Image
              src={course.image || "https://placehold.co/600x338.png"}
              alt={`Picha ya jalada ya kozi ${course.title}`}
              width={600}
              height={338}
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint="course cover education"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-3">
        <Link href={`/kozi/${course.id}`} className="block">
          <CardTitle className="font-headline text-xl text-foreground hover:text-primary transition-colors duration-200">
            {course.title}
          </CardTitle>
        </Link>
        <div className="space-y-1 pt-1">
          <Progress value={progressPercentage} className="h-2 rounded-full" aria-label={`${progressPercentage}% imekamilika`} />
          <p className="font-body text-xs text-muted-foreground pt-1">
            Umemaliza {completedLessonsCount} kati ya {totalLessons} Masomo ({progressPercentage}%)
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full font-headline" variant="outline" size="sm">
          <Link href={`/kozi/${course.id}`}>
            Endelea Kujifunza
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
