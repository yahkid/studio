
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
import { Mail, Lock, LogIn, UserPlus, Loader2, User } from 'lucide-react';

// Firebase imports
import { auth } from '@/lib/firebaseClient'; // Correct path to your firebaseClient
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
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

type AuthFormValues = z.infer<typeof signupSchema>; 

interface AuthFormProps {
  mode?: 'login' | 'signup';
  onSwitchMode?: () => void;
  initialMessage?: string | null;
}

export function AuthForm({ mode = 'login', onSwitchMode, initialMessage }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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


  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: 'Login Successful', description: "Welcome back!" });
        router.push('/'); 
        // router.refresh(); // router.push('/') should trigger a re-render with new auth state
      } else { // signup mode
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: values.name,
          });
          // Optionally send email verification
          // await sendEmailVerification(userCredential.user);
          // toast({ title: 'Signup Successful', description: 'Please check your email to verify your account.' });
          // router.push('/auth/confirmation-info'); // Or a generic email verification info page
          toast({ title: 'Signup Successful!', description: 'Welcome! Your account has been created.'});
          router.push('/');
        } else {
          throw new Error("User creation failed.");
        }
      }
    } catch (caughtError: any) {
      let description = 'An unexpected error occurred. Please try again.';
      if (caughtError.message) {
        description = caughtError.message;
      } else if (caughtError.code) { // Firebase often uses error codes
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
          case 'auth/user-disabled':
            description = 'This user account has been disabled.';
            break;
          case 'auth/user-not-found':
            description = 'No user found with this email.';
            break;
          case 'auth/wrong-password':
            description = 'Incorrect password.';
            break;
          case 'auth/invalid-credential':
             description = 'Invalid credentials. Please check your email and password.';
             break;
          default:
            description = caughtError.message || 'An authentication error occurred.';
        }
      }
      
      console.error(`--- Firebase Auth Error (Mode: ${mode}) ---`);
      console.error('Error Object:', caughtError);
      
      toast({
        title: `Error ${mode === 'login' ? 'Logging In' : 'Signing Up'}`,
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center">
          {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
        </CardTitle>
        <CardDescription className="font-body text-center">
          {mode === 'login' ? 'Sign in to continue.' : 'Join us today.'}
        </CardDescription>
      </CardHeader>
      {initialMessage && ( // This might need adjustment based on Firebase's email verification flow
        <div className="px-6 pb-4 text-center text-sm text-green-600 dark:text-green-400">
          {initialMessage === 'check-email' && 'Please check your email to verify your account.'}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {mode === 'signup' && (
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
            )}
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
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full font-headline" disabled={isLoading} suppressHydrationWarning={true}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : mode === 'login' ? (
                <LogIn className="mr-2 h-4 w-4" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
            </Button>
            {onSwitchMode && (
              <Button variant="link" type="button" onClick={onSwitchMode} className="font-body text-sm" disabled={isLoading}>
                {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
