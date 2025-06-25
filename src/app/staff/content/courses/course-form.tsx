
"use client";

import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from 'next/image';
import { useTransition } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { upsertCourse } from "./actions";
import { Loader2, PlusCircle, Trash2, GripVertical } from "lucide-react";
import type { CourseDoc } from "@/types/firestore";

interface CourseFormProps {
  onFormSubmit: () => void;
  course?: CourseDoc & { id: string } | null;
}

const lessonSchema = z.object({
  id: z.coerce.number().int(),
  title: z.string().min(1, "Lesson title is required"),
  videoId: z.string().min(1, "YouTube Video ID is required"),
  duration: z.string().min(1, "Duration is required (e.g., 15:30)"),
  description: z.string().optional(),
  pdfDownloadUrl: z.string().optional(),
});

const courseFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters."),
  instructor: z.string().min(2, "Instructor name is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  order: z.coerce.number().int().min(0, "Order must be a positive number."),
  is_published: z.boolean().default(false),
  image_url: z.any().optional(),
  currentImageUrl: z.string().optional(),
  lessons: z.array(lessonSchema).min(1, "At least one lesson is required."),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export function CourseForm({ onFormSubmit, course }: CourseFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(course?.image_url || null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      id: course?.id || '',
      title: course?.title || '',
      instructor: course?.instructor || '',
      description: course?.description || '',
      order: course?.order || 1,
      is_published: course?.is_published || false,
      currentImageUrl: course?.image_url || '',
      lessons: course?.lessons || [{ id: 1, title: '', videoId: '', duration: '', description: '', pdfDownloadUrl: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lessons",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      form.setValue('image_url', file);
    }
  };
  
  function slugify(text: string) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w-]+/g, '')       // Remove all non-word chars
      .replace(/--+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }


  const onSubmit = (data: CourseFormValues) => {
    startTransition(async () => {
        const formData = new FormData();
        const courseSlug = data.id || slugify(data.title);
        if (!courseSlug) {
            toast({ title: "Error", description: "Could not generate a valid course slug from the title.", variant: "destructive" });
            return;
        }

        formData.append('id', courseSlug);
        formData.append('title', data.title);
        formData.append('instructor', data.instructor);
        formData.append('description', data.description);
        formData.append('order', String(data.order));
        formData.append('is_published', String(data.is_published));
        formData.append('lessons', JSON.stringify(data.lessons));
        if (data.currentImageUrl) formData.append('currentImageUrl', data.currentImageUrl);
        if (data.image_url instanceof File) {
            formData.append('image_url', data.image_url);
        }

        const result = await upsertCourse(formData);
        if (result.success) {
            toast({ title: course ? "Course Updated" : "Course Created", description: "The course has been saved." });
            onFormSubmit();
        } else {
            toast({ title: "Error", description: result.error || "Failed to save course.", variant: "destructive" });
        }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 p-1">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Course Title</FormLabel><FormControl><Input placeholder="e.g., Hearing God's Voice" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="instructor" render={({ field }) => (
            <FormItem><FormLabel>Instructor</FormLabel><FormControl><Input placeholder="e.g., Rev. Innocent Morris" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A short description of the course..." {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          
           <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" placeholder="1" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="is_published" render={({ field }) => (
                <FormItem className="flex flex-col rounded-lg border p-3 shadow-sm mt-2"><FormLabel>Status</FormLabel>
                <div className="flex items-center space-x-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <label className="text-sm font-medium">{field.value ? "Published" : "Draft"}</label></div>
                </FormItem>
            )} />
          </div>

          <FormItem>
              <FormLabel>Course Image</FormLabel>
              {preview && <Image src={preview} alt="Image preview" width={120} height={67} className="rounded-md object-cover mt-2 aspect-video" />}
              <FormControl><Input type="file" accept="image/*" onChange={handleFileChange} /></FormControl>
              <FormMessage />
          </FormItem>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-medium">Lessons</h3>
            {fields.map((field, index) => (
            <div key={field.id} className="relative space-y-3 rounded-md border p-4">
                 <div className="absolute top-2 right-2">
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
                 <div className="absolute top-1/2 -translate-y-1/2 -left-2 cursor-grab">
                   <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <p className="font-semibold">Lesson {index + 1}</p>
                <FormField control={form.control} name={`lessons.${index}.title`} render={({ field: f }) => (
                    <FormItem><FormLabel>Lesson Title</FormLabel><FormControl><Input {...f} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name={`lessons.${index}.videoId`} render={({ field: f }) => (
                        <FormItem><FormLabel>YouTube Video ID</FormLabel><FormControl><Input {...f} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`lessons.${index}.duration`} render={({ field: f }) => (
                        <FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g. 15:30" {...f} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name={`lessons.${index}.description`} render={({ field: f }) => (
                    <FormItem><FormLabel>Lesson Description</FormLabel><FormControl><Textarea placeholder="Short lesson summary..." {...f} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`lessons.${index}.pdfDownloadUrl`} render={({ field: f }) => (
                    <FormItem><FormLabel>PDF Download URL (Optional)</FormLabel><FormControl><Input placeholder="https://..." {...f} /></FormControl><FormMessage /></FormItem>
                )} />
                <Controller control={form.control} name={`lessons.${index}.id`} defaultValue={index + 1} render={({ field: { value } }) => <input type="hidden" value={value} />} />
            </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append({ id: fields.length + 1, title: '', videoId: '', duration: '', description: '', pdfDownloadUrl: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Lesson
            </Button>
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : course ? "Save Changes" : "Create Course"}
        </Button>
      </form>
    </Form>
  );
}
