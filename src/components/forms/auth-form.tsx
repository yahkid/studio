
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, LogIn, UserPlus, Loader2, User, Chrome } from 'lucide-react'; // Using Chrome as a placeholder for Google icon

// Firebase imports
import { auth } from '@/lib/firebaseClient';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type AuthFormValues = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode?: 'login' | 'signup';
  onSwitchMode?: () => void;
  initialMessage?: string | null;
}

export function AuthForm({ mode = 'login', onSwitchMode, initialMessage }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); // For email/password signup
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // For Google Sign-In

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(signupSchema), // Schema is primarily for signup now
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  useEffect(() => {
    // Reset form if mode changes, especially useful if switching from signup back to login
    form.reset({ email: '', password: '', name: '' });
  }, [mode, form.reset]);


  const handleEmailPasswordSignup = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: values.name,
        });
        toast({ title: 'Signup Successful!', description: 'Welcome! Your account has been created.' });
        router.push('/');
      } else {
        throw new Error("User creation failed.");
      }
    } catch (caughtError: any) {
      let description = 'An unexpected error occurred during signup. Please try again.';
      if (caughtError.code) {
        switch (caughtError.code) {
          case 'auth/email-already-in-use':
            description = 'This email address is already in use.';
            break;
          case 'auth/invalid-email':
            description = 'The email address is not valid.';
            break;
          case 'auth/operation-not-allowed':
            description = 'Email/password accounts are not enabled.';
            break;
          case 'auth/weak-password':
            description = 'The password is too weak.';
            break;
          default:
            description = caughtError.message || 'An authentication error occurred during signup.';
        }
      } else if (caughtError.message) {
        description = caughtError.message;
      }
      toast({
        title: 'Error Signing Up',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Login Successful', description: "Welcome!" });
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
          {mode === 'login' ? 'Sign in to continue.' : 'Join us today.'}
        </CardDescription>
      </CardHeader>
      {initialMessage && (
        <div className="px-8 pb-4 text-center text-sm text-green-600 dark:text-green-400">
          {initialMessage === 'check-email' && 'Please check your email to verify your account.'}
        </div>
      )}

      {mode === 'login' ? (
        <CardContent className="p-8 pt-4">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full font-headline"
            disabled={isGoogleLoading}
            suppressHydrationWarning={true}
            variant="outline"
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Chrome className="mr-2 h-4 w-4" />
            )}
            {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </CardContent>
      ) : (
        // Signup form
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmailPasswordSignup)}>
            <CardContent className="space-y-6 p-8 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body">Full Name</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="Your full name" className="pl-10 font-body" {...field} disabled={isLoading} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body">Email Address</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" className="pl-10 font-body" {...field} disabled={isLoading} />
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
                    <FormLabel className="font-body">Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="password" placeholder="••••••••" className="pl-10 font-body" {...field} disabled={isLoading} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button type="submit" className="w-full font-headline" disabled={isLoading} suppressHydrationWarning={true}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Processing...' : 'Create Account'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      )}

      {/* Common Footer for switching modes */}
      {onSwitchMode && (
        <CardFooter className="p-8 pt-2">
          <Button
            variant="link"
            type="button"
            onClick={onSwitchMode}
            className="font-body text-sm w-full" // Added w-full for better centering
            disabled={isLoading || isGoogleLoading}
          >
            {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Login with Google'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
