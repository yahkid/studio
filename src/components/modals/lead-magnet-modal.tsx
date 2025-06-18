
"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
// import { GradientButton } from "@/components/ui/gradient-button"; // Removed
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
import { Mail, Download, Loader2 } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';

interface LeadMagnetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadMagnetModal({ open, onOpenChange }: LeadMagnetModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient<Database>();

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
      const { error } = await supabase
        .from('lead_magnet_signups')
        .insert({ email: email });

      if (error) throw error;

      toast({
        title: "Asante!",
        description: "Mwongozo wako wa 'Misingi ya Imani' utatumwa kwa barua pepe yako hivi karibuni.",
      });
      setEmail('');
      onOpenChange(false); 
    } catch (caughtError: any) {
      const defaultMessage = "Imeshindwa kuwasilisha barua pepe yako. Tafadhali jaribu tena.";
      let description = defaultMessage;
      
      console.error('--- Supabase Insert Error Details (LeadMagnetModal) ---');
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
      console.error('--- End Supabase Error Details (LeadMagnetModal) ---');
      
      toast({
        title: "Hitilafu Imetokea",
        description: description,
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
      <DialogContent className="sm:max-w-md rounded-lg"> {/* Removed shadow-xl */}
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
            <Download className="mr-2 h-6 w-6 text-primary" />
            Hatua Zako za Kwanza
          </DialogTitle>
          <DialogDescription className="font-body">
            Ingiza barua pepe yako kupokea mwongozo wetu maalum wa "Misingi ya Imani" (PDF) na uanze safari yako nasi.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="email-lead" className="font-body sr-only">Barua Pepe</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email-lead"
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
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="font-headline" type="button" disabled={isLoading} suppressHydrationWarning={true}>
                Ghairi
              </Button>
            </DialogClose>
            <Button type="submit" className="font-headline" disabled={isLoading} suppressHydrationWarning={true}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Inatuma...' : 'Pata Mwongozo Wako'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
