
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

// Your web app's Firebase configuration using environment variables
// Ensure these NEXT_PUBLIC_ variables are set in your environment (e.g., .env.local or Vercel environment variables)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let analytics: Analytics | undefined;

// Initialize Firebase
if (typeof window !== 'undefined') { // Ensure this code runs only on the client-side
  // Check if all required Firebase config values are present
  const requiredConfigKeys: (keyof typeof firebaseConfig)[] = [
    'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'
    // measurementId is optional for core functionality
  ];
  const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    console.warn(
      `Firebase initialization skipped due to missing environment variables: ${missingKeys.join(', ')}. ` +
      "Please ensure all NEXT_PUBLIC_FIREBASE_* variables are set."
    );
  } else if (!getApps().length) {
    try {
      console.log("Attempting to initialize Firebase with environment variables (firebaseClient.ts)...");
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      
      isAnalyticsSupported().then((supported) => {
        if (supported && firebaseConfig.measurementId) {
          analytics = getAnalytics(app);
          console.log("Firebase Analytics initialized.");
        } else {
          console.log("Firebase Analytics is not supported in this environment or measurementId is missing.");
        }
      });
      console.log("Firebase app, Auth, Firestore, Storage initialized successfully.");
    } catch (error) {
      console.error("Firebase initialization error in firebaseClient.ts:", error);
      app = undefined;
      auth = undefined;
      db = undefined;
      storage = undefined;
      analytics = undefined;
    }
  } else {
    app = getApps()[0];
    // console.log("Firebase app already initialized (firebaseClient.ts).");
    auth = getAuth(app); // Get existing auth instance
    db = getFirestore(app); // Get existing firestore instance
    storage = getStorage(app); // Get existing storage instance
    isAnalyticsSupported().then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        try {
          analytics = getAnalytics(app);
        } catch (e) {
          // console.warn("Could not get Analytics instance, it might not have been initialized or configured properly.");
        }
      }
    });
  }
}

export { app, auth, db, storage, analytics };
