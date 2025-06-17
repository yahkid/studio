
"use client";

import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';
import type { AuthFormSchema } from '@/components/forms/auth-form'; // Assuming schema is defined here

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (values: z.infer<typeof AuthFormSchema>) => Promise<void>;
  signUp: (values: z.infer<typeof AuthFormSchema>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (values: z.infer<typeof AuthFormSchema>) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      throw error;
    }
    router.push('/'); // Redirect to home after login
    router.refresh(); // Refresh to update server components if any
    setIsLoading(false);
  };

  const signUp = async (values: z.infer<typeof AuthFormSchema>) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });
    if (error) {
      throw error;
    }
    // Supabase sends a confirmation email by default.
    // You might want to show a message to the user to check their email.
    router.push('/auth?message=check-email'); // Redirect to auth page with a message
    router.refresh();
    setIsLoading(false);
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.push('/'); // Redirect to home after logout
    router.refresh();
    setIsLoading(false);
  };

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
