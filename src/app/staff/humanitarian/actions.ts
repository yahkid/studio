
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebaseClient';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { z } from 'zod';
import { auth } from '@/lib/firebaseClient';

const addNeedSchema = z.object({
  need_description: z.string().min(10, 'Description must be at least 10 characters.'),
  contact_person: z.string().optional(),
  contact_info: z.string().optional(),
});

const updateStatusSchema = z.object({
  needId: z.string(),
  status: z.enum(['new', 'in_progress', 'resolved']),
});

export async function addCommunityNeed(formData: z.infer<typeof addNeedSchema>) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { success: false, error: 'Authentication required.' };
  }

  const validatedFields = addNeedSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid data.' };
  }
  
  try {
    await addDoc(collection(db, 'community_needs'), {
      ...validatedFields.data,
      created_at: serverTimestamp(),
      submitted_by_id: currentUser.uid,
      submitted_by_name: currentUser.displayName || 'Unknown Staff',
      status: 'new',
    });

    revalidatePath('/staff/humanitarian');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateNeedStatus(formData: z.infer<typeof updateStatusSchema>) {
   const currentUser = auth.currentUser;
  if (!currentUser) {
    return { success: false, error: 'Authentication required.' };
  }

  const validatedFields = updateStatusSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid data.' };
  }

  try {
    const needRef = doc(db, 'community_needs', validatedFields.data.needId);
    await updateDoc(needRef, {
      status: validatedFields.data.status,
    });
    
    revalidatePath('/staff/humanitarian');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
