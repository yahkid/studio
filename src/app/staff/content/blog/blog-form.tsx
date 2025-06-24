
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
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().optional(),
  author: z.string().min(2, "Author name is required."),
  content: z.string().min(50, "Content must be at least 50 characters."),
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
      aiHint: post?.aiHint || '',
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
            toast({ title: post ? "Post Updated" : "Post Created", description: "The blog post has been saved." });
            onFormSubmit();
        } else {
            toast({ title: "Error", description: result.error || "Failed to save blog post.", variant: "destructive" });
        }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 p-1">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Post Title</FormLabel><FormControl><Input placeholder="e.g., The Power of a Renewed Mind" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="author" render={({ field }) => (
            <FormItem><FormLabel>Author</FormLabel><FormControl><Input placeholder="e.g., Rev. Innocent Morris" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="content" render={({ field }) => (
            <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea placeholder="Write your blog post content here. Markdown is not yet supported." {...field} rows={15} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="tags" render={({ field }) => (
            <FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="faith, hope, love" {...field} /></FormControl><FormDescription>Comma-separated list of tags.</FormDescription><FormMessage /></FormItem>
           )} />
          <FormField control={form.control} name="is_published" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-2"><div className="space-y-0.5"><FormLabel>Status</FormLabel>
            <FormDescription>Published posts will be visible on the public site.</FormDescription></div>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
          )} />
           <FormField control={form.control} name="aiHint" render={({ field }) => (
            <FormItem><FormLabel>AI Image Hint (Optional)</FormLabel><FormControl><Input placeholder="e.g., sunrise over mountain" {...field} /></FormControl><FormMessage /></FormItem>
           )} />
           <FormItem>
              <FormLabel>Featured Image</FormLabel>
              {preview && <Image src={preview} alt="Image preview" width={120} height={67} className="rounded-md object-cover mt-2 aspect-video" />}
              <FormControl><Input type="file" accept="image/*" onChange={handleFileChange} /></FormControl>
              <FormMessage />
          </FormItem>
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : post ? "Save Changes" : "Create Post"}
        </Button>
      </form>
    </Form>
  );
}
