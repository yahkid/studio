
'use server';

import { revalidatePath } from 'next/cache';
import { db, storage } from '@/lib/firebaseClient';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { z } from 'zod';
import type { ResourceDoc } from '@/types/firestore';

const resourceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  category: z.string().min(2, 'Category is required.'),
  fileType: z.enum(['PDF', 'DOCX', 'MP3', 'MP4', 'ZIP', 'PNG', 'JPG']),
  order: z.coerce.number().int().min(0, 'Order must be a positive number.'),
  aiHint: z.string().optional(),
});

async function safeDelete(storageUrl: string) {
    if (storageUrl && storageUrl.includes('firebasestorage.googleapis.com')) {
        try { 
            await deleteObject(ref(storage, storageUrl)); 
        } catch (e: any) { 
            if (e.code !== 'storage/object-not-found') console.warn("Could not delete old file:", e); 
        }
    }
}

export async function upsertResource(formData: FormData) {
  const resourceId = formData.get('id') as string | null;
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    fileType: formData.get('fileType'),
    order: formData.get('order'),
    aiHint: formData.get('aiHint') ?? undefined,
  };

  const validatedFields = resourceSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return { success: false, error: JSON.stringify(validatedFields.error.flatten().fieldErrors) };
  }
  
  const mainFile = formData.get('fileUrl') as File | null;
  const thumbnailFile = formData.get('thumbnailUrl') as File | null;
  let fileUrl = formData.get('currentFileUrl') as string || '';
  let thumbnailUrl = formData.get('currentThumbnailUrl') as string || '';

  try {
    const docRef = resourceId ? doc(db, 'resources', resourceId) : null;
    const existingData = docRef ? (await getDoc(docRef)).data() as ResourceDoc : null;

    if (mainFile && mainFile.size > 0) {
      if (existingData?.fileUrl) await safeDelete(existingData.fileUrl);
      const fileRef = ref(storage, `resources/files/${Date.now()}_${mainFile.name}`);
      fileUrl = await getDownloadURL(await uploadBytes(fileRef, mainFile));
    }
    
    if (thumbnailFile && thumbnailFile.size > 0) {
      if (existingData?.thumbnailUrl) await safeDelete(existingData.thumbnailUrl);
      const thumbRef = ref(storage, `resources/thumbnails/${Date.now()}_${thumbnailFile.name}`);
      thumbnailUrl = await getDownloadURL(await uploadBytes(thumbRef, thumbnailFile));
    }
    
    const dataToSave: Omit<ResourceDoc, 'id' | 'uploadedAt'> = {
      ...validatedFields.data,
      fileUrl,
      thumbnailUrl,
      order: validatedFields.data.order,
      aiHint: validatedFields.data.aiHint,
    };

    if (docRef) {
      await updateDoc(docRef, dataToSave);
    } else {
      await addDoc(collection(db, 'resources'), {
        ...dataToSave,
        uploadedAt: serverTimestamp(),
      });
    }

    revalidatePath('/resources');
    revalidatePath('/staff/content/resources');
    return { success: true };

  } catch (error: any) {
    console.error("Error upserting resource:", error);
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}

export async function deleteResource(resourceId: string) {
  if (!resourceId) {
    return { success: false, error: "Resource ID is required." };
  }

  try {
    const docRef = doc(db, 'resources', resourceId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data() as ResourceDoc;
        await safeDelete(data.fileUrl);
        if (data.thumbnailUrl) await safeDelete(data.thumbnailUrl);
    }
    
    await deleteDoc(docRef);

    revalidatePath('/resources');
    revalidatePath('/staff/content/resources');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}
