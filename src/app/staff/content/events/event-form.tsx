
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { upsertEvent } from "./actions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import type { EventDoc } from '@/types/firestore';

interface EventFormProps {
  onFormSubmit: () => void;
  event?: (EventDoc & { id: string }) | null;
}

const eventFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  event_date: z.date({ required_error: "Event date is required." }),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Use HH:MM format." }),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Use HH:MM format." }),
  event_type: z.enum(['weekly', 'monthly', 'special'], { required_error: "Event type is required."}),
  platform: z.string().min(1, { message: "Platform is required." }),
  stream_url: z.string().url({ message: "Please enter a valid URL."}).or(z.literal('#')),
  audience: z.string().min(1, { message: "Audience is required." }),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function EventForm({ onFormSubmit, event }: EventFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      id: event?.id || '',
      title: event?.title || "",
      description: event?.description || "",
      event_date: event?.event_date ? event.event_date.toDate() : new Date(),
      start_time: event?.start_time || "20:00",
      end_time: event?.end_time || "21:30",
      event_type: event?.event_type || undefined,
      platform: event?.platform || "YouTube Live",
      stream_url: event?.stream_url || "#",
      audience: event?.audience || "All",
    },
  });

  React.useEffect(() => {
    form.reset({
      id: event?.id || '',
      title: event?.title || "",
      description: event?.description || "",
      event_date: event?.event_date ? event.event_date.toDate() : new Date(),
      start_time: event?.start_time || "20:00",
      end_time: event?.end_time || "21:30",
      event_type: event?.event_type || undefined,
      platform: event?.platform || "YouTube Live",
      stream_url: event?.stream_url || "#",
      audience: event?.audience || "All",
    })
  }, [event, form.reset]);


  const onSubmit = (data: EventFormValues) => {
    startTransition(async () => {
      // Pass the existing published status when updating
      const dataToSave = {
        ...data,
        is_published: event?.is_published || false,
      };
      
      const result = await upsertEvent(dataToSave);
      if (result.success) {
        toast({ title: event ? "Event Updated" : "Event Created", description: "The event has been saved successfully." });
        onFormSubmit();
        if (!event) form.reset(); // Only reset for new events
      } else {
        toast({ title: "Error", description: "Failed to save event. Please check the form.", variant: "destructive" });
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
        
        <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : "Save Event"}
        </Button>
      </form>
    </Form>
  );
}
