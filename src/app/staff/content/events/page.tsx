
"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { EventDoc } from '@/types/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createEvent, deleteEvent } from "./actions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { Loader2, PlusCircle, Calendar as CalendarIcon, Trash2, AlertCircle, CalendarClock } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface EnrichedEvent extends EventDoc {
    id: string;
}

const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  event_date: z.date({ required_error: "Event date is required." }),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Use HH:MM format." }),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Use HH:MM format." }),
  event_type: z.enum(['weekly', 'monthly', 'special'], { required_error: "Event type is required."}),
  platform: z.string().min(1, { message: "Platform is required." }),
  stream_url: z.string().url({ message: "Please enter a valid URL."}).or(z.literal('#')),
  audience: z.string().min(1, { message: "Audience is required." }),
  is_published: z.boolean().default(false),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

function AddEventForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_time: "20:00",
      end_time: "21:30",
      platform: "YouTube Live",
      stream_url: "#",
      audience: "All",
      is_published: false,
    },
  });

  const onSubmit = (data: EventFormValues) => {
    startTransition(async () => {
      const result = await createEvent(data);
      if (result.success) {
        toast({ title: "Event Created", description: "The new event has been added successfully." });
        onFormSubmit(); // Close sheet and refresh list
        form.reset();
      } else {
        toast({ title: "Error", description: "Failed to create event. Please check the form.", variant: "destructive" });
        console.error("Form submission error:", result.error);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Event Title" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the event..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="event_date" render={({ field }) => (
            <FormItem className="flex flex-col"><FormLabel>Event Date</FormLabel>
                <Popover><PopoverTrigger asChild>
                    <FormControl>
                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
                </Popover><FormMessage />
            </FormItem>
            )} />
             <FormField control={form.control} name="event_type" render={({ field }) => (
                <FormItem><FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="special">Special</SelectItem>
                        </SelectContent>
                    </Select><FormMessage />
                </FormItem>
            )} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="start_time" render={({ field }) => (
            <FormItem><FormLabel>Start Time (EAT)</FormLabel><FormControl><Input placeholder="HH:MM" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="end_time" render={({ field }) => (
            <FormItem><FormLabel>End Time (EAT)</FormLabel><FormControl><Input placeholder="HH:MM" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="platform" render={({ field }) => (
                <FormItem><FormLabel>Platform</FormLabel><FormControl><Input placeholder="e.g., YouTube, Zoom" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="audience" render={({ field }) => (
                <FormItem><FormLabel>Audience</FormLabel><FormControl><Input placeholder="e.g., All, Youth" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>

        <FormField control={form.control} name="stream_url" render={({ field }) => (
            <FormItem><FormLabel>Stream URL</FormLabel><FormControl><Input placeholder="https://" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="is_published" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5"><FormLabel>Publish Event</FormLabel>
                <p className="text-xs text-muted-foreground">Published events will appear on the public page.</p>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
        )} />

        <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Creating Event..." : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}


export default function EventManagerPage() {
    const [events, setEvents] = useState<EnrichedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDeleting, startDeleteTransition] = useTransition();
    const { toast } = useToast();

    const fetchEvents = async () => {
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
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = (eventId: string) => {
        startDeleteTransition(async () => {
            const result = await deleteEvent(eventId);
            if (result.success) {
                toast({ title: "Event Deleted", description: "The event has been successfully removed." });
                setEvents(prev => prev.filter(e => e.id !== eventId));
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
                        <CalendarClock className="h-8 w-8 text-primary" />
                        Event Manager
                    </h1>
                    <p className="text-muted-foreground font-body">
                        Create, view, and manage all ministry events.
                    </p>
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button suppressHydrationWarning={true}><PlusCircle className="mr-2 h-4 w-4" /> Add New Event</Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-lg">
                        <SheetHeader>
                            <SheetTitle>Create New Event</SheetTitle>
                            <SheetDescription>Fill out the details for the new event. Click create when you're done.</SheetDescription>
                        </SheetHeader>
                        <div className="mt-4 pr-4 h-[calc(100vh-8rem)] overflow-y-auto">
                           <AddEventForm onFormSubmit={() => { setIsSheetOpen(false); fetchEvents(); }} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

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
                                    <Badge variant={event.is_published ? "default" : "outline"}>{event.is_published ? "Published" : "Draft"}</Badge>
                                </div>
                                <CardDescription>
                                    {event.event_date instanceof Timestamp ? format(event.event_date.toDate(), 'PPP') : 'Invalid Date'} at {event.start_time}
                                </CardDescription>
                            </CardHeader>
                             <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" disabled={isDeleting} suppressHydrationWarning={true}>
                                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the event.
                                        </AlertDialogDescription>
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
                                {/* Edit button can be added here later */}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
