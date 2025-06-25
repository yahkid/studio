
import { type NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/firebaseClient';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

// In a real application, you would import your payment gateway's library.
// e.g., import type Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * This API route handles incoming webhooks from a payment gateway.
 * It's crucial for securely confirming payments and updating the database.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  
  // STEP 1: Verify the webhook signature (CRITICAL FOR SECURITY)
  // Each payment gateway provides a mechanism to verify that the webhook request
  // is authentic. You must implement this to prevent fraudulent requests.
  // This is a placeholder for that logic.
  
  // Example for Stripe:
  // const signature = headers().get('Stripe-Signature') ?? '';
  // let event: Stripe.Event;
  // try {
  //   event = stripe.webhooks.constructEvent(
  //     body,
  //     signature,
  //     process.env.STRIPE_WEBHOOK_SECRET!
  //   );
  // } catch (err: any) {
  //   console.error(`❌ Error verifying webhook signature: ${err.message}`);
  //   return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  // }
  
  // For this simulation, we'll parse the JSON body directly without verification.
  // DO NOT DO THIS IN PRODUCTION.
  let event;
  try {
    event = JSON.parse(body);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: Invalid JSON`, { status: 400 });
  }

  // STEP 2: Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`✅ Webhook received: PaymentIntent ${paymentIntent.id} succeeded.`);
      
      try {
        // Find the corresponding donation in Firestore using the paymentIntentId
        const donationsQuery = query(
          collection(db, 'donations'),
          where('paymentIntentId', '==', paymentIntent.id)
        );
        const querySnapshot = await getDocs(donationsQuery);
        
        if (querySnapshot.empty) {
          console.error(`🚨 Webhook Error: No donation found with paymentIntentId: ${paymentIntent.id}`);
          // Return a 200 OK response to the gateway so it doesn't retry.
          return NextResponse.json({ success: true, message: "No document to update, but webhook acknowledged." });
        }

        // Update the status of the donation document to 'succeeded'
        const batch = writeBatch(db);
        querySnapshot.forEach(doc => {
          const donationRef = doc.ref;
          batch.update(donationRef, { status: 'succeeded' });
        });
        await batch.commit();

        console.log(`Database updated for paymentIntentId: ${paymentIntent.id}`);

      } catch (dbError: any) {
        console.error("🚨 Webhook Error: Database update failed.", dbError);
        // Return a 500 error to signal the gateway to retry the webhook.
        return new NextResponse('Internal Server Error', { status: 500 });
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log(`❌ Webhook received: PaymentIntent ${failedPaymentIntent.id} failed.`);
      // Optional: You could update the donation status to 'failed' here.
      break;
      
    default:
      console.warn(`🤷‍♀️ Unhandled event type received: ${event.type}`);
  }

  // STEP 3: Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ success: true });
}
