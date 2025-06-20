
"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, Loader2, Languages, User, Settings as SettingsIcon, MenuSquare, TrendingUp, MicVocal } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

// Firebase imports
import { auth } from '@/lib/firebaseClient';
import { signOut } from 'firebase/auth';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase'; // Firebase Auth Hook

export function Header() {
  const { user, loading: authLoading, initialLoadingComplete } = useAuthFirebase(); // Use Firebase auth context
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home after sign out
      // router.refresh(); // Not strictly necessary with onAuthStateChanged in context
    } catch (error) {
      console.error("Error signing out: ", error);
      // Optionally show a toast message for sign-out error
    } finally {
      setIsSigningOut(false);
    }
  };

  const userDisplayName = user?.displayName || user?.email;

  // Render a loading state or a minimal header if auth state is still loading initially
  if (!initialLoadingComplete && authLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex items-center justify-between py-4 md:py-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Gemini_Generated_Image_asrt4uasrt4uasrt.png"
              alt="Holy Spirit Connect Ministry Logo"
              width={40}
              height={40}
              className="h-10 w-10 md:h-12 md:w-12"
              priority
              style={{ objectFit: 'contain' }}
            />
            <span className="font-headline font-bold text-xl sm:text-2xl text-primary whitespace-nowrap">
              HOLY SPIRIT CONNECT
            </span>
          </Link>
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
             <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex items-center justify-between py-4 md:py-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/Gemini_Generated_Image_asrt4uasrt4uasrt.png"
            alt="Holy Spirit Connect Ministry Logo"
            width={40}
            height={40}
            className="h-10 w-10 md:h-12 md:w-12"
            priority
            style={{ objectFit: 'contain' }}
          />
          <span className="font-headline font-bold text-xl sm:text-2xl text-primary whitespace-nowrap">
            HOLY SPIRIT CONNECT
          </span>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          <Button
            asChild
            className="font-body font-semibold text-xs sm:text-sm py-2 px-2 sm:px-3"
            size="sm"
            suppressHydrationWarning={true}
          >
            <Link href="/decision">Nimeamua Leo</Link>
          </Button>

          {isSigningOut || authLoading ? (
            <Button variant="ghost" size="icon" disabled className="rounded-full">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu" suppressHydrationWarning={true}>
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userDisplayName}</p>
                    {user.displayName && user.email && ( 
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center cursor-pointer">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/podcast" className="flex items-center cursor-pointer">
                    <MicVocal className="mr-2 h-4 w-4" />
                    <span>Podcast</span>
                  </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/context-menu-demo" className="flex items-center cursor-pointer">
                    <MenuSquare className="mr-2 h-4 w-4" />
                    <span>ContextMenu Demo</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/expandable-tabs-demo" className="flex items-center cursor-pointer">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    <span>ExpandableTabs Demo</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut} className="cursor-pointer">
                  {isSigningOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                  <span>{isSigningOut ? 'Inatoka...' : 'Toka'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" className="font-body text-xs sm:text-sm" size="sm" suppressHydrationWarning={true}>
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
            aria-label="Switch language between Swahili and English"
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
