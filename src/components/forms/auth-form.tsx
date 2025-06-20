
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, LogIn, UserPlus, Loader2, User, Chrome } from 'lucide-react';

// Firebase imports
import { auth } from '@/lib/firebaseClient'; 
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  // createUserWithEmailAndPassword, // Not used if signup is Google-only
  // updateProfile, // Not used if signup is Google-only
} from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

// Signup schema is not strictly needed if signup is Google-only, but define for AuthFormValues type
const signupSchema = z.object({
  name: z.string().optional(), // Optional as it's not used in Google-only signup form
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});


type AuthFormValues = z.infer<typeof loginSchema>; // For login
// For a combined form, you might use: z.infer<typeof loginSchema> | z.infer<typeof signupSchema_if_email_password_enabled>

interface AuthFormProps {
  mode?: 'login' | 'signup';
  onSwitchMode?: () => void;
  initialMessage?: string | null;
}

export function AuthForm({ mode = 'login', onSwitchMode, initialMessage }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(loginSchema), // Use loginSchema for login mode
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    form.reset({ email: '', password: '' });
  }, [mode, form.reset]);


  const handleEmailPasswordLogin = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      if (!auth) {
        toast({ title: 'Firebase Error', description: 'Firebase is not initialized.', variant: 'destructive'});
        setIsLoading(false);
        return;
      }
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: 'Login Successful', description: "Welcome back!" });
      router.push('/');
    } catch (caughtError: any) {
      let description = 'An unexpected error occurred. Please try again.';
      if (caughtError.code) {
        switch (caughtError.code) {
          case 'auth/user-disabled': description = 'This user account has been disabled.'; break;
          case 'auth/user-not-found': description = 'No user found with this email.'; break;
          case 'auth/wrong-password': description = 'Incorrect password.'; break;
          case 'auth/invalid-credential': description = 'Invalid credentials. Please check your email and password.'; break;
          default: description = caughtError.message || 'An authentication error occurred.';
        }
      } else if (caughtError.message) {
        description = caughtError.message;
      }
      toast({ title: 'Error Logging In', description, variant: 'destructive' });
      console.error("Email/Password Login Error:", caughtError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      toast({ title: 'Firebase Error', description: 'Firebase is not initialized.', variant: 'destructive'});
      return;
    }
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Authentication Successful', description: `Welcome! You've been ${mode === 'login' ? 'logged in' : 'signed up'}.` });
      router.push('/');
    } catch (caughtError: any) {
      let description = 'An unexpected error occurred with Google Sign-In. Please try again.';
      // Firebase specific error handling for Google Sign-In
      if (caughtError.code) {
        switch (caughtError.code) {
          case 'auth/account-exists-with-different-credential': description = 'An account already exists with the same email address but different sign-in credentials. Try signing in with the original method.'; break;
          case 'auth/popup-closed-by-user': description = 'Google Sign-In popup was closed before completion.'; break;
          case 'auth/cancelled-popup-request': description = 'Multiple Google Sign-In popups were opened. Please try again.'; break;
          case 'auth/popup-blocked': description = 'Google Sign-In popup was blocked by the browser. Please allow popups for this site.'; break;
          case 'auth/unauthorized-domain': description = 'This domain is not authorized for Firebase Authentication. Please check your Firebase project settings.'; break;
          default: description = caughtError.message || 'A Google Sign-In error occurred.';
        }
      } else if (caughtError.message) {
        description = caughtError.message;
      }
      toast({ title: 'Google Sign-In Error', description, variant: 'destructive' });
      console.error("Google Sign-In Error:", caughtError);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="font-headline text-3xl text-center">
          {mode === 'login' ? 'Karibu Tena!' : 'Fungua Akaunti'}
        </CardTitle>
        <CardDescription className="font-body text-center pt-1">
          {mode === 'login' ? 'Ingia kwa kutumia barua pepe yako au Google.' : 'Jisajili na Google ili ujiunge nasi.'}
        </CardDescription>
      </CardHeader>
      {initialMessage && (
        <div className="px-8 pb-4 text-center text-sm text-green-600 dark:text-green-400">
          {initialMessage}
        </div>
      )}

      <CardContent className="p-8 pt-4">
        {mode === 'login' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailPasswordLogin)} className="space-y-6 mb-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body">Anwani ya Barua Pepe</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="email" placeholder="barua.pepe@mfano.com" className="pl-10 font-body" {...field} disabled={isLoading || isGoogleLoading} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body">Nenosiri</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="password" placeholder="••••••••" className="pl-10 font-body" {...field} disabled={isLoading || isGoogleLoading} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-headline" disabled={isLoading || isGoogleLoading} suppressHydrationWarning={true}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                {isLoading ? 'Inasubiri...' : 'Ingia'}
              </Button>
            </form>
          </Form>
        )}

        {mode === 'login' && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Au ingia na
              </span>
            </div>
          </div>
        )}

        <Button
          onClick={handleGoogleSignIn}
          className="w-full font-headline"
          disabled={isGoogleLoading || isLoading}
          suppressHydrationWarning={true}
          variant={mode === 'login' ? "outline" : "default"}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="mr-2 h-4 w-4" />
          )}
          {isGoogleLoading ? 'Inasubiri...' : (mode === 'login' ? 'Ingia na Google' : 'Jisajili na Google')}
        </Button>
      </CardContent>

      {onSwitchMode && (
        <CardFooter className="p-8 pt-2">
          <Button
            variant="link"
            type="button"
            onClick={onSwitchMode}
            className="font-body text-sm w-full"
            disabled={isLoading || isGoogleLoading}
          >
            {mode === 'login' ? "Huna akaunti? Jisajili na Google" : 'Una akaunti tayari? Ingia na Barua Pepe au Google'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

    