
'use server';

import { revalidatePath } from 'next/cache';
import { db, storage } from '@/lib/firebaseClient';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { z } from 'zod';
import type { CourseDoc } from '@/types/firestore';

const lessonSchema = z.object({
  id: z.coerce.number().int(),
  title: z.string(),
  videoId: z.string(),
  duration: z.string(),
  description: z.string().optional(),
  pdfDownloadUrl: z.string().optional(),
});

const courseSchema = z.object({
  id: z.string(), // This is the course_slug
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  instructor: z.string().min(2, 'Instructor name is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  order: z.coerce.number().int().min(0, 'Order must be a positive number.'),
  is_published: z.coerce.boolean(),
  lessons: z.preprocess((val) => {
    if (typeof val !== 'string') return val;
    try {
      // Safely parse the JSON string for lessons
      return JSON.parse(val);
    } catch (error) {
      // If parsing fails, return the original value to let Zod handle the type error
      return val;
    }
  }, z.array(lessonSchema).min(1, "At least one lesson is required.")),
});


export async function upsertCourse(formData: FormData) {
  const courseSlug = formData.get('id') as string;
  const rawData = {
    id: courseSlug,
    title: formData.get('title'),
    instructor: formData.get('instructor'),
    description: formData.get('description'),
    order: formData.get('order'),
    is_published: formData.get('is_published') === 'true',
    lessons: formData.get('lessons'), // Pass the string directly for Zod to process
  };

  const validatedFields = courseSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return { success: false, error: JSON.stringify(validatedFields.error.flatten().fieldErrors) };
  }
  
  const imageFile = formData.get('image_url') as File | null;
  let imageUrl = formData.get('currentImageUrl') as string || '';

  try {
    const docRef = doc(db, 'courses', courseSlug);

    // If a new image is provided, upload it
    if (imageFile && imageFile.size > 0) {
      // If updating, delete the old image if it exists in Firebase Storage
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const oldData = docSnap.data() as CourseDoc;
        if (oldData.image_url && oldData.image_url.includes('firebasestorage.googleapis.com')) {
          try {
            await deleteObject(ref(storage, oldData.image_url));
          } catch (e: any) {
            if (e.code !== 'storage/object-not-found') console.warn("Could not delete old image:", e);
          }
        }
      }
      
      const imageRef = ref(storage, `course_images/${courseSlug}_${Date.now()}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }
    
    const dataToSave: Omit<CourseDoc, 'id'> = {
      ...validatedFields.data,
      course_slug: courseSlug,
      image_url: imageUrl,
    };
    
    // Using setDoc to either create a new doc with a specific ID (slug) or overwrite an existing one.
    await setDoc(docRef, dataToSave);

    revalidatePath('/kozi');
    revalidatePath(`/kozi/${courseSlug}`);
    revalidatePath('/staff/content/courses');
    return { success: true };

  } catch (error: any) {
    console.error("Error upserting course:", error);
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}

export async function deleteCourse(courseId: string) {
  if (!courseId) {
    return { success: false, error: "Course ID is required." };
  }

  try {
    const docRef = doc(db, 'courses', courseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data() as CourseDoc;
        if (data.image_url && data.image_url.includes('firebasestorage.googleapis.com')) {
            try {
                await deleteObject(ref(storage, data.image_url));
            } catch (e: any) {
                if (e.code !== 'storage/object-not-found') console.warn("Could not delete course image:", e);
            }
        }
    }
    
    await deleteDoc(docRef);

    revalidatePath('/kozi');
    revalidatePath('/staff/content/courses');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting course:", error);
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}
