
"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Sparkles, Loader2 } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';

interface PrayerPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrayerPartnerModal({ open, onOpenChange }: PrayerPartnerModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [committedToPray, setCommittedToPray] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient<Database>();

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setCommittedToPray(false);
    setIsLoading(false);
  };

  const handleDialogStateChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      toast({
        title: "Taarifa Hazijakamilika",
        description: "Tafadhali jaza jina la kwanza, jina la mwisho, na barua pepe.",
        variant: "destructive",
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
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
        .from('prayer_partner_signups')
        .insert({ 
          first_name: firstName, 
          last_name: lastName, 
          email, 
          committed_to_pray: committedToPray 
        });

      if (error) throw error;

      toast({
        title: "Asante kwa Kujiunga!",
        description: "Umefanikiwa kujiunga na timu ya maombi. Tutawasiliana nawe na maelezo zaidi.",
      });
      onOpenChange(false); 
      resetForm(); 
    } catch (caughtError: any) {
      const defaultMessage = "Imeshindwa kuwasilisha ombi lako. Tafadhali jaribu tena.";
      let description = defaultMessage;
      
      console.error('--- Supabase Insert Error Details (PrayerPartnerModal) ---');
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
      console.error('--- End Supabase Error Details (PrayerPartnerModal) ---');
      
      toast({
        title: "Hitilafu Imetokea",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogStateChange}>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-primary"/>
            Jiunge na Timu ya Maombi
          </DialogTitle>
          <DialogDescription className="font-body">
            Maombi yako ni nguzo muhimu kwa huduma yetu. Jiandikishe kupokea taarifa za maombi na kuwa sehemu ya timu yetu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName-prayer" className="font-body">Jina la Kwanza</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName-prayer"
                    placeholder="Jina lako la kwanza"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 font-body"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName-prayer" className="font-body">Jina la Mwisho</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName-prayer"
                    placeholder="Jina lako la mwisho"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10 font-body"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email-prayer" className="font-body">Barua Pepe</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email-prayer"
                  type="email"
                  placeholder="barua.pepe@mfano.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-body"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="commit-pray"
                checked={committedToPray}
                onCheckedChange={(checked) => setCommittedToPray(Boolean(checked))}
                disabled={isLoading}
                aria-label="Nakubali kuombea HSCM mara kwa mara"
              />
              <Label htmlFor="commit-pray" className="font-body text-sm text-muted-foreground">
                Nakubali kuombea HSCM mara kwa mara.
              </Label>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="font-headline" type="button" disabled={isLoading} suppressHydrationWarning={true}>
                Ghairi
              </Button>
            </DialogClose>
            <GradientButton type="submit" className="font-headline" disabled={isLoading} suppressHydrationWarning={true}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Inatuma...' : 'Jiunge Sasa'}
            </GradientButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
