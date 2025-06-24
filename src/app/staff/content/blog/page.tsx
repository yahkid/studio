
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
       <div className="mb-8">
        <Link href="/staff/content" className="text-sm text-primary hover:underline">&larr; Back to Content Management</Link>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
          <FileText className="h-8 w-8 text-primary" />
          Blog Manager
        </h1>
        <p className="text-muted-foreground font-body">
          This feature is under construction. Soon you will be able to write and publish articles here.
        </p>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>The blog management interface will be available here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Stay tuned for updates!</p>
        </CardContent>
      </Card>
    </div>
  )
}
