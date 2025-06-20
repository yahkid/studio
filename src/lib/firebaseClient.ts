
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
// import { getAnalytics, type Analytics } from "firebase/analytics"; // Optional

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;
let storageInstance: FirebaseStorage | undefined;
// let analytics: Analytics | undefined; // Optional

// Function to check for required environment variables
function checkEnvVarsPresent(): boolean {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    // Add others if strictly necessary for basic initialization
    // e.g., 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET' if storage is used early
  ];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);
  if (missingVars.length > 0) {
    console.error(
      `Firebase Critical Error: Missing essential environment variables: ${missingVars.join(', ')}. Firebase services will not be initialized.`
    );
    return false;
  }
  return true;
}

if (typeof window !== 'undefined') { // Ensure this code runs only on the client-side
  if (checkEnvVarsPresent()) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
    };

    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
        authInstance = getAuth(app);
        dbInstance = getFirestore(app);
        storageInstance = getStorage(app);
        // if (firebaseConfig.measurementId) { // Optional
        //   analytics = getAnalytics(app);
        // }
        console.log("Firebase initialized successfully.");
      } catch (error) {
        console.error("Firebase initialization error:", error);
        // app, authInstance, dbInstance, storageInstance will remain undefined
      }
    } else {
      app = getApps()[0];
      authInstance = getAuth(app);
      dbInstance = getFirestore(app);
      storageInstance = getStorage(app);
      // if (firebaseConfig.measurementId && app) { // Optional
      //   analytics = getAnalytics(app);
      // }
      console.log("Firebase app already initialized.");
    }
  }
}

// Export the potentially undefined instances using their intended names
export { app, authInstance as auth, dbInstance as db, storageInstance as storage };
// export { app, authInstance as auth, dbInstance as db, storageInstance as storage, analytics }; // Optional
