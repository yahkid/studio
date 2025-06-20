
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, LogIn, UserPlus, Loader2, User, Chrome, X } from 'lucide-react';

// Firebase imports
import { auth } from '@/lib/firebaseClient'; 
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  // sendEmailVerification // Uncomment if you want to implement email verification
} from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});


type AuthFormValues = z.infer<typeof loginSchema> & z.infer<typeof signupSchema>;

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

  const currentSchema = mode === 'signup' ? signupSchema : loginSchema;

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  useEffect(() => {
    form.reset({ email: '', password: '', name: '' });
  }, [mode, form.reset]);


  const handleEmailPasswordAuth = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      if (!auth) {
        toast({ title: 'Firebase Error', description: 'Firebase is not initialized. Please check console for details.', variant: 'destructive'});
        setIsLoading(false);
        return;
      }
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: 'Login Successful', description: "Welcome back!" });
        router.push('/');
      } else { // signup mode
        if (!values.name) { 
          toast({ title: 'Signup Error', description: 'Name is required for signup.', variant: 'destructive'});
          setIsLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: values.name });
          toast({ title: 'Signup Successful!', description: 'Welcome! Your account has been created.'});
           router.push('/');
        } else {
          throw new Error("User creation failed via email/password.");
        }
      }
    } catch (caughtError: any) {
      let description = 'An unexpected error occurred. Please try again.';
      if (caughtError.code) {
        switch (caughtError.code) {
          case 'auth/user-disabled': description = 'This user account has been disabled.'; break;
          case 'auth/user-not-found': description = 'No user found with this email.'; break;
          case 'auth/wrong-password': description = 'Incorrect password.'; break;
          case 'auth/invalid-credential': description = 'Invalid credentials. Please check your email and password.'; break;
          case 'auth/email-already-in-use': description = 'This email address is already in use.'; break;
          case 'auth/weak-password': description = 'Password is too weak. It must be at least 6 characters.'; break;
          default: description = caughtError.message || 'An authentication error occurred.';
        }
      } else if (caughtError.message) {
        description = caughtError.message;
      }
      toast({ title: `Error ${mode === 'login' ? 'Logging In' : 'Signing Up'}`, description, variant: 'destructive' });
      console.error("Email/Password Auth Error:", caughtError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      if (!auth) {
        toast({ title: 'Firebase Error', description: 'Firebase is not initialized. Please check console for details.', variant: 'destructive'});
        setIsGoogleLoading(false);
        return;
      }
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: 'Authentication Successful', description: `Welcome! You've been ${mode === 'login' ? 'logged in' : 'signed up'}.` });
      router.push('/');
    } catch (caughtError: any) {
      let description = 'An unexpected error occurred with Google Sign-In. Please try again.';
      if (caughtError.code) {
        switch (caughtError.code) {
          case 'auth/account-exists-with-different-credential': description = 'An account already exists with the same email address but different sign-in credentials. Try signing in with the original method.'; break;
          case 'auth/popup-closed-by-user': description = 'Google Sign-In popup was closed before completion.'; break;
          case 'auth/cancelled-popup-request': description = 'Multiple Google Sign-In popups were opened. Please try again.'; break;
          case 'auth/popup-blocked': description = 'Google Sign-In popup was blocked by the browser. Please allow popups for this site.'; break;
          case 'auth/unauthorized-domain': description = 'This domain is not authorized for Firebase Authentication. Please check your Firebase project settings and ensure your current domain is listed.'; break; 
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
    <Card className="w-full max-w-md mx-auto relative">
       <Link href="/" aria-label="Close and return to homepage">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full z-10">
          <X className="h-5 w-5 text-muted-foreground" />
        </Button>
      </Link>
      <CardHeader className="p-6 sm:p-8 pb-4">
        <CardTitle className="font-headline text-3xl text-center">
          {mode === 'login' ? 'Karibu Tena!' : 'Fungua Akaunti'}
        </CardTitle>
        <CardDescription className="font-body text-center pt-1">
          {mode === 'login' ? 'Ingia kwa kutumia barua pepe yako au Google.' : 'Jisajili kwa kutumia Google.'}
        </CardDescription>
      </CardHeader>
      {initialMessage && (
        <div className="px-8 pb-4 text-center text-sm text-green-600 dark:text-green-400">
          {initialMessage}
        </div>
      )}

      <CardContent className="p-6 sm:p-8 pt-4">
        {mode === 'login' && (
          <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEmailPasswordAuth)} className="space-y-6 mb-6">
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
                  {isLoading ? 'Inasubiri...' : 'Ingia na Barua Pepe'}
                </Button>
              </form>
            </Form>
        )}
         {mode === 'signup' && (
             <p className="font-body text-sm text-muted-foreground text-center mb-6">
                Kwa sasa, jisajili kwa kutumia Google kwa uzoefu wa haraka na salama.
             </p>
         )}


          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Au {mode === 'login' ? 'ingia na' : 'jisajili na'}
              </span>
            </div>
          </div>

        <Button
          onClick={handleGoogleSignIn}
          className="w-full font-headline"
          disabled={isGoogleLoading || isLoading}
          suppressHydrationWarning={true}
          variant="outline"
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
        <CardFooter className="p-6 sm:p-8 pt-2">
          <Button
            variant="link"
            type="button"
            onClick={onSwitchMode}
            className="font-body text-sm w-full"
            disabled={isLoading || isGoogleLoading}
          >
            {mode === 'login' ? "Huna akaunti? Jisajili" : 'Una akaunti tayari? Ingia'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
