
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
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
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
        console.log("Firebase app initialized successfully (firebaseClient.ts).");
      } catch (error) {
        console.error("Firebase initialization error in firebaseClient.ts:", error);
        app = undefined; // Explicitly set to undefined on error
      }
    } else {
      app = getApps()[0];
      console.log("Firebase app already initialized (firebaseClient.ts).");
    }

    if (app) {
      try {
        authInstance = getAuth(app);
        dbInstance = getFirestore(app);
        storageInstance = getStorage(app);
        // if (firebaseConfig.measurementId) { // Optional
        //   analytics = getAnalytics(app);
        // }
      } catch (serviceError) {
        console.error("Error initializing Firebase services (auth, db, storage):", serviceError);
        authInstance = undefined;
        dbInstance = undefined;
        storageInstance = undefined;
      }
    } else {
      // If app itself is undefined, ensure services are also undefined.
      authInstance = undefined;
      dbInstance = undefined;
      storageInstance = undefined;
    }

  } else {
    console.warn("Firebase was not initialized due to missing environment variables (firebaseClient.ts). Some app features may not work.");
    // Ensure services are undefined if env vars are missing
    authInstance = undefined;
    dbInstance = undefined;
    storageInstance = undefined;
  }
} else {
    // This console.warn might appear during server-side rendering or build, which is expected.
    // console.warn("Firebase client-side code (firebaseClient.ts) is attempting to run on the server. Initialization skipped.");
}

// Export the potentially undefined instances using their intended names
export { app, authInstance as auth, dbInstance as db, storageInstance as storage };
// export { app, authInstance as auth, dbInstance as db, storageInstance as storage, analytics }; // Optional
    