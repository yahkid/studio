"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, FileText, User, MailIcon as MailLucide, Send, Newspaper, MapPin } from 'lucide-react';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase';
import { db, storage } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { UserTestimonyDoc } from '@/types/firestore';
import { WhatsAppIcon } from '../ui/whatsapp-icon';
import { summarizeTestimony } from '@/ai/flows/summarize-testimony-flow';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const testimonyFormSchema = z.object({
  story: z.string().min(50, { message: "Tafadhali shiriki zaidi kidogo katika hadithi yako (angalau herufi 50)." }),
  location: z.string().optional(),
  consentToShare: z.boolean().refine(value => value === true, {
    message: "Lazima ukubali kushiriki ushuhuda wako.",
  }),
  newsletterOptIn: z.boolean().optional(),
});

type TestimonyFormValues = z.infer<typeof testimonyFormSchema>;

interface TestimonyFormProps {
  onFormSubmit?: () => void;
}

export function TestimonyForm({ onFormSubmit }: TestimonyFormProps) {
  const { user, loading: authLoading, initialLoadingComplete } = useAuthFirebase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<TestimonyFormValues>({
    resolver: zodResolver(testimonyFormSchema),
    defaultValues: {
      story: '',
      location: '',
      consentToShare: false,
      newsletterOptIn: false,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(null);

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`Faili ni kubwa mno. Ukubwa wa juu ni ${MAX_FILE_SIZE_MB}MB.`);
        setSelectedFile(null);
        event.target.value = "";
        return;
      }
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setFileError("Aina ya faili si sahihi. Inakubalika: JPG, PNG, WEBP.");
        setSelectedFile(null);
        event.target.value = "";
        return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleWhatsAppSubmit = () => {
    const { story, consentToShare } = form.getValues();
    if (!story) {
        toast({ title: "Ushuhuda haujakamilika", description: "Tafadhali andika hadithi yako kabla ya kutuma.", variant: "destructive" });
        return;
    }
     if (consentToShare !== true) {
      toast({
        title: "Idhini Inahitajika",
        description: "Lazima ukubali kushiriki ushuhuda wako ili kuwasilisha.",
        variant: "destructive",
      });
      return;
    }

    const ministryPhone = "255652796450";
    const messageText = `*Ushuhuda Mpya kutoka kwa ${user?.displayName || user?.email || 'Mtumiaji'}:*

${story}

---
*(Kumbuka: Faili zozote zilizopakiwa hazikutumwa kupitia WhatsApp. Zimewasilishwa tu kupitia fomu ya tovuti.)*
`;
    const whatsappUrl = `https://wa.me/${ministryPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const onSubmit = async (values: TestimonyFormValues) => {
    if (!initialLoadingComplete) {
        toast({ title: "Tafadhali subiri", description: "Inapakia uthibitishaji...", variant: "default"});
        return;
    }
    if (!user) {
      toast({
        title: "Unahitaji Kuingia Kwanza",
        description: "Tafadhali ingia au jisajili ili kuwasilisha ushuhuda wako.",
        variant: "destructive",
      });
      return;
    }
    if (fileError) {
        toast({ title: "Hitilafu ya Faili", description: fileError, variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    let fileUrl: string | null = null;
    let originalFileName: string | null = null;

    try {
      if (selectedFile) {
        const uniqueFileName = `${user.uid}-${Date.now()}_${selectedFile.name}`;
        const fileUploadRef = storageRef(storage, `user_testimonies_uploads/${uniqueFileName}`);
        const uploadResult = await uploadBytes(fileUploadRef, selectedFile);
        fileUrl = await getDownloadURL(uploadResult.ref);
        originalFileName = selectedFile.name;
      }

      const testimonyData: Omit<UserTestimonyDoc, 'id' | 'aiSuggestedQuote' | 'aiSummary'> = {
        userId: user.uid,
        userName: user.displayName || 'Mtumiaji Asiyejulikana',
        userEmail: user.email || 'Barua pepe haipo',
        story: values.story,
        location: values.location || null,
        fileUrl: fileUrl,
        originalFileName: originalFileName,
        submittedAt: serverTimestamp() as any,
        status: "pending_review",
        consentToShare: values.consentToShare,
      };

      const docRef = await addDoc(collection(db, 'user_testimonies'), testimonyData);

      toast({
        title: "Ushuhuda Umewasilishwa!",
        description: "Asante kwa kushiriki hadithi yako. Timu yetu itaipitia.",
      });

      // Don't block UI on AI summarization
      summarizeTestimony({ story: values.story })
        .then(aiResult => {
          updateDoc(doc(db, 'user_testimonies', docRef.id), {
            aiSuggestedQuote: aiResult.suggestedQuote,
            aiSummary: aiResult.summary,
          });
        })
        .catch(aiError => {
          console.error("AI Summarization Error:", aiError);
        });

      form.reset();
      setSelectedFile(null);
      const fileInput = document.getElementById('testimony-file') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      onFormSubmit?.();
    } catch (error: any) {
      console.error("Error submitting testimony:", error);
      toast({
        title: "Hitilafu ya Kuwasilisha",
        description: error.message || "Imeshindwa kuwasilisha ushuhuda wako. Jaribu tena.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !initialLoadingComplete) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 font-body">Inapakia fomu...</p>
      </div>
    );
  }

  if (!user && initialLoadingComplete) {
     return (
      <div className="py-8 text-center font-body">
        <p className="mb-4 text-muted-foreground">Tafadhali <a href="/auth?mode=login" className="text-primary hover:underline">ingia</a> au <a href="/auth?mode=signup" className="text-primary hover:underline">jisajili</a> ili kushiriki ushuhuda wako.</p>
      </div>
    );
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        {user && (
          <div className="space-y-3 rounded-md border bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">{user.displayName || "Mtumiaji"}</p>
            </div>
            <div className="flex items-center gap-2">
              <MailLucide className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="story"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="story" className="font-body">Hadithi Yako ya Ushuhuda</FormLabel>
              <FormControl>
                <Textarea
                  id="story"
                  placeholder="Andika ushuhuda wako hapa..."
                  className="min-h-[150px] font-body"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="location" className="font-body">Mahali Ulipo (Hiari)</FormLabel>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input
                    id="location"
                    placeholder="Mfano: Mwanza, Tanzania"
                    className="pl-10 font-body"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel htmlFor="testimony-file" className="font-body">Weka Picha (Hiari)</FormLabel>
          <div className="relative">
             <UploadCloud className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <FormControl>
              <Input
                id="testimony-file"
                type="file"
                className="pl-10 font-body file:mr-2 file:text-xs file:font-medium file:text-primary file:border-0 file:bg-transparent hover:file:cursor-pointer"
                onChange={handleFileChange}
                accept={ACCEPTED_FILE_TYPES.join(',')}
                disabled={isSubmitting}
              />
            </FormControl>
          </div>
          {selectedFile && !fileError && (
            <p className="mt-1 text-xs text-muted-foreground flex items-center">
              <FileText className="mr-1.5 h-3 w-3 text-green-600" />
              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          {fileError && <p className="mt-1 text-xs text-destructive">{fileError}</p>}
          <p className="text-xs text-muted-foreground mt-1">Ukubwa wa juu: {MAX_FILE_SIZE_MB}MB. Aina zinazokubalika: JPG, PNG, WEBP.</p>
        </FormItem>

        <FormField
          control={form.control}
          name="consentToShare"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background dark:bg-muted/20">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                  id="consentToShare"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="consentToShare" className="font-body text-sm text-muted-foreground cursor-pointer">
                  Ninakubali kwamba ushuhuda wangu unaweza kushirikiwa hadharani kwenye majukwaa ya HSCM Connect. (Tutakuomba ridhaa zaidi ikihitajika kabla ya kuchapisha.)
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="w-full font-headline" disabled={isSubmitting || !user || authLoading}>
                {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Send className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? 'Inawasilisha...' : 'Wasilisha Ushuhuda'}
            </Button>
            <Button type="button" variant="outline" className="w-full font-headline text-green-600 border-green-600 hover:bg-green-600 hover:text-white" onClick={handleWhatsAppSubmit} disabled={isSubmitting}>
                <WhatsAppIcon className="mr-2" />
                Tuma kwa WhatsApp
            </Button>
        </div>
      </form>
    </Form>
  );
}
