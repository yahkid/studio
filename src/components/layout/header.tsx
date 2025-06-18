
"use client";

import Link from "next/link";
import Image from "next/image";
import { User, LogIn, LogOut, Loader2, Languages } from "lucide-react";
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
    router.refresh(); 
    setIsSigningOut(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background dark:bg-neutral-dark dark:border-neutral-medium">
      <div className="container flex items-center justify-between py-4 md:py-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/hscm-logo.png" 
            alt="Holy Spirit Connect Ministry Logo"
            width={40} 
            height={40}
            className="h-10 w-10 md:h-12 md:w-12" 
            priority
          />
          <span className="font-headline font-bold text-xl sm:text-2xl text-primary whitespace-nowrap">
            HOLY SPIRIT CONNECT
          </span>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          <Button asChild
            variant="outline"
            size="sm"
            className="font-body font-semibold py-2 px-2 sm:px-3 border-primary text-primary rounded-md transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground dark:border-primary dark:text-primary dark:hover:bg-primary/80 dark:hover:text-primary-foreground text-xs sm:text-sm"
          >
            <Link href="/decision">Nimeamua Leo</Link>
          </Button>
          
          {isSigningOut ? (
            <Button variant="ghost" size="icon" disabled className="rounded-full">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </Button>
          ) : session?.user ? (
            <>
              <span className="font-body text-xs sm:text-sm text-muted-foreground hidden md:inline">
                {session.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="font-body text-xs sm:text-sm"
                aria-label="Logout"
                disabled={isSigningOut}
              >
                {isSigningOut ? <Loader2 className="mr-0 sm:mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-0 sm:mr-2 h-4 w-4" />}
                <span className="hidden sm:inline">{isSigningOut ? 'Inatoka...' : 'Toka'}</span>
                 <span className="sm:hidden">Toka</span>
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" className="font-body text-xs sm:text-sm" size="sm">
              <Link href="/auth">
                <LogIn className="mr-2 h-4 w-4" /> Ingia
              </Link>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-xs sm:text-sm" 
            title="Badilisha Lugha (Switch Language)"
            suppressHydrationWarning={true}
          >
            <Languages className="h-5 w-5" />
            <span className="ml-1 hidden sm:inline">SW/EN</span>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
