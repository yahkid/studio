
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Sparkles, Loader2, CheckSquare } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';

interface PrayerPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrayerPartnerModal({ open, onOpenChange }: PrayerPartnerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [committedToPray, setCommittedToPray] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient<Database>();

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
        .from('prayer_partner_signups')
        .insert({ name, email, committed_to_pray: committedToPray });

      if (error) throw error;

      toast({
        title: "Asante kwa Kujiunga!",
        description: "Umefanikiwa kujiunga na timu ya maombi. Tutawasiliana nawe na maelezo zaidi.",
      });
      setName('');
      setEmail('');
      setCommittedToPray(false);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Hitilafu Imetokea",
        description: error.message || "Imeshindwa kuwasilisha ombi lako. Tafadhali jaribu tena.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <div className="space-y-1">
              <Label htmlFor="name-prayer" className="font-body">Jina Kamili</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name-prayer"
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
                  aria-label="Anwani yako ya barua pepe"
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
          <DialogFooter>
            <Button type="submit" className="font-headline w-full" disabled={isLoading} suppressHydrationWarning={true}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Inatuma...' : 'Jiunge Sasa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
