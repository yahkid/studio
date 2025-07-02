
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { z } from 'zod';
import type { SermonDoc } from '@/types/firestore';

const sermonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  speaker: z.string().min(2, 'Speaker name is required.'),
  youtube_video_id: z.string().min(11, 'Must be a valid YouTube Video ID.'),
  sermon_date: z.coerce.date({ required_error: 'Sermon date is required.' }),
  is_featured: z.coerce.boolean().default(false),
  is_published: z.coerce.boolean().default(false),
  tags: z.string().optional(),
  audioDownloadUrl: z.string().url().optional().or(z.literal('')),
  videoDownloadUrl: z.string().url().optional().or(z.literal('')),
});

export async function upsertSermon(formData: FormData) {
    const sermonId = formData.get('id') as string | null;
    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        speaker: formData.get('speaker'),
        youtube_video_id: formData.get('youtube_video_id'),
        sermon_date: formData.get('sermon_date'),
        is_featured: formData.get('is_featured') === 'true',
        is_published: formData.get('is_published') === 'true',
        tags: formData.get('tags'),
        audioDownloadUrl: formData.get('audioDownloadUrl'),
        videoDownloadUrl: formData.get('videoDownloadUrl'),
    };

    const validatedFields = sermonSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return { success: false, error: JSON.stringify(validatedFields.error.flatten().fieldErrors) };
    }

    try {
        const dataToSave: Omit<SermonDoc, 'id'> = {
            ...validatedFields.data,
            sermon_date: Timestamp.fromDate(validatedFields.data.sermon_date),
            tags: validatedFields.data.tags ? validatedFields.data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        };
        
        if (sermonId) {
            const docRef = doc(db, 'sermons', sermonId);
            await updateDoc(docRef, dataToSave);
        } else {
            await addDoc(collection(db, 'sermons'), dataToSave);
        }

        revalidatePath('/'); // For watch and grow section
        revalidatePath('/sermons');
        revalidatePath(`/sermons/${sermonId}`);
        revalidatePath('/staff/content/sermons');
        return { success: true };

    } catch (error: any) {
        console.error("Error upserting sermon:", error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function deleteSermon(sermonId: string) {
    if (!sermonId) {
        return { success: false, error: "Sermon ID is required." };
    }

    try {
        const docRef = doc(db, 'sermons', sermonId);
        await deleteDoc(docRef);

        revalidatePath('/');
        revalidatePath('/sermons');
        revalidatePath('/staff/content/sermons');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting sermon:", error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}


// New action for toggling publish status
export async function setSermonPublishedStatus(sermonId: string, is_published: boolean) {
  if (!sermonId) {
    return { success: false, error: "Sermon ID is required." };
  }

  try {
    const docRef = doc(db, 'sermons', sermonId);
    await updateDoc(docRef, { is_published });

    revalidatePath('/');
    revalidatePath('/sermons');
    revalidatePath('/staff/content/sermons');
    return { success: true };
  } catch (error: any) {
    console.error("Error updating sermon status:", error);
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}

