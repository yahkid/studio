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
import { Mail } from 'lucide-react';

interface LeadMagnetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadMagnetModal({ open, onOpenChange }: LeadMagnetModalProps) {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    console.log("Lead magnet email submitted:", email);
    toast({
      title: "Thank You!",
      description: "Your 'First Steps' guide will be sent to your email shortly.",
    });
    setEmail('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Your First Steps</DialogTitle>
          <DialogDescription className="font-body">
            Enter your email to receive our exclusive 'First Steps' guide and start your journey with us.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email-lead" className="text-right font-body">
                Email
              </Label>
              <div className="col-span-3 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email-lead"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-body"
                  required
                  aria-label="Email address for first steps guide"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="font-headline">Get Your Guide</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
