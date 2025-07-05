
"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { SermonDoc } from '@/types/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { deleteSermon, setSermonPublishedStatus } from "./actions"; // Import new action
import { Loader2, PlusCircle, Trash2, Edit, AlertCircle, Clapperboard, Youtube, CheckCircle, Circle, Eye, EyeOff } from "lucide-react"; // Import new icons
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { SermonForm } from "./sermon-form";
import { format } from "date-fns";

interface EnrichedSermon extends SermonDoc {
    id: string;
}

// Publish/Unpublish button component to handle state
function PublishSermonButton({ sermon, onStatusChange }: { sermon: EnrichedSermon, onStatusChange: () => void }) {
    const { toast } = useToast();
    const [isPublishing, startPublishTransition] = useTransition();

    const handlePublishToggle = () => {
        startPublishTransition(async () => {
            const newStatus = !sermon.is_published;
            const result = await setSermonPublishedStatus(sermon.id, newStatus);
            if (result.success) {
                toast({ title: newStatus ? "Sermon Published" : "Sermon Unpublished", description: "The sermon status has been updated." });
                onStatusChange();
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        });
    }

    return (
        <Button 
            onClick={handlePublishToggle}
            variant={sermon.is_published ? "secondary" : "default"} 
            size="sm" 
            className="w-full sm:w-auto"
            disabled={isPublishing}
        >
            {isPublishing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : sermon.is_published ? (
                <EyeOff className="mr-2 h-4 w-4" />
            ) : (
                <Eye className="mr-2 h-4 w-4" />
            )}
            {isPublishing ? "Updating..." : sermon.is_published ? "Unpublish" : "Publish"}
        </Button>
    )
}

export default function SermonManagerPage() {
    const [sermons, setSermons] = useState<EnrichedSermon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingSermon, setEditingSermon] = useState<EnrichedSermon | null>(null);
    const [isDeleting, startDeleteTransition] = useTransition();
    const { toast } = useToast();

    const fetchSermons = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const sermonsQuery = query(collection(db, "sermons"), orderBy("sermon_date", "desc"));
            const querySnapshot = await getDocs(sermonsQuery);
            const fetchedSermons = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as EnrichedSermon[];
            setSermons(fetchedSermons);
        } catch (error) {
            console.error("Error fetching sermons:", error);
            toast({ title: "Error", description: "Could not fetch sermon data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchSermons();
    }, [fetchSermons]);
    
    useEffect(() => {
        if (!isSheetOpen) {
            fetchSermons();
        }
    }, [isSheetOpen, fetchSermons]);

    const handleEdit = (sermon: EnrichedSermon) => {
        setEditingSermon(sermon);
        setIsSheetOpen(true);
    };
    
    const handleAdd = () => {
        setEditingSermon(null);
        setIsSheetOpen(true);
    };

    const handleDelete = (sermonId: string) => {
        startDeleteTransition(async () => {
            const result = await deleteSermon(sermonId);
            if (result.success) {
                toast({ title: "Sermon Deleted" });
                fetchSermons();
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        });
    };

    const handleFormSubmit = () => {
      setIsSheetOpen(false);
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <Link href="/staff/content" className="text-sm text-primary hover:underline">&larr; Back to Content Management</Link>
                    <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
                        <Clapperboard className="h-8 w-8 text-primary" />
                        Sermon Manager
                    </h1>
                    <p className="text-muted-foreground font-body">
                        Add, edit, and manage sermons.
                    </p>
                </div>
                <Button onClick={handleAdd} suppressHydrationWarning={true}><PlusCircle className="mr-2 h-4 w-4" /> Add New Sermon</Button>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-2xl">
                    <SheetHeader>
                        <SheetTitle>{editingSermon ? "Edit Sermon" : "Add New Sermon"}</SheetTitle>
                        <SheetDescription>Fill out the details for the sermon.</SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 pr-4 h-[calc(100vh-8rem)] overflow-y-auto">
                       <SermonForm onFormSubmit={handleFormSubmit} sermon={editingSermon} />
                    </div>
                </SheetContent>
            </Sheet>

            {isLoading ? (
                 <div className="flex justify-center items-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
            ) : sermons.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>No Sermons Found</AlertTitle><AlertDescription>Click "Add New Sermon" to get started.</AlertDescription></Alert>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sermons.map(sermon => (
                        <Card key={sermon.id} className="flex flex-col">
                            <CardHeader className="p-0 relative">
                                <Image 
                                    src={`https://img.youtube.com/vi/${sermon.youtube_video_id}/mqdefault.jpg`} 
                                    alt={sermon.title} 
                                    width={320} 
                                    height={180} 
                                    className="aspect-video object-cover rounded-t-lg" 
                                />
                                 <Badge variant={sermon.is_published ? "default" : "secondary"} className="absolute top-2 right-2 flex items-center">
                                    {sermon.is_published ? <CheckCircle className="mr-1 h-3 w-3" /> : <Circle className="mr-1 h-3 w-3"/>}
                                    {sermon.is_published ? "Published" : "Draft"}
                                </Badge>
                                {sermon.is_featured && <Badge variant="secondary" className="absolute top-2 left-2 bg-hscm-gold text-dark-text hover:bg-hscm-gold/80">Featured</Badge>}
                            </CardHeader>
                             <CardContent className="pt-4 flex-grow">
                                <p className="text-xs text-muted-foreground">{sermon.sermon_date ? format(sermon.sermon_date.toDate(), 'PPP') : ''}</p>
                                <CardTitle className="font-headline text-lg mt-1">{sermon.title}</CardTitle>
                                <CardDescription className="text-xs mt-1">Speaker: {sermon.speaker}</CardDescription>
                                <a href={`https://youtu.be/${sermon.youtube_video_id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-2">
                                  <Youtube className="h-3 w-3" /> Watch on YouTube
                                </a>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row justify-between items-stretch gap-2">
                                <PublishSermonButton sermon={sermon} onStatusChange={fetchSermons} />
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => handleEdit(sermon)} className="flex-1 sm:flex-auto"><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon" disabled={isDeleting} className="flex-1 sm:flex-auto"><Trash2 className="h-4 w-4"/></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(sermon.id)} disabled={isDeleting}>
                                                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Yes, delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
