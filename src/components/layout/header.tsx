
"use client";

import Link from "next/link";
import { User, Sparkles, LogIn, LogOut, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh(); // Important to update server components if any
    setIsSigningOut(false);
  };

  // The useSession() hook doesn't provide an explicit loading state.
  // Session being null means no user, non-null means user.
  // We can infer loading if session is initially undefined, but SessionContextProvider aims to resolve this.
  // For simplicity, we'll directly use the session object.

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background dark:bg-neutral-dark dark:border-neutral-medium">
      <div className="container flex items-center justify-between py-6">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="font-headline font-bold text-2xl text-primary">
            HOLY SPIRIT CONNECT
          </span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            href="/decision"
            className="font-body font-semibold py-2 px-4 border border-primary text-primary rounded-md transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground dark:border-primary dark:text-primary dark:hover:bg-primary/80 dark:hover:text-primary-foreground"
          >
            I've Raised My Hand
          </Link>
          
          {isSigningOut ? (
            <Button variant="ghost" size="icon" disabled className="rounded-full">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </Button>
          ) : session?.user ? (
            <>
              <span className="font-body text-sm text-muted-foreground hidden sm:inline">
                {session.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="font-body"
                aria-label="Logout"
                disabled={isSigningOut}
              >
                {isSigningOut ? <Loader2 className="mr-0 sm:mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-0 sm:mr-2 h-4 w-4" />}
                <span className="hidden sm:inline">{isSigningOut ? 'Logging out...' : 'Logout'}</span>
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" className="font-body" size="sm">
              <Link href="/auth">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
