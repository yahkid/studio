
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Baby, Shield, ShieldCheck, Newspaper, DollarSign, HandHeart, BarChart3, Settings, HeartHandshake, UsersRound, Users } from 'lucide-react';
import Link from 'next/link';

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
        <DashboardCard
          title="Pitia Shuhuda"
          description="Idhinisha na chapisha hadithi za watumiaji kwenye ukurasa wa nyumbani."
          icon={ShieldCheck}
          href="/admin/review-testimonies"
        />
        <DashboardCard
          title="Huduma za Kichungaji"
          description="Fuatilia maamuzi, maombi ya maombi, na mipango ya kutembelewa."
          icon={HandHeart}
          href="/staff/pastoral"
        />
        <DashboardCard
          title="Usimamizi wa Maudhui"
          description="Unda na hariri makala za blogu, mahubiri, na maelezo ya matukio."
          icon={Newspaper}
          href="/staff/content"
        />
        <DashboardCard
          title="Ukarimu"
          description="Simamia timu ya ukarimu na huduma kwa wageni."
          icon={HeartHandshake}
          href="/staff/humanitarian"
        />
        <DashboardCard
          title="Rasilimali Watu (HR)"
          description="Simamia maombi ya wanaojitolea na orodha ya wafanyakazi."
          icon={Users}
          href="/staff/human-resource"
        />
        <DashboardCard
          title="Huduma ya Vijana"
          description="Simamia matukio ya vijana na mawasiliano na wazazi."
          icon={UsersRound}
          href="/staff/youth"
        />
        <DashboardCard
          title="Huduma ya Watoto"
          description="Simamia uandikishaji, mtaala, na taarifa za wazazi."
          icon={Baby}
          href="/staff/children"
        />
        <DashboardCard
          title="Uchukuzi na Usalama"
          description="Tazama ratiba za matukio na ratibu wanaojitolea wa vifaa."
          icon={Shield}
          href="/staff/transport-security"
        />
        <DashboardCard
          title="Utoaji na Fedha"
          description="Tazama ripoti za utoaji na simamia data ya washirika wa kifedha."
          icon={DollarSign}
          href="/staff/finance"
        />
        <DashboardCard
          title="Takwimu"
          description="Pitia takwimu za trafiki ya tovuti na ushiriki."
          icon={BarChart3}
          href="/staff/analytics"
        />
        <DashboardCard
          title="Mipangilio ya Mfumo"
          description="Simamia mipangilio ya tovuti na majukumu ya watumiaji."
          icon={Settings}
          href="/staff/settings"
        />
      </div>
    </div>
  );
}
