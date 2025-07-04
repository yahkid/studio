
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp, increment } from 'firebase/firestore';
import type { UserTestimonyDoc, PublishedTestimonyDoc } from '@/types/firestore';
import { auth } from 'firebase-admin';

// This is a simplified check. In a real app, use custom claims or a dedicated admin collection.
const checkAdmin = async () => {
    // This server-side check is a placeholder. 
    // Real admin verification should be done via security rules for database access
    // and potentially custom claims for API-like access.
    return true; 
};


export async function approveTestimony(testimonyId: string) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return { success: false, error: 'Permission denied.' };
  }

  try {
    const testimonyRef = doc(db, 'user_testimonies', testimonyId);
    const testimonySnap = await getDoc(testimonyRef);

    if (!testimonySnap.exists()) {
      return { success: false, error: 'Testimony not found.' };
    }

    const testimonyData = testimonySnap.data() as UserTestimonyDoc;

    if (testimonyData.status === 'approved') {
        return { success: false, error: 'Testimony has already been approved.' };
    }

    const newPublishedTestimony: Omit<PublishedTestimonyDoc, 'id'> = {
      name: testimonyData.userName,
      location: testimonyData.location || 'Unknown Location',
      quote: testimonyData.aiSuggestedQuote || 'A powerful testimony of faith.',
      story: testimonyData.story,
      image_url: testimonyData.fileUrl || `https://placehold.co/400x600.png?text=${testimonyData.userName.charAt(0)}`,
      ai_hint: 'portrait person',
      order: increment(1), // A simple way to order by publish time, may need a better system
      original_testimony_id: testimonyId,
      published_at: serverTimestamp() as any,
    };

    // Add to the published collection
    await addDoc(collection(db, 'published_testimonials'), newPublishedTestimony);

    // Update the original testimony status
    await updateDoc(testimonyRef, { status: 'approved' });

    // Revalidate the homepage to show the new testimony
    revalidatePath('/');
    // Revalidate the admin page to remove the approved testimony from the list
    revalidatePath('/staff/review-testimonies');

    return { success: true };
  } catch (error: any) {
    console.error("Error approving testimony:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function rejectTestimony(testimonyId: string) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return { success: false, error: 'Permission denied.' };
  }

  try {
    const testimonyRef = doc(db, 'user_testimonies', testimonyId);
    await updateDoc(testimonyRef, { status: 'rejected' });
    
    // Revalidate the admin page
    revalidatePath('/staff/review-testimonies');

    return { success: true };
  } catch (error: any) {
    console.error("Error rejecting testimony:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
