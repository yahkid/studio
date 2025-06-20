
"use client";

import './globals.css';
import './global-styles.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
// Firebase Auth Provider
// import { AuthContextProviderFirebase } from '@/contexts/AuthContextFirebase'; // Old alias path
import { AuthContextProviderFirebase } from '../contexts/AuthContextFirebase'; // New relative path
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { PodcastPlayerProvider } from '@/contexts/PodcastPlayerContext';
import { SitePlayer } from '@/components/podcast/SitePlayer';
import { Suspense } from 'react';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="sw" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground font-body" style={{ fontFamily: "'Lato', sans-serif" }}>
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
        <AuthContextProviderFirebase> {/* Firebase Auth Provider */}
          <PodcastPlayerProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <main className="flex-grow container py-8 pb-28">{children}</main>
              <Footer />
              <Toaster />
            </ThemeProvider>
            <SitePlayer />
          </PodcastPlayerProvider>
        </AuthContextProviderFirebase>
      </body>
    </html>
  );
}
