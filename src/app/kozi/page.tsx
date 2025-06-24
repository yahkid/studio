
import { type Metadata } from 'next';
import { getAllCourses } from '@/lib/courses-data';
import { CourseCard } from '@/components/cards/course-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpen, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kozi za Kujifunza | HSCM Connect',
  description: 'Gundua kozi zetu za mtandaoni zilizoundwa kukusaidia kukua katika imani na maarifa yako ya Neno la Mungu.',
};

export default async function CoursesPage() {
  const courses = await getAllCourses();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <BookOpen className="mx-auto h-16 w-16 text-primary mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
          Safari Yako ya Kukuza Imani
        </h1>
        <p className="font-body text-xl text-muted-foreground">
          Chagua kutoka kwenye kozi zetu mbalimbali ili upate maarifa ya kina, uimarishe uhusiano wako na Mungu, na ugundue kusudi lako.
        </p>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <Alert className="max-w-xl mx-auto">
            <Search className="h-4 w-4" />
            <AlertTitle>Hakuna Kozi Zilizopatikana</AlertTitle>
            <AlertDescription>
              Samahani, hakuna kozi zilizochapishwa kwa sasa. Tafadhali angalia tena hivi karibuni!
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
