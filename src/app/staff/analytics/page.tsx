
"use client"

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Users, Eye, ArrowUpRight, HandHeart, MessageSquareText, BookOpen, Loader2 } from "lucide-react";
import Link from 'next/link';
import { db } from '@/lib/firebaseClient';
import { collection, getCountFromServer } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

// Data ya mfano kwa chati
const monthlyData = [
  { name: 'Jan', wageni: 400, mitazamo: 240 },
  { name: 'Feb', wageni: 300, mitazamo: 139 },
  { name: 'Mac', wageni: 200, mitazamo: 980 },
  { name: 'Apr', wageni: 278, mitazamo: 390 },
  { name: 'Mei', wageni: 189, mitazamo: 480 },
  { name: 'Jun', wageni: 239, mitazamo: 380 },
  { name: 'Jul', wageni: 349, mitazamo: 430 },
];

const topPagesData = [
  { name: 'Nyumbani', mitazamo: 1200 },
  { name: 'Mahubiri', mitazamo: 980 },
  { name: 'Matukio', mitazamo: 750 },
  { name: 'Kuhusu', mitazamo: 540 },
  { name: 'Mawasiliano', mitazamo: 320 },
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
        // Kumbuka: Kuhesabu watumiaji moja kwa moja haiwezekani kupitia makusanyo ya Firestore.
        // Hii kwa kawaida ingetoka Firebase Auth au mkusanyiko wa watumiaji ulioigwa.
        // Tutatumia kishika nafasi kwa sasa.
        
        setStats({
          decisions: decisionsSnap.data().count,
          testimonies: testimoniesSnap.data().count,
          courses: coursesSnap.data().count,
          users: 150, // Kishika nafasi
        });
      } catch (error: any) {
        console.error("Kosa la kupata data ya takwimu:", error);
        toast({ title: "Kosa", description: "Imeshindwa kupata takwimu za uchanganuzi.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [toast]);
  

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="mb-8">
        <Link href="/staff" className="text-sm text-primary hover:underline">&larr; Rudi kwenye Dashibodi ya Wafanyakazi</Link>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Dashibodi ya Takwimu
        </h1>
        <p className="text-muted-foreground font-body">
          Muhtasari wa trafiki ya tovuti na ushiriki wa watumiaji.
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
            <MetricCard title="Jumla ya Watumiaji" value={stats.users} icon={Users} description="Thamani ya kishika nafasi" />
            <MetricCard title="Maamuzi ya Imani" value={stats.decisions} icon={HandHeart} description="Jumla ya maamuzi yaliyowasilishwa" />
            <MetricCard title="Shuhuda" value={stats.testimonies} icon={MessageSquareText} description="Jumla ya hadithi zilizoshirikiwa" />
            <MetricCard title="Kozi Zilizoanzishwa" value={stats.courses} icon={BookOpen} description="Jumla ya rekodi za maendeleo ya kozi" />
        </div>
      )}

      {/* Chati */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mwenendo wa Wageni (Mfano)</CardTitle>
            <CardDescription>Wageni wa kila mwezi na mitazamo ya kurasa. (Data ya maonyesho)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="wageni" name="Wageni" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="mitazamo" name="Mitazamo ya Kurasa" stroke="hsl(var(--secondary))" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kurasa Maarufu kwa Mitazamo (Mfano)</CardTitle>
            <CardDescription>Kurasa zinazotembelewa mara nyingi zaidi. (Data ya maonyesho)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPagesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="mitazamo" name="Mitazamo" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
