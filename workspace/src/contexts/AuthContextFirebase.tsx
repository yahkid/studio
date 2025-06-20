
'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { FC, ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebaseClient';

interface AuthContextFirebaseType {
  user: User | null;
  loading: boolean;
  initialLoadingComplete: boolean; // Added to match usage in other components
}

const AuthContextFirebase = createContext<AuthContextFirebaseType>({
  user: null,
  loading: true,
  initialLoadingComplete: false,
});

export const AuthContextProviderFirebase: FC<{ children: ReactNode }> = ({ children }) => {
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
      setUser(null); // Ensure user is null on error
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
