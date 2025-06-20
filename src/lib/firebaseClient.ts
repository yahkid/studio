
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

// Your web app's Firebase configuration (Hardcoded as per user request)
const firebaseConfig = {
  apiKey: "AIzaSyCqcbz2wQiPK6quYe3zUBG8iqovCU1HA08",
  authDomain: "hsc-website-d7569.firebaseapp.com",
  projectId: "hsc-website-d7569",
  storageBucket: "hsc-website-d7569.firebasestorage.app",
  messagingSenderId: "386290307127",
  appId: "1:386290307127:web:697cd11e19ef5fe409afb2",
  measurementId: "G-4PHE9L3LK1"
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let analytics: Analytics | undefined;

// Initialize Firebase
if (typeof window !== 'undefined') { // Ensure this code runs only on the client-side
  if (!getApps().length) {
    try {
      console.log("Attempting to initialize Firebase with hardcoded config (firebaseClient.ts)...");
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
      console.error("Firebase hardcoded initialization error in firebaseClient.ts:", error);
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
