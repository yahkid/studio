
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Settings, User, Loader2, Save, KeyRound, Lock, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase';
import { auth, storage } from '@/lib/firebaseClient';
import { updateProfile, updatePassword } from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const profileSettingsSchema = z.object({
  displayName: z.string()
    .min(2, { message: "Display name must be at least 2 characters." })
    .max(50, { message: "Display name cannot exceed 50 characters." }),
});

const passwordSettingsSchema = z.object({
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>;
type PasswordSettingsFormValues = z.infer<typeof passwordSettingsSchema>;

export default function SettingsPage() {
  const { user, loading: authLoading, initialLoadingComplete } = useAuthFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isPictureSubmitting, setIsPictureSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  const profileForm = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      displayName: '',
    },
  });

  const passwordForm = useForm<PasswordSettingsFormValues>({
    resolver: zodResolver(passwordSettingsSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user?.displayName) {
      profileForm.reset({ displayName: user.displayName });
    }
    if (user?.photoURL) {
      setPreviewUrl(user.photoURL);
    }
  }, [user, profileForm.reset]);

  const onProfileSubmit = async (values: ProfileSettingsFormValues) => {
    if (!user || !auth.currentUser) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsProfileSubmitting(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: values.displayName,
      });
      toast({
        title: "Profile Updated",
        description: "Your display name has been successfully updated.",
      });
      router.refresh();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update your display name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const onPasswordSubmit = async (values: PasswordSettingsFormValues) => {
    if (!user || !auth.currentUser) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to change your password.",
        variant: "destructive",
      });
      return;
    }

    setIsPasswordSubmitting(true);
    try {
      await updatePassword(auth.currentUser, values.newPassword);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      passwordForm.reset();
    } catch (error: any) {
      console.error("Error updating password:", error);
      let description = "Could not update your password. Please try again.";
      if (error.code === 'auth/requires-recent-login') {
        description = "This operation is sensitive and requires recent authentication. Please log out and log back in to change your password.";
      } else if (error.message) {
        description = error.message;
      }
      toast({
        title: "Password Update Failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(user?.photoURL || null);
    }
  };

  const onProfilePictureSubmit = async () => {
    if (!selectedFile || !user || !auth.currentUser) {
      toast({
        title: "No File Selected or Not Authenticated",
        description: "Please select a picture to upload and ensure you are logged in.",
        variant: "destructive",
      });
      return;
    }

    setIsPictureSubmitting(true);
    try {
      const fileExtension = selectedFile.name.split('.').pop();
      const profilePicRef = storageRef(storage, `profileImages/${user.uid}/profile.${fileExtension}`);
      const snapshot = await uploadBytes(profilePicRef, selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await updateProfile(auth.currentUser, { photoURL: downloadURL });

      toast({
        title: "Profile Picture Updated",
        description: "Your new profile picture has been set.",
      });
      setSelectedFile(null);
      router.refresh(); 

    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      let description = "Could not upload your profile picture. Please try again.";
      if (error.code === 'storage/unauthorized') {
        description = "You are not authorized to upload to this location. Please check Firebase Storage rules.";
      } else if (error.message) {
        description = error.message;
      }
      toast({
        title: "Upload Failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsPictureSubmitting(false);
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
    <div className="container mx-auto py-12 px-4 max-w-2xl space-y-10">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <User className="h-7 w-7 text-primary" />
            <CardTitle className="font-headline text-2xl text-foreground">Profile Information</CardTitle>
          </div>
          <CardDescription className="font-body">
            Update your display name.
          </CardDescription>
        </CardHeader>
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <CardContent>
              <FormField
                control={profileForm.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="displayName" className="font-body">
                      Display Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="displayName"
                        placeholder="Your display name"
                        className="font-body"
                        {...field}
                        disabled={isProfileSubmitting || authLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="font-headline" disabled={isProfileSubmitting || authLoading} suppressHydrationWarning={true}>
                {isProfileSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isProfileSubmitting ? 'Saving...' : 'Save Display Name'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <ImageIcon className="h-7 w-7 text-primary" />
            <CardTitle className="font-headline text-2xl text-foreground">Profile Picture</CardTitle>
          </div>
          <CardDescription className="font-body">
            Upload or change your profile picture. Recommended: Square image, e.g., 200x200 pixels.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile preview"
                width={80}
                height={80}
                className="rounded-full object-cover border"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <Input
              id="profilePicture"
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif"
              onChange={handleFileChange}
              className="font-body max-w-xs"
              disabled={isPictureSubmitting || authLoading}
            />
          </div>
           {selectedFile && <p className="text-xs text-muted-foreground">Selected: {selectedFile.name}</p>}
        </CardContent>
        <CardFooter>
          <Button
            onClick={onProfilePictureSubmit}
            className="font-headline"
            disabled={!selectedFile || isPictureSubmitting || authLoading}
            suppressHydrationWarning={true}
          >
            {isPictureSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isPictureSubmitting ? 'Uploading...' : 'Upload Picture'}
          </Button>
        </CardFooter>
      </Card>

      <Card id="password">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <KeyRound className="h-7 w-7 text-primary" />
            <CardTitle className="font-headline text-2xl text-foreground">Change Password</CardTitle>
          </div>
          <CardDescription className="font-body">
            Choose a new password for your account.
          </CardDescription>
        </CardHeader>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="newPassword" className="font-body flex items-center">
                       <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                       New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        className="font-body"
                        {...field}
                        disabled={isPasswordSubmitting || authLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmPassword" className="font-body flex items-center">
                      <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        className="font-body"
                        {...field}
                        disabled={isPasswordSubmitting || authLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="font-headline" disabled={isPasswordSubmitting || authLoading} suppressHydrationWarning={true}>
                {isPasswordSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
