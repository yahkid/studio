
'use server';

import { db } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';

const donationSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(['mpesa', 'card', 'bank', 'cash']),
  status: z.enum(['initiated', 'completed', 'failed']),
  userId: z.string().optional(),
  userName: z.string().optional(),
});

type DonationInput = z.infer<typeof donationSchema>;

export async function logDonation(input: DonationInput) {
  const validatedFields = donationSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid data provided.',
    };
  }

  try {
    const donationData = {
      ...validatedFields.data,
      created_at: serverTimestamp(),
    };
    await addDoc(collection(db, 'donations'), donationData);
    return { success: true };
  } catch (error: any) {
    console.error('Error logging donation:', error);
    return {
      success: false,
      error: 'Could not record the donation intent.',
    };
  }
}
