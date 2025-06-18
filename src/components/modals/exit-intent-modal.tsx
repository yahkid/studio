
"use client"

import { useEffect, useState } from 'react';
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
import { Mail, MessageCircleHeart, Loader2 } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient<Database>();
  const [showOnExit, setShowOnExit] = useState(true);

  useEffect(() => {
    const handleMouseOut = (event: MouseEvent) => {
      if (event.clientY < 10 && showOnExit) {
        const exitIntentShown = sessionStorage.getItem('exitIntentPrayerShown');
        if (!exitIntentShown) {
          setIsOpen(true);
          sessionStorage.setItem('exitIntentPrayerShown', 'true');
          setShowOnExit(false);
        }
      }
    };

    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      document.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      if (typeof window !== 'undefined' && window.innerWidth > 768) {
        document.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, [showOnExit]);

  const handleSubmitPrayerWithEmail = async (e: React.FormEvent) => {
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
        .from('exit_intent_offers')
        .insert({ email: email });

      if (error) throw error;

      toast({
        title: "Ombi Limepokelewa",
        description: "Tutakuombea. Asante kwa kushiriki nasi.",
      });
      setEmail('');
      setIsOpen(false);
      setShowOnExit(false);
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

  const handleJustPray = () => {
    console.log("Exit intent prayer requested (no email).");
    toast({
      title: "Ombi Limepokelewa",
      description: "Tutakuombea. Asante kwa kushiriki nasi.",
    });
    setIsOpen(false);
    setShowOnExit(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(openStatus) => {
      setIsOpen(openStatus);
      if (!openStatus) setShowOnExit(false);
    }}>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
            <MessageCircleHeart className="mr-2 h-6 w-6 text-primary" />
            Kabla Hujaondoka...
          </DialogTitle>
          <DialogDescription className="font-body">
            Ungependa tukuombee? Tungependa kukuombea wewe na mahitaji yako.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitPrayerWithEmail}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="email-exit-prayer" className="font-body">Barua Pepe (Hiari, kwa mawasiliano zaidi)</Label>
               <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email-exit-prayer"
                  type="email"
                  placeholder="barua.pepe@mfano.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-body"
                  aria-label="Barua pepe kwa ombi la maombi (hiari)"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => { setIsOpen(false); setShowOnExit(false);}}
              className="font-headline"
              disabled={isLoading}
              type="button"
              suppressHydrationWarning={true}
            >
              Hapana Asante
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleJustPray}
              className="font-headline text-secondary border-secondary hover:bg-secondary hover:text-secondary-foreground focus-visible:ring-secondary"
              disabled={isLoading}
              suppressHydrationWarning={true}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Niombee Tu
            </Button>
            <Button type="submit" className="font-headline" disabled={isLoading} suppressHydrationWarning={true}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Inatuma...' : 'Tuma Ombi na Barua Pepe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
