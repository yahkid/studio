
import Link from 'next/link';
import Image from 'next/image';
import type { Course } from '@/lib/courses-data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden border rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="p-0 relative group">
        <Link href={`/kozi/${course.course_slug}`} aria-label={`View course ${course.title}`}>
          <div className="aspect-[16/9] w-full overflow-hidden">
            <Image
              src={course.image_url || "https://placehold.co/600x338.png"}
              alt={`Cover image for ${course.title}`}
              width={600}
              height={338}
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint="online course education"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-3">
        <Link href={`/kozi/${course.course_slug}`} className="block">
          <CardTitle className="font-headline text-xl text-foreground hover:text-primary transition-colors duration-200">
            {course.title}
          </CardTitle>
        </Link>
        <CardDescription className="font-body text-sm text-muted-foreground line-clamp-3">
            {course.description}
        </CardDescription>
        <div className="flex items-center text-xs text-muted-foreground pt-2">
            <User className="h-3 w-3 mr-1.5" />
            <span>{course.instructor}</span>
            <span className="mx-2">|</span>
            <BookOpen className="h-3 w-3 mr-1.5" />
            <span>{course.lessons.length} Masomo</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full font-headline" size="sm">
          <Link href={`/kozi/${course.course_slug}`}>
            Anza Kozi
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
