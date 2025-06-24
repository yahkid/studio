
"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { LeadershipDoc } from '@/types/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { upsertLeader, deleteLeader } from "./actions";
import { Loader2, PlusCircle, Trash2, Edit, AlertCircle, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

interface EnrichedLeader extends LeadershipDoc {
    id: string;
}

const leaderFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }),
  order: z.coerce.number().int().min(0, { message: "Order must be a non-negative number." }),
  imageSrc: z.any().optional(),
  currentImageUrl: z.string().optional(),
  aiHint: z.string().optional(),
});

type LeaderFormValues = z.infer<typeof leaderFormSchema>;

function LeaderForm({ onFormSubmit, leader }: { onFormSubmit: () => void, leader?: EnrichedLeader | null }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(leader?.imageSrc || null);

  const form = useForm<LeaderFormValues>({
    resolver: zodResolver(leaderFormSchema),
    defaultValues: {
      id: leader?.id || '',
      name: leader?.name || '',
      title: leader?.title || '',
      bio: leader?.bio || '',
      order: leader?.order || 1,
      currentImageUrl: leader?.imageSrc || '',
      aiHint: leader?.aiHint || '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      form.setValue('imageSrc', file);
    }
  };

  const onSubmit = (data: LeaderFormValues) => {
    startTransition(async () => {
        const formData = new FormData();
        if (data.id) formData.append('id', data.id);
        formData.append('name', data.name);
        formData.append('title', data.title);
        formData.append('bio', data.bio);
        formData.append('order', String(data.order));
        if (data.currentImageUrl) formData.append('currentImageUrl', data.currentImageUrl);
        if (data.aiHint) formData.append('aiHint', data.aiHint);
        if (data.imageSrc instanceof File) {
            formData.append('imageSrc', data.imageSrc);
        }

        const result = await upsertLeader(formData);
        if (result.success) {
            toast({ title: leader ? "Leader Updated" : "Leader Created", description: "The leadership profile has been saved." });
            onFormSubmit();
            form.reset();
        } else {
            toast({ title: "Error", description: result.error || "Failed to save leader.", variant: "destructive" });
        }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Leader's full name" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Senior Pastor" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="bio" render={({ field }) => (
          <FormItem><FormLabel>Biography</FormLabel><FormControl><Textarea placeholder="A short bio about the leader..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" placeholder="1" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="aiHint" render={({ field }) => (
            <FormItem><FormLabel>AI Image Hint (Optional)</FormLabel><FormControl><Input placeholder="e.g., portrait man" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormItem>
            <FormLabel>Profile Image</FormLabel>
            {preview && <Image src={preview} alt="Image preview" width={100} height={100} className="rounded-md object-cover mt-2" />}
            <FormControl><Input type="file" accept="image/*" onChange={handleFileChange} /></FormControl>
            <FormMessage />
        </FormItem>
        <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}

export default function LeadershipManagerPage() {
    const [leaders, setLeaders] = useState<EnrichedLeader[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingLeader, setEditingLeader] = useState<EnrichedLeader | null>(null);
    const [isDeleting, startDeleteTransition] = useTransition();
    const { toast } = useToast();

    const fetchLeaders = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const leadersQuery = query(collection(db, "leadership"), orderBy("order", "asc"));
            const querySnapshot = await getDocs(leadersQuery);
            const fetchedLeaders = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as EnrichedLeader[];
            setLeaders(fetchedLeaders);
        } catch (error) {
            console.error("Error fetching leaders:", error);
            toast({ title: "Error", description: "Could not fetch leadership data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchLeaders();
    }, [fetchLeaders]);

    const handleEdit = (leader: EnrichedLeader) => {
        setEditingLeader(leader);
        setIsSheetOpen(true);
    };
    
    const handleAdd = () => {
        setEditingLeader(null);
        setIsSheetOpen(true);
    };

    const handleDelete = (leaderId: string) => {
        startDeleteTransition(async () => {
            const result = await deleteLeader(leaderId);
            if (result.success) {
                toast({ title: "Leader Deleted" });
                fetchLeaders();
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <Link href="/staff/content" className="text-sm text-primary hover:underline">&larr; Back to Content Management</Link>
                    <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
                        <Users className="h-8 w-8 text-primary" />
                        Leadership Manager
                    </h1>
                    <p className="text-muted-foreground font-body">
                        Add, edit, and manage leadership profiles.
                    </p>
                </div>
                <Button onClick={handleAdd} suppressHydrationWarning={true}><PlusCircle className="mr-2 h-4 w-4" /> Add New Leader</Button>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle>{editingLeader ? "Edit Leader Profile" : "Add New Leader"}</SheetTitle>
                        <SheetDescription>Fill out the details for the leadership profile.</SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 pr-4 h-[calc(100vh-8rem)] overflow-y-auto">
                       <LeaderForm onFormSubmit={() => { setIsSheetOpen(false); fetchLeaders(); }} leader={editingLeader} />
                    </div>
                </SheetContent>
            </Sheet>

            {isLoading ? (
                 <div className="flex justify-center items-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
            ) : leaders.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>No Leaders Found</AlertTitle><AlertDescription>Click "Add New Leader" to get started.</AlertDescription></Alert>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {leaders.map(leader => (
                        <Card key={leader.id} className="flex flex-col">
                            <CardHeader className="p-0">
                                <Image src={leader.imageSrc || 'https://placehold.co/400x400.png'} alt={leader.name} width={400} height={400} className="aspect-square object-cover rounded-t-lg" />
                            </CardHeader>
                             <CardContent className="pt-4 flex-grow">
                                <CardTitle className="font-headline text-lg">{leader.name}</CardTitle>
                                <CardDescription>{leader.title}</CardDescription>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(leader)}><Edit className="h-4 w-4" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon" disabled={isDeleting}><Trash2 className="h-4 w-4"/></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this leader's profile.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(leader.id)} disabled={isDeleting}>
                                                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Yes, delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
