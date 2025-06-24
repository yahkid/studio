
"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Users, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from 'next/link';

// Placeholder data
const totalVisitors = 12345;
const pageViews = 54321;
const visitorGrowth = 12.5; // percentage
const pageViewDecline = -2.1; // percentage

const monthlyData = [
  { name: 'Jan', visitors: 4000, pageViews: 2400 },
  { name: 'Feb', visitors: 3000, pageViews: 1398 },
  { name: 'Mar', visitors: 2000, pageViews: 9800 },
  { name: 'Apr', visitors: 2780, pageViews: 3908 },
  { name: 'May', visitors: 1890, pageViews: 4800 },
  { name: 'Jun', visitors: 2390, pageViews: 3800 },
  { name: 'Jul', visitors: 3490, pageViews: 4300 },
];

const topPagesData = [
  { name: 'Home', views: 12000 },
  { name: 'Sermons', views: 9800 },
  { name: 'Events', views: 7500 },
  { name: 'About', views: 5400 },
  { name: 'Contact', views: 3200 },
];


export default function AnalyticsPage() {
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

      {/* Key Metric Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {visitorGrowth > 0 ? <ArrowUpRight className="h-4 w-4 text-green-500" /> : <ArrowDownRight className="h-4 w-4 text-red-500" />}
              {visitorGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageViews.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground flex items-center">
              {pageViewDecline > 0 ? <ArrowUpRight className="h-4 w-4 text-green-500" /> : <ArrowDownRight className="h-4 w-4 text-red-500" />}
              {pageViewDecline}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visitor Trends</CardTitle>
            <CardDescription>Monthly visitors and page views.</CardDescription>
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
            <CardTitle>Top Pages by Views</CardTitle>
            <CardDescription>Most frequently visited pages.</CardDescription>
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
