
"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Mail, Download, Loader2, FileText } from 'lucide-react';
import { db } from '@/lib/firebaseClient'; // Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Firebase

interface LeadMagnetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadMagnetModal({ open, onOpenChange }: LeadMagnetModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Barua Pepe Batili",
        description: "Tafadhali ingiza anwani sahihi ya barua pepe.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'lead_magnet_signups'), {
        email: email,
        created_at: serverTimestamp()
      });

      toast({
        title: "Asante!",
        description: "Mwongozo wako wa 'Misingi ya Imani' utatumwa kwa barua pepe yako hivi karibuni.",
      });
      setEmail('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error submitting lead magnet to Firestore:', error);
      toast({
        title: "Hitilafu Imetokea",
        description: "Imeshindwa kuwasilisha barua pepe yako. Tafadhali jaribu tena. " + (error.message || ""),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogStateChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEmail('');
      setIsLoading(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogStateChange}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
            <Download className="mr-2 h-6 w-6 text-primary" />
            Hatua Zako za Kwanza
          </DialogTitle>
          <DialogDescription className="font-body">
            Ingiza barua pepe yako kupokea mwongozo wetu maalum wa "Misingi ya Imani" (PDF) na uanze safari yako nasi.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center my-4">
          <FileText className="h-16 w-16 text-primary/20" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 py-2">
            <div className="space-y-1">
              <Label htmlFor="email-lead" className="font-body sr-only">Barua Pepe</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email-lead"
                  ref={emailInputRef}
                  type="email"
                  placeholder="Weka barua pepe yako"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-body"
                  required
                  aria-label="Anwani ya barua pepe kwa mwongozo wa hatua za kwanza"
                  disabled={isLoading}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">Hatutakutumia barua taka. Faragha yako ni muhimu.</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="font-headline" type="button" disabled={isLoading} suppressHydrationWarning={true}>
                Ghairi
              </Button>
            </DialogClose>
            <Button type="submit" className="font-headline" disabled={isLoading} suppressHydrationWarning={true}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Inatuma...' : 'Pakua Mwongozo Bure Sasa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
