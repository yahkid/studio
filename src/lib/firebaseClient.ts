
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
// import { getAnalytics, type Analytics } from "firebase/analytics"; // Optional

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
// let analytics: Analytics; // Optional

if (typeof window !== 'undefined' && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    // if (firebaseConfig.measurementId) { // Optional
    //   analytics = getAnalytics(app);
    // }
  } catch (error) {
    console.error("Firebase initialization error", error);
    // You might want to throw the error or handle it in a way that
    // doesn't break the app but informs the user/developer.
  }
} else if (getApps().length > 0) {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  // if (firebaseConfig.measurementId) { // Optional
  //   analytics = getAnalytics(app);
  // }
}

// @ts-ignore
export { app, auth, db, storage };
// export { app, auth, db, storage, analytics }; // Optional

// Function to ensure all required env vars are present
export function checkFirebaseEnv() {
    const requiredEnvVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID',
    ];
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
        console.warn(`Warning: The following Firebase environment variables are missing: ${missingVars.join(', ')}. Firebase might not work correctly.`);
        return false;
    }
    return true;
}

// Call check on module load (primarily for server-side or build-time checks if applicable)
// For client-side, the try-catch in initialization block is more relevant for runtime.
if (typeof window !== 'undefined') { // Only run checkFirebaseEnv in client-side context
    checkFirebaseEnv();
}
