
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
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { upsertBlogPost } from "./actions";
import { Loader2 } from "lucide-react";
import type { BlogPostDoc } from "@/types/firestore";

interface BlogFormProps {
  onFormSubmit: () => void;
  post?: (BlogPostDoc & { id: string }) | null;
}

const blogFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Kichwa cha habari lazima kiwe na herufi 3 au zaidi."),
  slug: z.string().optional(),
  author: z.string().min(2, "Jina la mwandishi linahitajika."),
  content: z.string().min(50, "Maudhui lazima yawe na herufi 50 au zaidi."),
  tags: z.string().optional(),
  is_published: z.boolean().default(false),
  image_url: z.any().optional(),
  currentImageUrl: z.string().optional(),
  aiHint: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

export function BlogForm({ onFormSubmit, post }: BlogFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [preview, setPreview] = React.useState<string | null>(post?.image_url || null);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      id: post?.id || '',
      title: post?.title || '',
      slug: post?.slug || '',
      author: post?.author || '',
      content: post?.content || '',
      tags: post?.tags?.join(', ') || '',
      is_published: post?.is_published || false,
      currentImageUrl: post?.image_url || '',
      aiHint: post?.ai_hint || '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      form.setValue('image_url', file);
    }
  };

  const onSubmit = (data: BlogFormValues) => {
    startTransition(async () => {
        const formData = new FormData();
        if (data.id) formData.append('id', data.id);
        formData.append('title', data.title);
        if (data.slug) formData.append('slug', data.slug);
        formData.append('author', data.author);
        formData.append('content', data.content);
        if (data.tags) formData.append('tags', data.tags);
        formData.append('is_published', String(data.is_published));
        if (data.aiHint) formData.append('aiHint', data.aiHint);
        if (data.currentImageUrl) formData.append('currentImageUrl', data.currentImageUrl);
        if (data.image_url instanceof File) {
            formData.append('image_url', data.image_url);
        }

        const result = await upsertBlogPost(formData);
        if (result.success) {
            toast({ title: post ? "Makala Imesasishwa" : "Makala Imeundwa", description: "Makala ya blogu imehifadhiwa." });
            onFormSubmit();
        } else {
            toast({ title: "Kosa", description: result.error || "Imeshindwa kuhifadhi makala ya blogu.", variant: "destructive" });
        }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 p-1">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Kichwa cha Makala</FormLabel><FormControl><Input placeholder="Mf. Nguvu ya Akili Iliyofanywa Upya" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="author" render={({ field }) => (
            <FormItem><FormLabel>Mwandishi</FormLabel><FormControl><Input placeholder="Mf. Mch. Innocent Morris" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="content" render={({ field }) => (
            <FormItem><FormLabel>Maudhui</FormLabel><FormControl><Textarea placeholder="Andika maudhui ya makala yako hapa..." {...field} rows={15} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="tags" render={({ field }) => (
            <FormItem><FormLabel>Vitambulisho (Tags)</FormLabel><FormControl><Input placeholder="imani, tumaini, upendo" {...field} /></FormControl><FormDescription>Orodha ya vitambulisho iliyotenganishwa kwa koma.</FormDescription><FormMessage /></FormItem>
           )} />
          <FormField control={form.control} name="is_published" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-2"><div className="space-y-0.5"><FormLabel>Hali</FormLabel>
            <FormDescription>Makala zilizochapishwa zitaonekana kwenye tovuti ya umma.</FormDescription></div>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
          )} />
           <FormField control={form.control} name="aiHint" render={({ field }) => (
            <FormItem><FormLabel>Kidokezo cha Picha kwa AI (Si lazima)</FormLabel><FormControl><Input placeholder="Mf. jua linachomoza juu ya mlima" {...field} /></FormControl><FormMessage /></FormItem>
           )} />
           <FormItem>
              <FormLabel>Picha ya Makala</FormLabel>
              {preview && <Image src={preview} alt="Onyesho la picha" width={120} height={67} className="rounded-md object-cover mt-2 aspect-video" />}
              <FormControl><Input type="file" accept="image/*" onChange={handleFileChange} /></FormControl>
              <FormMessage />
          </FormItem>
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Inahifadhi..." : post ? "Hifadhi Mabadiliko" : "Unda Makala"}
        </Button>
      </form>
    </Form>
  );
}
