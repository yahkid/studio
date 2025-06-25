// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

// Your web app's Firebase configuration using environment variables
const allFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Define keys that are absolutely required for initialization
const requiredConfigKeys: (keyof typeof allFirebaseConfig)[] = [
  'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'
];

// Check if all required keys are present and have a value
const missingKeys = requiredConfigKeys.filter(key => !allFirebaseConfig[key]);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let analytics: Analytics | undefined;

if (missingKeys.length > 0) {
  console.warn(
    `Firebase initialization skipped due to missing environment variables: ${missingKeys.join(', ')}. ` +
    "Please ensure all NEXT_PUBLIC_FIREBASE_* variables are set in your environment."
  );
} else {
  // Filter out any keys that are undefined or null to create a clean config.
  // This prevents the SDK from receiving invalid arguments.
  const cleanConfig = Object.fromEntries(
    Object.entries(allFirebaseConfig).filter(([_, v]) => v != null && v !== '')
  );

  // Initialize Firebase
  if (getApps().length === 0) {
    try {
      app = initializeApp(cleanConfig);
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  } else {
    app = getApps()[0];
  }

  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Connect to emulators if running locally
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log("Development environment detected. Connecting to Firebase Emulators.");
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
    }

    // Initialize Analytics only on the client-side if measurementId exists
    if (typeof window !== 'undefined' && cleanConfig.measurementId) {
      isAnalyticsSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app as FirebaseApp);
        }
      });
    }
  }
}

export { app, auth, db, storage, analytics };
