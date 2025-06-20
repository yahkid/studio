
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Settings, User, Loader2, Save } from 'lucide-react';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase';
import { auth } from '@/lib/firebaseClient';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const settingsSchema = z.object({
  displayName: z.string()
    .min(2, { message: "Display name must be at least 2 characters." })
    .max(50, { message: "Display name cannot exceed 50 characters." }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { user, loading: authLoading, initialLoadingComplete } = useAuthFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: '',
    },
  });

  useEffect(() => {
    if (user?.displayName) {
      form.reset({ displayName: user.displayName });
    }
  }, [user, form.reset]);

  const onSubmit = async (values: SettingsFormValues) => {
    if (!user || !auth.currentUser) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: values.displayName,
      });
      toast({
        title: "Profile Updated",
        description: "Your display name has been successfully updated.",
      });
      router.refresh(); // Refresh to reflect changes across the app
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update your display name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialLoadingComplete || authLoading) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-2xl flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-muted-foreground">Please log in to access your account settings.</p>
            <Button onClick={() => router.push('/auth?mode=login')} className="mt-4 font-body">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-3xl text-foreground">Account Settings</CardTitle>
          </div>
          <CardDescription className="font-body">
            Manage your profile information.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="displayName" className="font-body flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      Display Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="displayName"
                        placeholder="Your display name"
                        className="font-body"
                        {...field}
                        disabled={isSubmitting || authLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Placeholder for Change Password - to be implemented next */}
              <div className="pt-4 border-t">
                 <h3 className="font-headline text-xl text-foreground mb-3">Change Password</h3>
                 <p className="font-body text-sm text-muted-foreground">
                    Password change functionality will be added here soon.
                 </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="font-headline" disabled={isSubmitting || authLoading} suppressHydrationWarning={true}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
