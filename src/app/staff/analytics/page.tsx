
"use client"

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Users, HandHeart, MessageSquareText, BookOpen, Loader2, DollarSign } from "lucide-react";
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getAnalyticsData } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  isLoading: boolean;
}

function MetricCard({ title, value, icon: Icon, description, isLoading }: MetricCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-3/4" />
                ) : (
                  <div className="text-2xl font-bold">{value}</div>
                )}
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    )
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function AnalyticsPage() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getAnalyticsData();
      if (result.success) {
        setData(result);
      } else {
        toast({ title: "Error", description: "Failed to load analytics data.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    fetchData();
  }, [toast]);

  const stats = data?.stats || {};
  const chartData = data?.chartData || {};
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="mb-8">
        <Link href="/staff" className="text-sm text-primary hover:underline">&larr; Back to Staff Dashboard</Link>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground font-body">
          An overview of website traffic and user engagement.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard title="Total Users" value={stats.totalUsers?.toLocaleString() || '...'} icon={Users} description="Placeholder value" isLoading={isLoading} />
          <MetricCard title="Faith Decisions" value={stats.totalDecisions?.toLocaleString() || '...'} icon={HandHeart} description="Total decisions submitted" isLoading={isLoading} />
          <MetricCard title="Testimonies" value={stats.totalTestimonies?.toLocaleString() || '...'} icon={MessageSquareText} description="Total stories shared" isLoading={isLoading} />
          <MetricCard title="Total Donations (TZS)" value={isClient ? `TZS ${stats.totalDonationAmount?.toLocaleString('en-US') || '...'}` : 'Loading...'} icon={DollarSign} description={`${stats.totalSuccessfulDonations || 0} successful donations`} isLoading={isLoading} />
          <MetricCard title="Lessons Completed" value={stats.totalLessonsCompleted?.toLocaleString() || '...'} icon={BookOpen} description={`Across ${stats.totalCoursesStarted || 0} started courses`} isLoading={isLoading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Decisions Over Time</CardTitle>
            <CardDescription>Monthly count of submitted faith decisions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {isLoading || !chartData.decisionsTimeSeries ? (
                 <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
              ) : (
                <LineChart data={chartData.decisionsTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(val) => new Date(val + '-02').toLocaleDateString('en-US', { month: 'short' })} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Decisions" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Decision Types</CardTitle>
            <CardDescription>Breakdown of all decisions made.</CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
               {isLoading || !chartData.decisionTypeData ? (
                 <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
              ) : (
                <PieChart>
                    <Pie data={chartData.decisionTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                       {chartData.decisionTypeData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
            <CardHeader>
                <CardTitle>Donation Amount Over Time</CardTitle>
                <CardDescription>Monthly sum of successful donations.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    {isLoading || !chartData.donationsTimeSeries ? (
                        <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
                    ) : (
                        <BarChart data={chartData.donationsTimeSeries}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={(val) => new Date(val + '-02').toLocaleDateString('en-US', { month: 'short' })} />
                            <YAxis width={80} tickFormatter={(value) => `TZS ${Number(value) / 1000}k`} />
                            <Tooltip formatter={(value) => `TZS ${Number(value).toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="Amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

    </div>
  )
}
