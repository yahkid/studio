'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient'; // Assumes firebaseClient.ts is in src/lib/

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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      setInitialLoadingComplete(true);
    }, (error) => {
      console.error("Auth state change error:", error);
      setUser(null);
      setLoading(false);
      setInitialLoadingComplete(true);
    });

    return () => unsubscribe();
  }, []);

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
