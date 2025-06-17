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
import { Gift, Mail } from 'lucide-react';

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const [showOnExit, setShowOnExit] = useState(true);

  useEffect(() => {
    const handleMouseOut = (event: MouseEvent) => {
      // Check if mouse is near the top of the viewport
      if (event.clientY < 10 && showOnExit) {
        // Check if it's not already shown in this session via localStorage or a cookie
        const exitIntentShown = sessionStorage.getItem('exitIntentShown');
        if (!exitIntentShown) {
          setIsOpen(true);
          sessionStorage.setItem('exitIntentShown', 'true');
          setShowOnExit(false); // Prevent re-triggering immediately
        }
      }
    };

    // Only attach if not on a mobile device (basic check)
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
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    console.log("Exit intent email submitted:", email);
    toast({
      title: "We'll Miss You!",
      description: "Your special offer will be sent to your email.",
    });
    setEmail('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setShowOnExit(false); // Don't show again if manually closed
    }}>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
            <Gift className="mr-2 h-6 w-6 text-primary" />
            Before You Go...
          </DialogTitle>
          <DialogDescription className="font-body">
            Get a special resource just for sticking around! Enter your email to claim it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="email-exit" className="font-body">Email</Label>
               <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email-exit"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-body"
                  required
                  aria-label="Email address for special offer"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => { setIsOpen(false); setShowOnExit(false);}} className="font-headline">
              No, Thanks
            </Button>
            <Button type="submit" className="font-headline">Claim My Gift</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
