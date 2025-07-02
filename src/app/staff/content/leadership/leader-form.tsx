
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { upsertLeader } from "./actions";
import { Loader2 } from "lucide-react";
import type { LeadershipDoc } from '@/types/firestore';

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

export function LeaderForm({ onFormSubmit, leader }: { onFormSubmit: () => void, leader?: EnrichedLeader | null }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [preview, setPreview] = React.useState<string | null>(leader?.imageSrc || null);

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
