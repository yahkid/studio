
"use client"

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Users, Eye, ArrowUpRight, HandHeart, MessageSquareText, BookOpen, Loader2 } from "lucide-react";
import Link from 'next/link';
import { db } from '@/lib/firebaseClient';
import { collection, getCountFromServer } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

// Placeholder data for charts
const monthlyData = [
  { name: 'Jan', visitors: 400, pageViews: 240 },
  { name: 'Feb', visitors: 300, pageViews: 139 },
  { name: 'Mar', visitors: 200, pageViews: 980 },
  { name: 'Apr', visitors: 278, pageViews: 390 },
  { name: 'May', visitors: 189, pageViews: 480 },
  { name: 'Jun', visitors: 239, pageViews: 380 },
  { name: 'Jul', visitors: 349, pageViews: 430 },
];

const topPagesData = [
  { name: 'Home', views: 1200 },
  { name: 'Sermons', views: 980 },
  { name: 'Events', views: 750 },
  { name: 'About', views: 540 },
  { name: 'Contact', views: 320 },
];

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
}

function MetricCard({ title, value, icon: Icon, description }: MetricCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    )
}


export default function AnalyticsPage() {
  const [stats, setStats] = React.useState({ decisions: 0, testimonies: 0, courses: 0, users: 0 });
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const decisionsSnap = await getCountFromServer(collection(db, "decisions"));
        const testimoniesSnap = await getCountFromServer(collection(db, "user_testimonies"));
        const coursesSnap = await getCountFromServer(collection(db, "user_course_progress"));
        // Note: Counting users directly isn't possible via Firestore collections.
        // This would typically come from Firebase Auth or a mirrored users collection.
        // We will use a placeholder for now.
        
        setStats({
          decisions: decisionsSnap.data().count,
          testimonies: testimoniesSnap.data().count,
          courses: coursesSnap.data().count,
          users: 150, // Placeholder
        });
      } catch (error: any) {
        console.error("Error fetching analytics data:", error);
        toast({ title: "Error", description: "Could not fetch analytics stats.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [toast]);
  

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

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardHeader><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></CardHeader></Card>
            <Card><CardHeader><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></CardHeader></Card>
            <Card><CardHeader><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></CardHeader></Card>
            <Card><CardHeader><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></CardHeader></Card>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Users" value={stats.users} icon={Users} description="Placeholder value" />
            <MetricCard title="Faith Decisions" value={stats.decisions} icon={HandHeart} description="Total decisions submitted" />
            <MetricCard title="Testimonies" value={stats.testimonies} icon={MessageSquareText} description="Total stories shared" />
            <MetricCard title="Courses Started" value={stats.courses} icon={BookOpen} description="Total course progress records" />
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visitor Trends (Illustrative)</CardTitle>
            <CardDescription>Monthly visitors and page views. (Demo data)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="pageViews" stroke="hsl(var(--secondary))" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Pages by Views (Illustrative)</CardTitle>
            <CardDescription>Most frequently visited pages. (Demo data)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPagesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
