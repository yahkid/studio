
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
import { useToast } from '@/hooks/use-toast';
import { User, Mail, HandCoins, Loader2, Phone, Globe, CheckCircle } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';

interface FinancialPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinancialPartnerModal({ open, onOpenChange }: FinancialPartnerModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient<Database>();

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setCountry('');
    setIsLoading(false);
  };

  const handleModalClose = () => {
    resetForm();
    setCurrentStep(1); // Reset to step 1 when modal is closed
    onOpenChange(false);
  };

  const handleSubmitStep1 = async (e: React.FormEvent) => {
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
        .from('financial_partner_signups')
        .insert({ 
          first_name: firstName, 
          last_name: lastName, 
          email,
          phone_number: phoneNumber || null,
          country: country || null,
        });

      if (error) throw error;

      toast({
        title: "Hatua ya 1 Imekamilika!",
        description: "Taarifa zako zimepokelewa.",
      });
      setCurrentStep(2); // Move to step 2
      // Do not reset form fields yet, user might want to see them if step 2 was an actual form
    } catch (error: any) {
      toast({
        title: "Hitilafu Imetokea",
        description: error.message || "Imeshindwa kuwasilisha taarifa zako. Tafadhali jaribu tena.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
            <HandCoins className="mr-2 h-6 w-6 text-primary"/>
            {currentStep === 1 ? "Kuwa Mshirika wa Kifedha - Hatua ya 1" : "Asante kwa Nia Yako!"}
          </DialogTitle>
          <DialogDescription className="font-body">
            {currentStep === 1 
              ? "Tafadhali jaza maelezo yako hapa chini ili tuweze kuwasiliana nawe kuhusu ushirika wako."
              : "Tumepokea maelezo yako. Timu yetu itawasiliana nawe hivi karibuni kuhusu njia salama za kukamilisha utoaji wako. Asante kwa kuunga mkono huduma!"}
          </DialogDescription>
        </DialogHeader>
        
        {currentStep === 1 && (
          <form onSubmit={handleSubmitStep1}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName-financial" className="font-body">Jina la Kwanza</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName-financial"
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
                  <Label htmlFor="lastName-financial" className="font-body">Jina la Mwisho</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName-financial"
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
                <Label htmlFor="email-financial" className="font-body">Barua Pepe</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email-financial"
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
              <div className="space-y-1">
                <Label htmlFor="phone-financial" className="font-body">Namba ya Simu (Hiari)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone-financial"
                    type="tel"
                    placeholder="+255 123 456 789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 font-body"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="country-financial" className="font-body">Nchi (Hiari)</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="country-financial"
                    placeholder="Mfano: Tanzania"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="pl-10 font-body"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="font-headline w-full" disabled={isLoading} suppressHydrationWarning={true}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Inatuma...' : 'Endelea kwa Hatua Inayofuata'}
              </Button>
            </DialogFooter>
          </form>
        )}

        {currentStep === 2 && (
          <div className="py-4 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <p className="font-body text-muted-foreground">
              Timu yetu itawasiliana nawe kupitia <strong className="text-foreground">{email}</strong> hivi karibuni kukupa maelezo zaidi.
            </p>
            <DialogFooter className="mt-6">
               <DialogClose asChild>
                <Button onClick={handleModalClose} className="font-headline w-full" suppressHydrationWarning={true}>
                  Funga
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
