
"use client"

import { useState } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { User, Mail, MessageSquare, CalendarCheck, Loader2 } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';

interface VisitPlannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisitPlannerModal({ open, onOpenChange }: VisitPlannerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient<Database>();

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
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
    if (!name || !email) {
      toast({
        title: "Taarifa Hazijakamilika",
        description: "Tafadhali jaza jina lako na barua pepe.",
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
        .from('visit_requests')
        .insert({ name, email, message: message || null });

      if (error) throw error;

      toast({
        title: "Tutawasiliana Nawe!",
        description: "Asante kwa kupanga ujio wako. Tutawasiliana nawe hivi karibuni.",
      });
      onOpenChange(false); 
      resetForm(); 
    } catch (caughtError: any) {
      const defaultMessage = "Imeshindwa kuwasilisha ombi lako. Tafadhali jaribu tena.";
      let description = defaultMessage;
      
      console.error('--- Supabase Insert Error Details (VisitPlannerModal) ---');
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
      console.error('--- End Supabase Error Details (VisitPlannerModal) ---');
      
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
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
            <CalendarCheck className="mr-2 h-6 w-6 text-primary"/>
            Panga Ujio Wako
          </DialogTitle>
          <DialogDescription className="font-body">
            Tunafurahi kukukaribisha! Panga ujio wako ili tukupokee vizuri na kukupa maelezo muhimu.
            Ibada zetu ni Jumapili saa 3:00 Asbh na 5:00 Asbh.
            Mahali: 123 Faith St, Ministry City. Tuambie kama una maswali yoyote.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="name-visit" className="font-body">Jina</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name-visit"
                  placeholder="Jina lako kamili"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 font-body"
                  required
                  aria-label="Jina lako"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email-visit" className="font-body">Barua Pepe</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email-visit"
                  type="email"
                  placeholder="barua.pepe@mfano.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-body"
                  required
                  aria-label="Anwani yako ya barua pepe"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="message-visit" className="font-body">Ujumbe (Hiari)</Label>
               <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="message-visit"
                  placeholder="Maswali yoyote au mahitaji maalum?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pl-10 font-body"
                  rows={3}
                  aria-label="Ujumbe wako (hiari)"
                  disabled={isLoading}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">Hatutakutumia barua taka. Faragha yako ni muhimu.</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="font-headline" type="button" disabled={isLoading} suppressHydrationWarning={true}>
                Ghairi
              </Button>
            </DialogClose>
            <Button type="submit" className="font-headline" disabled={isLoading} suppressHydrationWarning={true}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Inatuma...' : 'Tuma Taarifa za Ujio'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
