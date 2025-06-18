
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
// import { GradientButton } from '@/components/ui/gradient-button'; // Removed
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, LogIn, UserPlus, Loader2 } from 'lucide-react';

export const AuthFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type AuthFormValues = z.infer<typeof AuthFormSchema>;

interface AuthFormProps {
  mode?: 'login' | 'signup';
  onSwitchMode?: () => void;
  initialMessage?: string | null;
}

export function AuthForm({ mode = 'login', onSwitchMode, initialMessage }: AuthFormProps) {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
        toast({ title: 'Login Successful', description: "Welcome back!" });
        router.push('/');
        router.refresh();
      } else { // signup mode
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
        if (error) throw error; 
        toast({ title: 'Signup Successful', description: 'Please check your email to verify your account.' });
        router.push('/auth/confirmation-info');
        router.refresh();
      }
    } catch (caughtError: any) {
      const defaultMessage = 'An unexpected error occurred. Please try again.';
      let description = defaultMessage;
      
      console.error(`--- Supabase Auth Error Details (Mode: ${mode}) ---`);
      console.error('Type of caughtError:', typeof caughtError);

      if (caughtError) {
        console.error('Caught Error Object:', caughtError);
        
        if (typeof caughtError.message === 'string' && caughtError.message.trim() !== '') {
          description = caughtError.message;
          console.error('Message property:', caughtError.message);
        } else if (typeof caughtError.error_description === 'string' && caughtError.error_description.trim() !== '') {
          description = caughtError.error_description;
          console.error('Error Description property:', caughtError.error_description);
        } else if (typeof caughtError === 'string') {
          description = caughtError;
        }

        if (caughtError.details) { 
          console.error('Details:', caughtError.details);
        }
        if (caughtError.code) {
          console.error('Code:', caughtError.code);
        }
        if (caughtError.hint) {
            console.error('Hint:', caughtError.hint);
        }
        
        try {
          console.error('Error JSON:', JSON.stringify(caughtError, null, 2));
        } catch (e_stringify) {
          console.error('Could not stringify caughtError:', e_stringify);
        }
      } else {
        console.error('Caught error is undefined or null.');
      }
      console.error(`--- End Supabase Auth Error Details (Mode: ${mode}) ---`);
      
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
    <Card className="w-full max-w-md mx-auto"> {/* Removed shadow-xl */}
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center">
          {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
        </CardTitle>
        <CardDescription className="font-body text-center">
          {mode === 'login' ? 'Sign in to continue.' : 'Join us today.'}
        </CardDescription>
      </CardHeader>
      {initialMessage && (
        <div className="px-6 pb-4 text-center text-sm text-green-600 dark:text-green-400">
          {initialMessage === 'check-email' && 'Please check your email to verify your account.'}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
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
