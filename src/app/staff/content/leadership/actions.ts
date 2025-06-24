
'use server';

import { revalidatePath } from 'next/cache';
import { db, storage } from '@/lib/firebaseClient';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { z } from 'zod';
import type { LeadershipDoc } from '@/types/firestore';

const leaderSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  bio: z.string().min(10, 'Bio must be at least 10 characters long.'),
  order: z.coerce.number().int().min(0, 'Order must be a positive number.'),
  aiHint: z.string().optional(),
});


export async function upsertLeader(formData: FormData) {
  const leaderId = formData.get('id') as string | null;
  const rawData = {
    name: formData.get('name'),
    title: formData.get('title'),
    bio: formData.get('bio'),
    order: formData.get('order'),
    aiHint: formData.get('aiHint'),
  };

  const validatedFields = leaderSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return { success: false, error: JSON.stringify(validatedFields.error.flatten().fieldErrors) };
  }

  const imageFile = formData.get('imageSrc') as File | null;
  let imageUrl = formData.get('currentImageUrl') as string || '';

  try {
    // If a new image is provided, upload it
    if (imageFile && imageFile.size > 0) {
      // Optional: Delete old image if updating and it's a Firebase Storage URL
      if (leaderId && imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
        try {
          const oldImageRef = ref(storage, imageUrl);
          await deleteObject(oldImageRef);
        } catch (e: any) {
          if (e.code !== 'storage/object-not-found') {
            console.warn("Could not delete old image:", e);
          }
        }
      }
      
      const imageRef = ref(storage, `leadership_images/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    // Ensure we don't save a non-URL to imageSrc
    if (!imageUrl || !imageUrl.startsWith('http')) {
        const docRef = leaderId ? doc(db, 'leadership', leaderId) : null;
        const docSnap = docRef ? await getDoc(docRef) : null;
        imageUrl = docSnap?.exists() ? (docSnap.data() as LeadershipDoc).imageSrc : '';
    }

    const dataToSave: Omit<LeadershipDoc, 'id'> = {
      ...validatedFields.data,
      imageSrc: imageUrl,
    };

    if (leaderId) {
      // Update existing leader
      const docRef = doc(db, 'leadership', leaderId);
      await updateDoc(docRef, dataToSave);
    } else {
      // Create new leader
      await addDoc(collection(db, 'leadership'), dataToSave);
    }

    revalidatePath('/uongozi');
    revalidatePath('/staff/content/leadership');
    return { success: true };

  } catch (error: any) {
    console.error("Error upserting leader:", error);
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}

export async function deleteLeader(leaderId: string) {
  if (!leaderId) {
    return { success: false, error: "Leader ID is required." };
  }

  try {
    const docRef = doc(db, 'leadership', leaderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data() as LeadershipDoc;
        // Delete the associated image from storage if it's a Firebase Storage URL
        if (data.imageSrc && data.imageSrc.includes('firebasestorage.googleapis.com')) {
            try {
                const imageRef = ref(storage, data.imageSrc);
                await deleteObject(imageRef);
            } catch (e: any) {
                // Ignore if object doesn't exist, log other errors
                if (e.code !== 'storage/object-not-found') {
                    console.warn("Could not delete leader image:", e);
                }
            }
        }
    }
    
    // Delete the document from Firestore
    await deleteDoc(docRef);

    revalidatePath('/uongozi');
    revalidatePath('/staff/content/leadership');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting leader:", error);
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}
