
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics } from "firebase/analytics";

let app: FirebaseApp;
let authInstance: Auth;
let dbInstance: Firestore;
let storageInstance: FirebaseStorage;
let analyticsInstance: Analytics;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqcbz2wQiPK6quYe3zUBG8iqovCU1HA08",
  authDomain: "hsc-website-d7569.firebaseapp.com",
  projectId: "hsc-website-d7569",
  storageBucket: "hsc-website-d7569.firebasestorage.app", // Updated as per your snippet
  messagingSenderId: "386290307127",
  appId: "1:386290307127:web:697cd11e19ef5fe409afb2",
  measurementId: "G-4PHE9L3LK1"
};

if (typeof window !== 'undefined') { // Ensure this code runs only on the client-side
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      console.log("Firebase app initialized successfully with hardcoded config (firebaseClient.ts).");
      authInstance = getAuth(app);
      dbInstance = getFirestore(app);
      storageInstance = getStorage(app);
      analyticsInstance = getAnalytics(app);
    } catch (error) {
      console.error("Firebase initialization error with hardcoded config in firebaseClient.ts:", error);
      // In case of error, app and services will be undefined implicitly or explicitly
      // @ts-ignore
      app = undefined;
      // @ts-ignore
      authInstance = undefined;
      // @ts-ignore
      dbInstance = undefined;
      // @ts-ignore
      storageInstance = undefined;
      // @ts-ignore
      analyticsInstance = undefined;
    }
  } else {
    app = getApps()[0];
    console.log("Firebase app already initialized (firebaseClient.ts).");
    // Services should ideally be initialized only once.
    // If re-initializing or getting existing instances, ensure it's handled correctly.
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    storageInstance = getStorage(app);
    analyticsInstance = getAnalytics(app);
  }
} else {
  // This console.warn might appear during server-side rendering or build, which is expected.
  // console.warn("Firebase client-side code (firebaseClient.ts) is attempting to run on the server. Initialization skipped.");
}

// Export the potentially undefined instances using their intended names
export { app, authInstance as auth, dbInstance as db, storageInstance as storage, analyticsInstance as analytics };
