
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
import { Mail, MessageCircleHeart } from 'lucide-react'; // Changed icon to MessageCircleHeart for prayer focus

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(''); // Keep email if prayer request might be emailed, otherwise can be removed
  const { toast } = useToast();
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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If collecting email for prayer:
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Barua Pepe Batili",
        description: "Tafadhali ingiza anwani sahihi ya barua pepe.",
        variant: "destructive",
      });
      return;
    }
    console.log("Exit intent prayer request with email:", email);
    toast({
      title: "Ombi Limepokelewa",
      description: "Tutakuombea. Asante kwa kushiriki nasi.",
    });
    setEmail('');
    setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setShowOnExit(false); 
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
        <form onSubmit={handleSubmit}>
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
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => { setIsOpen(false); setShowOnExit(false);}} className="font-headline">
              Hapana Asante
            </Button>
            <Button type="button" onClick={handleJustPray} className="font-headline bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Niombee Tu
            </Button>
            <Button type="submit" className="font-headline">Tuma Ombi na Barua Pepe</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
