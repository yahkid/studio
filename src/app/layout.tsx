
"use client";

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { AuthContextProviderFirebase } from '@/contexts/AuthContextFirebase';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { PodcastPlayerProvider } from '@/contexts/PodcastPlayerContext';
import { SitePlayer } from '@/components/podcast/SitePlayer';
import { Suspense } from 'react';
import { BackToTopButton } from '@/components/ui/back-to-top-button';
import { FloatingWhatsAppButton } from '@/components/ui/floating-whatsapp-button';
import { Montserrat, Lato } from 'next/font/google'; // Import next/font
import { cn } from '@/lib/utils';

// Configure fonts with next/font
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat', // Expose as a CSS variable
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato', // Expose as a CSS variable
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    // Apply font variables to the html tag for global access
    <html lang="sw" suppressHydrationWarning className={cn(lato.variable, montserrat.variable)}>
      <head>
        {/* Direct font links are no longer needed */}
      </head>
      {/* Apply base font via Tailwind utility class */}
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground font-body">
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
        <AuthContextProviderFirebase>
          <PodcastPlayerProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <Toaster />
            </ThemeProvider>
            <SitePlayer />
            <FloatingWhatsAppButton />
            <BackToTopButton />
          </PodcastPlayerProvider>
        </AuthContextProviderFirebase>
      </body>
    </html>
  );
}
