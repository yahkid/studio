
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clapperboard, FileText, CalendarClock, Newspaper, Users, BookOpenCheck, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Content Management | HSCM Staff Portal',
  description: 'Manage sermons, blog posts, events, and leadership for the HSCM Connect website.',
};

interface ManagementCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  buttonText: string;
}

function ManagementCard({ title, description, icon: Icon, href, buttonText }: ManagementCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-muted rounded-full">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline text-xl">{title}</CardTitle>
            <CardDescription className="font-body">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow" />
      <CardFooter>
        <Button asChild className="w-full font-headline">
          <Link href={href}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ContentManagementPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3">
          <Newspaper className="h-8 w-8 text-primary" />
          Content Management
        </h1>
        <p className="text-muted-foreground font-body">
          Tools for the Production team to create, edit, and publish content.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
        <ManagementCard
          title="Course Manager"
          description="Build and organize learning courses with multiple video lessons."
          icon={BookOpenCheck}
          href="/staff/content/courses"
          buttonText="Manage Courses"
        />
        <ManagementCard
          title="Event Manager"
          description="Create, update, and manage the public events calendar."
          icon={CalendarClock}
          href="/staff/content/events"
          buttonText="Manage Events"
        />
        <ManagementCard
          title="Leadership Manager"
          description="Add, edit, and reorder leadership profiles on the public site."
          icon={Users}
          href="/staff/content/leadership"
          buttonText="Manage Leaders"
        />
        <ManagementCard
          title="Sermon Manager"
          description="Add and manage YouTube sermon links, titles, and speakers."
          icon={Clapperboard}
          href="/staff/content/sermons"
          buttonText="Manage Sermons"
        />
        <ManagementCard
          title="Blog Manager"
          description="Write, edit, and publish articles for the ministry blog."
          icon={FileText}
          href="/staff/content/blog"
          buttonText="Manage Blog"
        />
        <ManagementCard
          title="Resource Manager"
          description="Upload and manage downloadable files like guides, notes, and wallpapers."
          icon={Download}
          href="/staff/content/resources"
          buttonText="Manage Resources"
        />
      </div>
    </div>
  );
}
