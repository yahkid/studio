
"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { EventDoc } from '@/types/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { deleteEvent, setEventPublishedStatus } from "./actions";
import { format } from "date-fns";
import Link from "next/link";
import { Loader2, PlusCircle, Trash2, AlertCircle, CalendarClock, Edit, Eye, EyeOff, CheckCircle, Circle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { EventForm } from "./event-form";

interface EnrichedEvent extends EventDoc {
    id: string;
}

function PublishEventButton({ event, onStatusChange }: { event: EnrichedEvent; onStatusChange: () => void }) {
    const { toast } = useToast();
    const [isPublishing, startPublishTransition] = useTransition();

    const handlePublishToggle = () => {
        startPublishTransition(async () => {
            const newStatus = !event.is_published;
            const result = await setEventPublishedStatus(event.id, newStatus);
            if (result.success) {
                toast({ title: newStatus ? "Event Published" : "Event Unpublished", description: "The event status has been updated." });
                onStatusChange();
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        });
    }

    return (
        <Button 
            onClick={handlePublishToggle}
            variant={event.is_published ? "secondary" : "default"} 
            size="sm" 
            className="w-full sm:w-auto"
            disabled={isPublishing}
        >
            {isPublishing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : event.is_published ? (
                <EyeOff className="mr-2 h-4 w-4" />
            ) : (
                <Eye className="mr-2 h-4 w-4" />
            )}
            {isPublishing ? "Updating..." : event.is_published ? "Unpublish" : "Publish"}
        </Button>
    )
}

export default function EventManagerPage() {
    const [events, setEvents] = useState<EnrichedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EnrichedEvent | null>(null);
    const [isDeleting, startDeleteTransition] = useTransition();
    const { toast } = useToast();

    const fetchEvents = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const eventsQuery = query(collection(db, "events"), orderBy("event_date", "desc"));
            const querySnapshot = await getDocs(eventsQuery);
            const fetchedEvents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as EnrichedEvent[];
            setEvents(fetchedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
            toast({ title: "Error", description: "Could not fetch events from the database.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleEdit = (event: EnrichedEvent) => {
        setEditingEvent(event);
        setIsSheetOpen(true);
    };

    const handleAdd = () => {
        setEditingEvent(null);
        setIsSheetOpen(true);
    };

    const handleDelete = (eventId: string) => {
        startDeleteTransition(async () => {
            const result = await deleteEvent(eventId);
            if (result.success) {
                toast({ title: "Event Deleted", description: "The event has been successfully removed." });
                fetchEvents();
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        });
    };

    const handleFormSubmit = () => {
      setIsSheetOpen(false);
      fetchEvents();
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <Link href="/staff/content" className="text-sm text-primary hover:underline">&larr; Back to Content Management</Link>
                    <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
                        <CalendarClock className="h-8 w-8 text-primary" />
                        Event Manager
                    </h1>
                    <p className="text-muted-foreground font-body">
                        Create, view, and manage all ministry events.
                    </p>
                </div>
                <Button onClick={handleAdd} suppressHydrationWarning={true}><PlusCircle className="mr-2 h-4 w-4" /> Add New Event</Button>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle>{editingEvent ? "Edit Event" : "Create New Event"}</SheetTitle>
                        <SheetDescription>Fill out the details for the event. Click save when you're done.</SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 pr-4 h-[calc(100vh-8rem)] overflow-y-auto">
                       <EventForm onFormSubmit={handleFormSubmit} event={editingEvent} />
                    </div>
                </SheetContent>
            </Sheet>

            {isLoading ? (
                 <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                 </div>
            ) : events.length === 0 ? (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Events Found</AlertTitle>
                    <AlertDescription>
                        There are no events in the database. Click "Add New Event" to get started.
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <Card key={event.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="font-headline text-lg">{event.title}</CardTitle>
                                    <Badge variant={event.is_published ? "default" : "secondary"} className="flex items-center">
                                      {event.is_published ? <CheckCircle className="mr-1 h-3 w-3" /> : <Circle className="mr-1 h-3 w-3"/>}
                                      {event.is_published ? "Published" : "Draft"}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    {event.event_date instanceof Timestamp ? format(event.event_date.toDate(), 'PPP') : 'Invalid Date'} at {event.start_time}
                                </CardDescription>
                            </CardHeader>
                             <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row justify-between items-stretch gap-2">
                                <PublishEventButton event={event} onStatusChange={fetchEvents} />
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => handleEdit(event)} className="flex-1 sm:flex-auto"><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon" disabled={isDeleting} className="flex-1 sm:flex-auto"><Trash2 className="h-4 w-4"/></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(event.id)} disabled={isDeleting}>
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
