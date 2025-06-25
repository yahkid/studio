
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { upsertSermon } from "./actions";
import { Loader2, CalendarIcon } from "lucide-react";
import type { SermonDoc } from "@/types/firestore";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

interface SermonFormProps {
  onFormSubmit: () => void;
  sermon?: (SermonDoc & { id: string }) | null;
}

const sermonFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  speaker: z.string().min(2, 'Speaker name is required.'),
  youtube_video_id: z.string().min(11, 'Must be a valid YouTube Video ID.'),
  sermon_date: z.date({ required_error: 'Sermon date is required.' }),
  is_featured: z.boolean().default(false),
  tags: z.string().optional(),
  audioDownloadUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  videoDownloadUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

type SermonFormValues = z.infer<typeof sermonFormSchema>;

export function SermonForm({ onFormSubmit, sermon }: SermonFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<SermonFormValues>({
    resolver: zodResolver(sermonFormSchema),
    defaultValues: {
      id: sermon?.id || '',
      title: sermon?.title || '',
      description: sermon?.description || '',
      speaker: sermon?.speaker || '',
      youtube_video_id: sermon?.youtube_video_id || '',
      sermon_date: sermon?.sermon_date ? sermon.sermon_date.toDate() : new Date(),
      is_featured: sermon?.is_featured || false,
      tags: sermon?.tags?.join(', ') || '',
      audioDownloadUrl: sermon?.audioDownloadUrl || '',
      videoDownloadUrl: sermon?.videoDownloadUrl || '',
    },
  });

  const onSubmit = (data: SermonFormValues) => {
    startTransition(async () => {
        const formData = new FormData();
        if (data.id) formData.append('id', data.id);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('speaker', data.speaker);
        formData.append('youtube_video_id', data.youtube_video_id);
        formData.append('sermon_date', data.sermon_date.toISOString());
        formData.append('is_featured', String(data.is_featured));
        if (data.tags) formData.append('tags', data.tags);
        if (data.audioDownloadUrl) formData.append('audioDownloadUrl', data.audioDownloadUrl);
        if (data.videoDownloadUrl) formData.append('videoDownloadUrl', data.videoDownloadUrl);

        const result = await upsertSermon(formData);
        if (result.success) {
            toast({ title: sermon ? "Sermon Updated" : "Sermon Created", description: "The sermon has been saved." });
            onFormSubmit();
        } else {
            toast({ title: "Error", description: result.error || "Failed to save sermon.", variant: "destructive" });
        }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Sermon Title</FormLabel><FormControl><Input placeholder="e.g., The Power of Forgiveness" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="speaker" render={({ field }) => (
            <FormItem><FormLabel>Speaker</FormLabel><FormControl><Input placeholder="e.g., Rev. Innocent Morris" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A short summary of the sermon..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="youtube_video_id" render={({ field }) => (
            <FormItem><FormLabel>YouTube Video ID</FormLabel><FormControl><Input placeholder="e.g., DpA0drOZsKc" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="sermon_date" render={({ field }) => (
          <FormItem className="flex flex-col"><FormLabel>Sermon Date</FormLabel>
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

        <FormField control={form.control} name="tags" render={({ field }) => (
            <FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="faith, hope, love" {...field} /></FormControl><FormDescription>Comma-separated list of tags.</FormDescription><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="audioDownloadUrl" render={({ field }) => (
            <FormItem><FormLabel>Audio Download URL (Optional)</FormLabel><FormControl><Input type="url" placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="videoDownloadUrl" render={({ field }) => (
            <FormItem><FormLabel>Video Download URL (Optional)</FormLabel><FormControl><Input type="url" placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="is_featured" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5">
            <FormLabel>Feature on Homepage</FormLabel><FormDescription>If checked, this sermon may appear on the homepage.</FormDescription></div>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
        )} />

        <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : sermon ? "Save Changes" : "Create Sermon"}
        </Button>
      </form>
    </Form>
  );
}
