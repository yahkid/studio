
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/auth-context';
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
  const { signIn, signUp, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: AuthFormValues) => {
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await signIn(values);
        toast({ title: 'Login Successful', description: "Welcome back!" });
      } else {
        await signUp(values);
        // Message about checking email is handled by redirect in AuthContext
      }
    } catch (error: any) {
      toast({
        title: `Error ${mode === 'login' ? 'Logging In' : 'Signing Up'}`,
        description: error.message || `An unexpected error occurred. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = authLoading || isSubmitting;

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center">
          {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
        </CardTitle>
        <CardDescription className="font-body text-center">
          {mode === 'login' ? 'Sign in to continue.' : 'Join us today.'}
        </CardDescription>
      </CardHeader>
      {initialMessage && (
        <div className="px-6 pb-4 text-center text-sm text-green-600">
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
                      <Input type="email" placeholder="you@example.com" className="pl-10 font-body" {...field} />
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
                      <Input type="password" placeholder="••••••••" className="pl-10 font-body" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full font-headline" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : mode === 'login' ? (
                <LogIn className="mr-2 h-4 w-4" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
            </Button>
            {onSwitchMode && (
              <Button variant="link" type="button" onClick={onSwitchMode} className="font-body text-sm" disabled={loading}>
                {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
