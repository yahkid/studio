
'use server';

import { db } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';

const paymentIntentSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number."),
  currency: z.string().default('TZS'),
  name: z.string().min(1, "Name is required."),
  email: z.string().email("A valid email is required."),
  frequency: z.enum(['onetime', 'monthly']),
  paymentMethod: z.enum(['mpesa', 'tigopesa', 'card']),
  userId: z.string().optional(),
});

type PaymentIntentInput = z.infer<typeof paymentIntentSchema>;

/**
 * Creates a payment intent and logs the pending donation in Firestore.
 * In a real app, this is where you'd integrate with Stripe, Flutterwave, etc.
 */
export async function createPaymentIntent(input: PaymentIntentInput) {
  const validatedFields = paymentIntentSchema.safeParse(input);

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid data provided.' };
  }
  
  const { amount, currency, name, email, frequency, paymentMethod, userId } = validatedFields.data;

  // In a real app, this is where you would initialize your payment gateway SDK (e.g., Stripe)
  // with your secret key and create a payment intent.
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: amount * 100, // Amount in cents
  //   currency: currency,
  //   automatic_payment_methods: { enabled: true },
  // });
  
  // For this simulation, we'll generate a fake payment intent ID and client secret.
  const simulatedPaymentIntentId = `pi_${Math.random().toString(36).substr(2, 16)}`;
  const simulatedClientSecret = `${simulatedPaymentIntentId}_secret_${Date.now()}`;

  try {
    const donationData = {
      amount,
      currency,
      name,
      email,
      frequency,
      paymentMethod,
      userId: userId || null,
      status: 'pending' as const,
      paymentIntentId: simulatedPaymentIntentId,
      created_at: serverTimestamp(),
    };
    
    // Save the pending donation to your database
    const docRef = await addDoc(collection(db, 'donations'), donationData);

    // Return the client secret to the frontend to complete the payment
    return {
      success: true,
      clientSecret: simulatedClientSecret, // In real-world use, this would be paymentIntent.client_secret
      donationId: docRef.id
    };

  } catch (error: any) {
    console.error('Error creating payment intent and logging donation:', error);
    return {
      success: false,
      error: 'Could not initialize the payment. Please try again.',
    };
  }
}
