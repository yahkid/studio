
'use server';

import { db } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';

const donationSchema = z.object({
  amount: z.number().positive("Amount must be a positive number."),
  frequency: z.enum(['onetime', 'monthly']),
  name: z.string().min(1, "Name is required."),
  email: z.string().email("A valid email is required."),
  method: z.enum(['mpesa', 'tigopesa', 'card']),
  status: z.enum(['initiated', 'completed', 'failed']),
  userId: z.string().optional(),
});

type DonationInput = z.infer<typeof donationSchema>;

export async function logDonation(input: DonationInput) {
  const validatedFields = donationSchema.safeParse(input);

  if (!validatedFields.success) {
    console.error("Donation log validation error:", validatedFields.error.flatten());
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
    console.error('Error logging donation intent:', error);
    return {
      success: false,
      error: 'Could not record the donation intent. Please try again later.',
    };
  }
}
