import { getCourseBySlug, type Course } from '@/lib/courses-data';
import { CourseContent } from '@/components/course/course-content';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { courseId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const courseSlug = params.courseId;
  const course = await getCourseBySlug(courseSlug);

  if (!course) {
    return {
      title: 'Kozi Haikupatikana | HSCM Connect',
    };
  }

  return {
    title: `${course.title} | HSCM Connect`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: course.image_url ? [{ url: course.image_url }] : [],
    },
  };
}

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const courseSlug = params.courseId;
  const course = await getCourseBySlug(courseSlug);

  if (!course) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Kozi Haikupatikana</AlertTitle>
          <AlertDescription>
            Samahani, kozi unayotafuta haipo. Tafadhali angalia URL au rudi kwenye orodha ya kozi.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <CourseContent course={course} />;
}
