import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { staffNavGroups } from '@/lib/staff-nav'; // Import the new config

export const metadata: Metadata = {
  title: 'Dashibodi ya Wafanyakazi | HSCM Connect',
  description: 'Simamia shughuli za huduma kutoka Dashibodi ya Wafanyakazi.',
};

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

function DashboardCard({ title, description, icon: Icon, href }: DashboardCardProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full hover:border-primary hover:shadow-lg transition-all duration-200 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium font-body">{title}</CardTitle>
          <Icon className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground font-body">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function StaffDashboardPage() {
  // Flatten the groups into a single array of nav items
  const allNavItems = staffNavGroups.flatMap(group => group.items);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Dashibodi ya Wafanyakazi
        </h1>
        <p className="text-muted-foreground font-body">
          Karibu! Hizi ni zana za kusimamia shughuli za huduma.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allNavItems
          .filter(item => item.href !== '/staff') // Exclude the dashboard link from the cards
          .map(item => (
            <DashboardCard
              key={item.href}
              title={item.labelSw}
              description={item.description}
              icon={item.icon}
              href={item.href}
            />
        ))}
      </div>
    </div>
  );
}
