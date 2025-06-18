
"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, Loader2, Languages, User, Settings as SettingsIcon, MenuSquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
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
            style={{ objectFit: 'contain' }}
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
            suppressHydrationWarning={true}
          >
            <Link href="/decision">Nimeamua Leo</Link>
          </Button>

          {isSigningOut ? (
            <Button variant="ghost" size="icon" disabled className="rounded-full">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </Button>
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu" suppressHydrationWarning={true}>
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Akaunti</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
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
                  <Link href="/context-menu-demo" className="flex items-center cursor-pointer">
                    <MenuSquare className="mr-2 h-4 w-4" />
                    <span>ContextMenu Demo</span>
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
