
"use client";

import Link from "next/link";
import { User, Sparkles, LogIn, LogOut, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, signOut, isLoading } = useAuth();

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
          
          {isLoading ? (
            <Button variant="ghost" size="icon" disabled className="rounded-full">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </Button>
          ) : user ? (
            <>
              <span className="font-body text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="font-body"
                aria-label="Logout"
              >
                <LogOut className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
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
