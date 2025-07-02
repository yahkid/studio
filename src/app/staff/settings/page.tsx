
"use client";

import * as React from 'react';
import { useTransition } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Settings, Database, AlertTriangle, Loader2 } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { seedDatabase } from './actions';

export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSeed = () => {
    startTransition(async () => {
      const result = await seedDatabase();
      if (result.success) {
        toast({
          title: "Database Imejazwa kwa Mafanikio",
          description: "Data ya mfano kwa maudhui yote imeongezwa.",
        });
      } else {
        toast({
          title: "Kosa la Kujaza Database",
          description: result.error || "Hitilafu isiyojulikana imetokea.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="mb-8">
        <Link href="/staff" className="text-sm text-primary hover:underline">&larr; Rudi kwenye Dashibodi ya Wafanyakazi</Link>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
          <Settings className="h-8 w-8 text-primary" />
          Mipangilio ya Mfumo
        </h1>
        <p className="text-muted-foreground font-body">
          Simamia mipangilio ya tovuti na fanya vitendo vya kiutawala.
        </p>
      </div>

      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-destructive font-headline text-xl">Vitendo Hatari</CardTitle>
          </div>
          <CardDescription>
            Vitendo hivi vinaweza kurekebisha au kufuta data kwenye database yako. Endelea kwa tahadhari.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body text-sm text-muted-foreground mb-4">
            Zana hii itajaza makusanyo yote makuu ya maudhui (`sermons`, `courses`, `leadership`, `events`, `blog_posts`, `resources`) na data ya mfano yenye ubora.
            <br />
            <strong className="text-destructive">Onyo:</strong> Kufanya hivi kutaunda hati mpya. Hakutafuta data iliyopo isipokuwa hati za `courses` na `leadership` zenye ID maalum.
          </p>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" suppressHydrationWarning={true}>
                <Database className="mr-2 h-4 w-4" />
                Jaza Data ya Mfano
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Una uhakika kabisa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Kitendo hiki kitaongeza data ya mfano kwenye database yako. Hati zilizopo za kozi na uongozi zenye ID maalum zinaweza kuandikwa upya.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Ghairi</AlertDialogCancel>
                <AlertDialogAction onClick={handleSeed} disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ndio, jaza database
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  )
}
