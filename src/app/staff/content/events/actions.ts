
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  event_date: z.date({ required_error: 'Event date is required.' }),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid start time format (HH:MM).'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid end time format (HH:MM).'),
  event_type: z.enum(['weekly', 'monthly', 'special']),
  platform: z.string().min(1, 'Platform is required.'),
  stream_url: z.string().url('Please enter a valid URL.').or(z.literal('#')),
  audience: z.string().min(1, 'Audience is required.'),
  is_published: z.boolean(),
});

export async function createEvent(formData: z.infer<typeof eventSchema>) {
  // A server-side check for admin role would be ideal here in a real app
  // const isAdmin = await checkAdmin(); if (!isAdmin) return ...
  
  const parsed = eventSchema.safeParse(formData);
  if (!parsed.success) {
    // Flatten the error messages for easier display on the client
    const errorMessages = parsed.error.flatten().fieldErrors;
    return { success: false, error: JSON.stringify(errorMessages) };
  }

  try {
    const eventData = {
      ...parsed.data,
      event_date: Timestamp.fromDate(parsed.data.event_date),
    };
    await addDoc(collection(db, 'events'), eventData);
    
    // Revalidate paths to reflect the changes on public and admin pages
    revalidatePath('/matukio');
    revalidatePath('/staff/content/events');

    return { success: true };
  } catch (error: any) {
    console.error("Error creating event:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function deleteEvent(eventId: string) {
  // A server-side check for admin role would be ideal here
  
  if (!eventId) {
    return { success: false, error: 'Event ID is required.' };
  }

  try {
    await deleteDoc(doc(db, 'events', eventId));
    
    // Revalidate paths to reflect the changes
    revalidatePath('/matukio');
    revalidatePath('/staff/content/events');

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
