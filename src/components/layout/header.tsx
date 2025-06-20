
"use client";

import Link from "next/link";
import Image from "next/image"; // Next.js Image for logo
import { LogIn, LogOut, Loader2, Languages, User, Settings as SettingsIcon, MenuSquare, TrendingUp, MicVocal } from "lucide-react"; // Removed ChevronRight as it's not used
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

// Firebase imports
import { auth } from '@/lib/firebaseClient';
import { signOut } from 'firebase/auth';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase'; // Firebase Auth Hook

export function Header() {
  const { user, loading: authLoading, initialLoadingComplete } = useAuthFirebase();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [clientUser, setClientUser] = useState(user);

  const [currentLanguage, setCurrentLanguage] = useState<'sw' | 'en'>('sw');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem('hscm-connect-language') as 'sw' | 'en' | null;
    if (storedLang) {
      setCurrentLanguage(storedLang);
    }
  }, []);

  useEffect(() => {
    setClientUser(user);
  }, [user]);

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'sw' ? 'en' : 'sw';
    setCurrentLanguage(newLang);
    if (mounted) {
      localStorage.setItem('hscm-connect-language', newLang);
    }
    // Note: Full i18n would involve more here, like changing document.documentElement.lang
    // and re-rendering content. For now, this is a visual toggle.
  };

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
          ) : clientUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu" suppressHydrationWarning={true}>
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
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <MenuSquare className="mr-2 h-4 w-4" />
                    <span>Demos</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem asChild>
                        <Link href="/context-menu-demo" className="flex items-center cursor-pointer">
                           ContextMenu Demo
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/expandable-tabs-demo" className="flex items-center cursor-pointer">
                           ExpandableTabs Demo
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
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
            title={mounted ? (currentLanguage === 'sw' ? "Switch to English" : "Badilisha kwenda Kiswahili") : "Switch Language"}
            aria-label={mounted ? (currentLanguage === 'sw' ? "Switch to English" : "Badilisha kwenda Kiswahili") : "Switch Language"}
            onClick={toggleLanguage}
            suppressHydrationWarning={true}
          >
            <Languages className="h-5 w-5" />
            {mounted && (
              <span className="ml-1 hidden sm:inline">
                {currentLanguage.toUpperCase()}
              </span>
            )}
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
