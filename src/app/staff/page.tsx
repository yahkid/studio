
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShieldCheck, Newspaper, DollarSign, HandHeart, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Staff Dashboard | HSCM Connect',
  description: 'Manage ministry operations from the Staff Dashboard.',
};

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

function DashboardCard({ title, description, icon: Icon, href }: DashboardCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full hover:border-primary hover:shadow-lg transition-all duration-200">
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
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Staff Dashboard
        </h1>
        <p className="text-muted-foreground font-body">
          Welcome! Here are the tools to manage ministry operations.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Review Testimonies"
          description="Approve and publish user-submitted stories to the homepage."
          icon={ShieldCheck}
          href="/admin/review-testimonies"
        />
        <DashboardCard
          title="Content Management"
          description="Create and edit blog posts, sermons, and event details."
          icon={Newspaper}
          href="/staff/content"
        />
        <DashboardCard
          title="Giving & Finance"
          description="View giving reports and manage financial partner data."
          icon={DollarSign}
          href="/staff/finance"
        />
        <DashboardCard
          title="Pastoral Care"
          description="Follow up on decisions, prayer requests, and visit plans."
          icon={HandHeart}
          href="/staff/pastoral"
        />
        <DashboardCard
          title="Analytics"
          description="Review website traffic and engagement statistics."
          icon={BarChart3}
          href="/staff/analytics"
        />
        <DashboardCard
          title="System Settings"
          description="Manage site settings and user roles."
          icon={Settings}
          href="/staff/settings"
        />
      </div>
    </div>
  );
}
