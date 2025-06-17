
"use client";

import { useState, type FormEvent, type MouseEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: 'Logged in successfully!' });
      // Consider adding redirection or state update here
    } catch (error: any) {
      toast({ title: 'Error logging in', description: error.error_description || error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (event: MouseEvent<HTMLButtonElement>) => {
    // event.preventDefault(); // Not needed for type="button" onClick
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast({ title: 'Signup successful!', description: 'Please check your email for the confirmation link.'});
      // Consider adding redirection or state update here
    } catch (error: any)
      {
      toast({ title: 'Error signing up', description: error.error_description || error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-xl border">
        <div className="text-center">
          <h1 className="text-3xl font-headline text-foreground">HSCM Auth</h1>
          <p className="text-muted-foreground font-body">
            Sign in or create an account
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="auth-email-simple" className="font-body">Email</Label>
            <Input
              id="auth-email-simple"
              className="mt-1"
              type="email"
              placeholder="Your email address"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="auth-password-simple" className="font-body">Password</Label>
            <Input
              id="auth-password-simple"
              className="mt-1"
              type="password"
              placeholder="Your password"
              value={password}
              required={true}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button type="submit" className="w-full font-headline" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Processing...' : 'Log In'}
            </Button>
            <Button
              type="button"
              className="w-full font-headline"
              variant="outline"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Processing...' : 'Sign Up'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
