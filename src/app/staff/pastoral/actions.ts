
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebaseClient';
import { doc, updateDoc } from 'firebase/firestore';

// This is a simplified check. In a real app, use custom claims or a dedicated admin collection.
const checkAdminOrPastoralRole = async () => {
    // This server-side check is a placeholder for actual role-based validation.
    // In a full implementation, you would verify the caller's custom claims.
    return true; 
};


export async function followUpOnDecision(decisionId: string) {
  const isAuthorized = await checkAdminOrPastoralRole();
  if (!isAuthorized) {
    return { success: false, error: 'Permission denied.' };
  }

  try {
    const decisionRef = doc(db, 'decisions', decisionId);
    
    // Here, you would update a status field, e.g., from 'pending' to 'contacted'.
    // Since the DecisionDoc doesn't have a status field yet, we'll log this action.
    // In a real app, add a 'status' field to the DecisionDoc type and Firestore documents.
    console.log(`Decision ${decisionId} marked as followed up.`);
    
    // Example of what the update would look like with a status field:
    // await updateDoc(decisionRef, { status: 'contacted', followedUpAt: serverTimestamp() });

    // Revalidate the pastoral care page to reflect changes
    revalidatePath('/staff/pastoral');

    return { success: true };
  } catch (error: any) {
    console.error("Error following up on decision:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
