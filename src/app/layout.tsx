
"use client";

import './globals.css';
import './global-styles.css'; 
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabaseClient'; 
import { useState, useEffect } from 'react'; 
import type { Session } from '@supabase/supabase-js';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const [initialSession, setInitialSession] = useState<Session | null | undefined>(undefined); 

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setInitialSession(session);
    };
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setInitialSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);


  return (
    <html lang="sw" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground font-body" style={{ fontFamily: "'Lato', sans-serif" }}>
        <SessionContextProvider
          supabaseClient={supabase}
          initialSession={initialSession === undefined ? null : initialSession} 
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-grow container py-8">{children}</main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </SessionContextProvider>
      </body>
    </html>
  );
}
