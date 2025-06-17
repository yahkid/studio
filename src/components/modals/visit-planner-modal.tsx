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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { User, Mail, MessageSquare } from 'lucide-react';

interface VisitPlannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisitPlannerModal({ open, onOpenChange }: VisitPlannerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    console.log("Visit planner form submitted:", { name, email, message });
    toast({
      title: "We'll Be In Touch!",
      description: "Thank you for planning your visit. We'll contact you soon.",
    });
    setName('');
    setEmail('');
    setMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Plan Your Visit</DialogTitle>
          <DialogDescription className="font-body">
            We'd love to have you! Our services are on Sundays at 9:00 AM and 11:00 AM.
            Let us know if you have any questions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="name-visit" className="font-body">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name-visit"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 font-body"
                  required
                  aria-label="Your name"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email-visit" className="font-body">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email-visit"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-body"
                  required
                  aria-label="Your email address"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="message-visit" className="font-body">Message (Optional)</Label>
               <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="message-visit"
                  placeholder="Any questions or specific needs?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pl-10 font-body"
                  rows={3}
                  aria-label="Your message"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="font-headline">Send Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
