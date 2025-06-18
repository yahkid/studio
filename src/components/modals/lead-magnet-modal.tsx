
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
    } catch (error: any) {
      toast({
        title: "Hitilafu Imetokea",
        description: error.message || "Imeshindwa kuwasilisha barua pepe yako. Tafadhali jaribu tena.",
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
          <DialogFooter>
            <Button type="submit" className="font-headline w-full" disabled={isLoading} suppressHydrationWarning={true}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Inatuma...' : 'Pata Mwongozo Wako'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
