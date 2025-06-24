
'use server';

import { revalidatePath } from 'next/cache';
import { db, auth } from '@/lib/firebaseClient';
import {
  doc,
  updateDoc,
  collection,
  query,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
  type Timestamp,
} from 'firebase/firestore';
import type { ContactLogDoc } from '@/types/firestore';

const checkAdminOrPastoralRole = async () => {
    // This server-side check is a placeholder for actual role-based validation.
    // In a full implementation, you would verify the caller's custom claims.
    return true; 
};

export async function getContactLogs(decisionId: string): Promise<ContactLogDoc[]> {
  const isAuthorized = await checkAdminOrPastoralRole();
  if (!isAuthorized) {
    // In a real app, you might throw an error or return a specific error object
    return [];
  }

  try {
    const logsQuery = query(
      collection(db, `decisions/${decisionId}/contact_logs`),
      orderBy('log_date', 'desc')
    );
    const querySnapshot = await getDocs(logsQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactLogDoc[];
  } catch (error: any) {
    console.error("Error fetching contact logs:", error);
    return [];
  }
}

export async function logNewContact(decisionId: string, notes: string) {
  const isAuthorized = await checkAdminOrPastoralRole();
  // The client-side auth check should prevent this, but it's good practice to check server-side too
  const currentUser = auth.currentUser; 

  if (!isAuthorized || !currentUser) {
    return { success: false, error: 'Permission denied or not logged in.' };
  }
  if (!notes.trim()) {
      return { success: false, error: 'Contact notes cannot be empty.' };
  }

  try {
    const decisionRef = doc(db, 'decisions', decisionId);
    const logsCollectionRef = collection(db, `decisions/${decisionId}/contact_logs`);
    
    // Add new log
    await addDoc(logsCollectionRef, {
      log_date: serverTimestamp(),
      notes: notes,
      pastor_id: currentUser.uid,
      pastor_name: currentUser.displayName || 'Unknown Staff',
    });

    // Update parent decision
    await updateDoc(decisionRef, {
      status: 'contacted',
      lastContactedAt: serverTimestamp(),
    });
    
    revalidatePath('/staff/pastoral');

    return { success: true };
  } catch (error: any) {
    console.error("Error logging new contact:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function updateDecisionStatus(decisionId: string, status: 'new' | 'contacted' | 'resolved') {
  const isAuthorized = await checkAdminOrPastoralRole();
  if (!isAuthorized) {
    return { success: false, error: 'Permission denied.' };
  }

  try {
    const decisionRef = doc(db, 'decisions', decisionId);
    await updateDoc(decisionRef, { status });
    revalidatePath('/staff/pastoral');
    return { success: true };
  } catch (error: any) {
    console.error("Error updating decision status:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
