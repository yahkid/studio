
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clapperboard, FileText, CalendarClock, Newspaper, Users, BookOpenCheck, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Usimamizi wa Maudhui | Tovuti ya Wafanyakazi wa HSCM',
  description: 'Simamia mahubiri, makala za blogu, matukio, na uongozi kwa tovuti ya HSCM Connect.',
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
          Usimamizi wa Maudhui
        </h1>
        <p className="text-muted-foreground font-body">
          Zana kwa ajili ya timu ya Uzalishaji kuunda, kuhariri, na kuchapisha maudhui.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ManagementCard
          title="Meneja wa Mahubiri"
          description="Ongeza na simamia viungo vya mahubiri ya YouTube, vichwa, na wazungumzaji."
          icon={Clapperboard}
          href="/staff/content/sermons"
          buttonText="Simamia Mahubiri"
        />
        <ManagementCard
          title="Meneja wa Blogu"
          description="Andika, hariri, na chapisha makala kwa ajili ya blogu ya huduma."
          icon={FileText}
          href="/staff/content/blog"
          buttonText="Simamia Blogu"
        />
        <ManagementCard
          title="Meneja wa Kozi"
          description="Jenga na panga kozi za kujifunza zenye masomo ya video."
          icon={BookOpenCheck}
          href="/staff/content/courses"
          buttonText="Simamia Kozi"
        />
        <ManagementCard
          title="Meneja wa Matukio"
          description="Unda, sasisha, na simamia kalenda ya matukio ya umma."
          icon={CalendarClock}
          href="/staff/content/events"
          buttonText="Simamia Matukio"
        />
        <ManagementCard
          title="Meneja wa Uongozi"
          description="Ongeza, hariri, na panga upya wasifu wa viongozi kwenye tovuti."
          icon={Users}
          href="/staff/content/leadership"
          buttonText="Simamia Viongozi"
        />
        <ManagementCard
          title="Meneja wa Rasilimali"
          description="Pakia na simamia faili za kupakua kama miongozo, na picha."
          icon={Download}
          href="/staff/content/resources"
          buttonText="Simamia Rasilimali"
        />
      </div>
    </div>
  );
}
