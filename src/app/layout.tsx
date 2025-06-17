
"use client";

// import type {Metadata} from 'next'; // Metadata import no longer needed here
import './globals.css';
import './global-styles.css'; // Import the new global styles
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabaseClient'; // Your Supabase client
import { useState, useEffect } from 'react'; // Required for initialSession hack
import type { Session } from '@supabase/supabase-js';

// Metadata cannot be exported from a Client Component.
// Define metadata in individual page.tsx files instead.
// export const metadata: Metadata = {
// title: 'HSCM Connect',
// description: 'Connecting with HSCM Ministry',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Hack to manage initialSession correctly due to Next.js server/client rendering
  // See: https://github.com/supabase/auth-helpers/issues/408
  // And: https://github.com/supabase/auth-helpers/issues/513
  const [initialSession, setInitialSession] = useState<Session | null | undefined>(undefined); // undefined means loading

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


  // Render nothing or a loader while initialSession is undefined
  if (initialSession === undefined && typeof window !== 'undefined') {
     // Or a more sophisticated loading spinner
    return <div className="flex justify-center items-center min-h-screen">Loading authentication...</div>;
  }


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Lato:wght@400;700&family=Montserrat:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col" style={{ fontFamily: "'Lato', sans-serif" }}>
        <SessionContextProvider
          supabaseClient={supabase}
          initialSession={initialSession === undefined ? null : initialSession} // Pass null if still undefined server-side
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
