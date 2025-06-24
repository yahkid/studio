
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from 'next/image';
import { useTransition } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { upsertResource } from "./actions";
import { Loader2 } from "lucide-react";
import type { ResourceDoc } from "@/types/firestore";

interface ResourceFormProps {
  onFormSubmit: () => void;
  resource?: (ResourceDoc & { id: string }) | null;
}

const fileTypes = ['PDF', 'DOCX', 'MP3', 'MP4', 'ZIP', 'PNG', 'JPG'] as const;

const resourceFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description is required."),
  category: z.string().min(2, "Category is required."),
  order: z.coerce.number().int().min(0, "Order must be a positive number."),
  fileType: z.enum(fileTypes),
  fileUrl: z.any().optional(),
  thumbnailUrl: z.any().optional(),
  currentFileUrl: z.string().optional(),
  currentThumbnailUrl: z.string().optional(),
  aiHint: z.string().optional(),
});

type ResourceFormValues = z.infer<typeof resourceFormSchema>;

export function ResourceForm({ onFormSubmit, resource }: ResourceFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(resource?.thumbnailUrl || null);

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      id: resource?.id || '',
      title: resource?.title || '',
      description: resource?.description || '',
      category: resource?.category || 'General',
      order: resource?.order || 1,
      fileType: resource?.fileType || 'PDF',
      currentFileUrl: resource?.fileUrl || '',
      currentThumbnailUrl: resource?.thumbnailUrl || '',
      aiHint: resource?.aiHint || '',
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      form.setValue('thumbnailUrl', file);
    }
  };

  const onSubmit = (data: ResourceFormValues) => {
    startTransition(async () => {
        const formData = new FormData();
        if (data.id) formData.append('id', data.id);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('order', String(data.order));
        formData.append('fileType', data.fileType);
        if (data.aiHint) formData.append('aiHint', data.aiHint);
        if (data.currentFileUrl) formData.append('currentFileUrl', data.currentFileUrl);
        if (data.currentThumbnailUrl) formData.append('currentThumbnailUrl', data.currentThumbnailUrl);
        if (data.fileUrl instanceof File) formData.append('fileUrl', data.fileUrl);
        if (data.thumbnailUrl instanceof File) formData.append('thumbnailUrl', data.thumbnailUrl);

        const result = await upsertResource(formData);
        if (result.success) {
            toast({ title: resource ? "Resource Updated" : "Resource Created", description: "The resource has been saved." });
            onFormSubmit();
        } else {
            toast({ title: "Error", description: result.error || "Failed to save resource.", variant: "destructive" });
        }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 p-1">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Weekly Sermon Notes" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A short description of the resource..." {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., E-Books" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
                <FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" placeholder="1" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <FormField control={form.control} name="fileType" render={({ field }) => (
            <FormItem><FormLabel>File Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {fileTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                </Select><FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="fileUrl" render={({ field: { onChange, value, ...rest } }) => (
            <FormItem><FormLabel>Resource File</FormLabel>
                <FormControl><Input type="file" onChange={e => onChange(e.target.files?.[0])} {...rest} /></FormControl>
                {resource?.fileUrl && <FormDescription>Current file: <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">View</a></FormDescription>}
                <FormMessage />
            </FormItem>
          )} />
          
          <FormField control={form.control} name="thumbnailUrl" render={({ field: { onChange, value, ...rest } }) => (
            <FormItem><FormLabel>Thumbnail Image (Optional)</FormLabel>
                {thumbnailPreview && <Image src={thumbnailPreview} alt="Thumbnail preview" width={120} height={67} className="rounded-md object-cover mt-2 aspect-video" />}
                <FormControl><Input type="file" accept="image/*" onChange={handleThumbnailChange} /></FormControl>
                <FormMessage />
            </FormItem>
          )} />
           <FormField control={form.control} name="aiHint" render={({ field }) => (
            <FormItem><FormLabel>AI Image Hint (Optional)</FormLabel><FormControl><Input placeholder="e.g., abstract design" {...field} /></FormControl><FormMessage /></FormItem>
           )} />
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : resource ? "Save Changes" : "Create Resource"}
        </Button>
      </form>
    </Form>
  );
}
