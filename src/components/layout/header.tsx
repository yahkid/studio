
"use client";

import Link from "next/link";
import Image from "next/image"; // Next.js Image for logo
import { LogIn, LogOut, Loader2, User, Settings as SettingsIcon, MicVocal, ShieldCheck } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

// Firebase imports
import { auth } from '@/lib/firebaseClient';
import { signOut } from 'firebase/auth';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase'; // Firebase Auth Hook

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

export function Header() {
  const { user, loading: authLoading, initialLoadingComplete } = useAuthFirebase();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [clientUser, setClientUser] = useState(user);

  useEffect(() => {
    setClientUser(user);
  }, [user]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
      setClientUser(null);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const userDisplayName = clientUser?.displayName || clientUser?.email;
  const userPhotoURL = clientUser?.photoURL;
  const isAdmin = clientUser?.uid === ADMIN_UID;

  const getInitials = (name?: string | null) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 0 || nameParts[0] === '') return '';
    if (nameParts.length === 1 && nameParts[0].length > 0) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return nameParts
      .map((part) => (part.length > 0 ? part[0] : ''))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };


  const HeaderSkeleton = () => (
     <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4 md:py-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/hscm-logo.png"
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

  if (!initialLoadingComplete && authLoading) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex items-center justify-between py-4 md:py-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/hscm-logo.png"
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
          {isSigningOut || authLoading ? (
            <Button variant="ghost" size="icon" disabled className="rounded-full">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </Button>
          ) : clientUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-accent" aria-label="User menu" suppressHydrationWarning={true}>
                   <Avatar className="h-8 w-8">
                    {userPhotoURL && <AvatarImage src={userPhotoURL} alt={userDisplayName || 'User Avatar'} />}
                    <AvatarFallback>{userDisplayName ? getInitials(userDisplayName) : <User className="h-4 w-4" />}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userDisplayName}</p>
                    {clientUser.displayName && clientUser.email && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {clientUser.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/review-testimonies" className="flex items-center cursor-pointer font-semibold text-primary">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
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
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/podcast" className="flex items-center cursor-pointer">
                    <MicVocal className="mr-2 h-4 w-4" />
                    <span>Podcast</span>
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
              <Link href="/auth?mode=login">
                <LogIn className="mr-2 h-4 w-4" /> Ingia
              </Link>
            </Button>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
