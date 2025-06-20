
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, LogIn, Chrome } from 'lucide-react'; // Chrome used as Google icon

// Firebase imports
import { auth } from '@/lib/firebaseClient';
import {
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

interface AuthFormProps {
  mode?: 'login' | 'signup';
  onSwitchMode?: () => void;
  initialMessage?: string | null;
}

export function AuthForm({ mode = 'login', onSwitchMode, initialMessage }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Authentication Successful', description: "Welcome!" });
      router.push('/');
    } catch (caughtError: any) {
      let description = 'An unexpected error occurred with Google Sign-In. Please try again.';
      if (caughtError.code) {
        switch (caughtError.code) {
          case 'auth/account-exists-with-different-credential':
            description = 'An account already exists with the same email address but different sign-in credentials. Try signing in with the original method.';
            break;
          case 'auth/popup-closed-by-user':
            description = 'Google Sign-In popup was closed before completion.';
            break;
          case 'auth/cancelled-popup-request':
            description = 'Multiple Google Sign-In popups were opened. Please try again.';
            break;
          case 'auth/popup-blocked':
            description = 'Google Sign-In popup was blocked by the browser. Please allow popups for this site.';
            break;
          default:
            description = caughtError.message || 'A Google Sign-In error occurred.';
        }
      } else if (caughtError.message) {
        description = caughtError.message;
      }
      toast({
        title: 'Google Sign-In Error',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="font-headline text-3xl text-center">
          {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
        </CardTitle>
        <CardDescription className="font-body text-center pt-1">
          {mode === 'login' ? 'Sign in with Google to continue.' : 'Sign up with Google to join us.'}
        </CardDescription>
      </CardHeader>
      {initialMessage && (
        <div className="px-8 pb-4 text-center text-sm text-green-600 dark:text-green-400">
          {initialMessage}
        </div>
      )}

      <CardContent className="p-8 pt-4">
        <Button
          onClick={handleGoogleSignIn}
          className="w-full font-headline"
          disabled={isGoogleLoading}
          suppressHydrationWarning={true}
          variant="outline" // Consistent with previous Google button style
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="mr-2 h-4 w-4" /> // Using Chrome as placeholder Google icon
          )}
          {isGoogleLoading ? 'Processing...' : (mode === 'login' ? 'Sign in with Google' : 'Sign up with Google')}
        </Button>
      </CardContent>

      {onSwitchMode && (
        <CardFooter className="p-8 pt-2">
          <Button
            variant="link"
            type="button"
            onClick={onSwitchMode}
            className="font-body text-sm w-full"
            disabled={isGoogleLoading}
          >
            {mode === 'login' ? "Don't have an account? Sign Up with Google" : 'Already have an account? Login with Google'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
