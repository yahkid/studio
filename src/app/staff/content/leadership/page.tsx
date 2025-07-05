
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
import { useToast } from "@/hooks/use-toast";
import { deleteLeader } from "./actions";
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
import { LeaderForm } from './leader-form';
import { Skeleton } from "@/components/ui/skeleton";

interface EnrichedLeader extends LeadershipDoc {
    id: string;
}

function LeaderCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="p-0">
                <Skeleton className="aspect-square w-full" />
            </CardHeader>
            <CardContent className="pt-4 flex-grow space-y-2">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
            </CardFooter>
        </Card>
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

    const handleFormSubmit = () => {
        setIsSheetOpen(false);
        fetchLeaders();
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
                       <LeaderForm onFormSubmit={handleFormSubmit} leader={editingLeader} />
                    </div>
                </SheetContent>
            </Sheet>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => <LeaderCardSkeleton key={i} />)}
                </div>
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
