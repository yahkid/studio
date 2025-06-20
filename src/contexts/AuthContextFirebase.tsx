
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient'; // Assumes firebaseClient.ts is in src/lib/

interface AuthContextFirebaseType {
  user: User | null;
  loading: boolean;
  initialLoadingComplete: boolean; // Added to track if initial auth check is done
}

const AuthContextFirebase = createContext<AuthContextFirebaseType>({
  user: null,
  loading: true,
  initialLoadingComplete: false, // Initialize
});

export const AuthContextProviderFirebase: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);

  useEffect(() => {
    // Check if the auth service is available (it might be undefined if firebaseClient failed to initialize)
    if (!auth) { 
      console.warn(
        "Firebase Auth service is not available in AuthContextFirebase. " +
        "This is likely due to missing Firebase environment variables in your deployment environment or an initialization error in firebaseClient.ts."
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
      setInitialLoadingComplete(true); // Mark initial load as complete
    }, (error) => {
      console.error("Firebase Auth state change error in AuthContextFirebase:", error);
      setUser(null); // Ensure user is null on error
      setLoading(false);
      setInitialLoadingComplete(true); // Still mark as complete even on error
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContextFirebase.Provider value={{ user, loading, initialLoadingComplete }}>
      {children}
    </AuthContextFirebase.Provider>
  );
};

// Exporting as useAuthFirebase for consistency with existing project usage
export const useAuthFirebase = (): AuthContextFirebaseType => {
  const context = useContext(AuthContextFirebase);
  if (context === undefined) {
    throw new Error('useAuthFirebase must be used within an AuthContextProviderFirebase');
  }
  return context;
};
