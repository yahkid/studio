
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import Link from 'next/link';

export default function TransportSecurityPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Link href="/staff" className="text-sm text-primary hover:underline">&larr; Back to Staff Dashboard</Link>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
          <Shield className="h-8 w-8 text-primary" />
          Transport & Security
        </h1>
        <p className="text-muted-foreground font-body">
          This feature is under construction. Soon you will be able to view event schedules and volunteer rosters here.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>The logistics coordination interface will be available here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Stay tuned for updates!</p>
        </CardContent>
      </Card>
    </div>
  )
}
