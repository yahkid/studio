
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient'; // Imports the authInstance as auth

interface AuthContextFirebaseType {
  user: User | null;
  loading: boolean;
  initialLoadingComplete: boolean;
}

const AuthContextFirebase = createContext<AuthContextFirebaseType>({
  user: null,
  loading: true,
  initialLoadingComplete: false,
});

export const AuthContextProviderFirebase: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);

  useEffect(() => {
    if (!auth) { // Check if the auth service is available from firebaseClient
      console.warn(
        "Firebase Auth service is not initialized. Auth context will not function. " +
        "This is likely due to missing Firebase environment variables in your deployment environment (e.g., Vercel)."
      );
      setUser(null);
      setLoading(false);
      setInitialLoadingComplete(true);
      return; // Exit early if auth is not available
    }

    // If auth is available, proceed with onAuthStateChanged
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      setInitialLoadingComplete(true);
    }, (error) => {
      console.error("Firebase Auth state change error:", error);
      setUser(null);
      setLoading(false);
      setInitialLoadingComplete(true);
    });

    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <AuthContextFirebase.Provider value={{ user, loading, initialLoadingComplete }}>
      {children}
    </AuthContextFirebase.Provider>
  );
};

export const useAuthFirebase = (): AuthContextFirebaseType => {
  const context = useContext(AuthContextFirebase);
  if (context === undefined) {
    throw new Error('useAuthFirebase must be used within an AuthContextProviderFirebase');
  }
  return context;
};
