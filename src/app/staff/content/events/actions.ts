
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { z } from 'zod';

const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  event_date: z.date({ required_error: 'Event date is required.' }),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid start time format (HH:MM).'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid end time format (HH:MM).'),
  event_type: z.enum(['weekly', 'monthly', 'special']),
  platform: z.string().min(1, 'Platform is required.'),
  stream_url: z.string().url('Please enter a valid URL.').or(z.literal('#')),
  audience: z.string().min(1, 'Audience is required.'),
});

export async function upsertEvent(formData: z.infer<typeof eventSchema> & { is_published?: boolean }) {
  const parsed = eventSchema.safeParse(formData);
  if (!parsed.success) {
    const errorMessages = parsed.error.flatten().fieldErrors;
    return { success: false, error: JSON.stringify(errorMessages) };
  }

  try {
    const { id, ...data } = parsed.data;
    const eventData = {
      ...data,
      event_date: Timestamp.fromDate(data.event_date),
    };
    
    if (id) {
        const docRef = doc(db, 'events', id);
        await updateDoc(docRef, eventData);
    } else {
        await addDoc(collection(db, 'events'), {
            ...eventData,
            is_published: formData.is_published || false,
        });
    }
    
    revalidatePath('/matukio');
    revalidatePath('/staff/content/events');

    return { success: true };
  } catch (error: any) {
    console.error("Error upserting event:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function deleteEvent(eventId: string) {
  if (!eventId) {
    return { success: false, error: 'Event ID is required.' };
  }

  try {
    await deleteDoc(doc(db, 'events', eventId));
    
    revalidatePath('/matukio');
    revalidatePath('/staff/content/events');

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function setEventPublishedStatus(eventId: string, is_published: boolean) {
  if (!eventId) {
    return { success: false, error: "Event ID is required." };
  }

  try {
    const docRef = doc(db, 'events', eventId);
    await updateDoc(docRef, { is_published });

    revalidatePath('/matukio');
    revalidatePath('/staff/content/events');
    return { success: true };
  } catch (error: any) {
    console.error("Error updating event status:", error);
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}
