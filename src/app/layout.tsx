
import type {Metadata} from 'next';
import './globals.css';
import './global-styles.css'; // Import the new global styles
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';

export const metadata: Metadata = {
  title: 'HSCM Connect',
  description: 'Connecting with HSCM Ministry',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Updated Google Fonts import */}
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Lato:wght@400;700&family=Montserrat:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      {/* Ensure Lato is the default body font if Tailwind's font-body utility is removed or overridden */}
      <body className="antialiased min-h-screen flex flex-col" style={{ fontFamily: "'Lato', sans-serif" }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            {/* The main container might use Tailwind's container or the new .container class depending on implementation */}
            <main className="flex-grow container py-8">{children}</main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
