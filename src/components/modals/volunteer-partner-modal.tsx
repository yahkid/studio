
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
import { User, Mail, HandHeart, MessageSquare, Loader2 } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';

interface VolunteerPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VolunteerPartnerModal({ open, onOpenChange }: VolunteerPartnerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interestsSkills, setInterestsSkills] = useState('');
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
        .from('volunteer_partner_signups')
        .insert({ name, email, interests_skills: interestsSkills || null });

      if (error) throw error;

      toast({
        title: "Asante kwa Kujitolea!",
        description: "Tumepokea ombi lako la kujitolea. Tutawasiliana nawe hivi karibuni na fursa zilizopo.",
      });
      setName('');
      setEmail('');
      setInterestsSkills('');
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
            <HandHeart className="mr-2 h-6 w-6 text-primary"/>
            Jitolee Nasi
          </DialogTitle>
          <DialogDescription className="font-body">
            Tunathamini shauku yako ya kutumika! Tafadhali tuambie zaidi kuhusu wewe na jinsi ungependa kujihusisha.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="name-volunteer" className="font-body">Jina Kamili</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name-volunteer"
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
              <Label htmlFor="email-volunteer" className="font-body">Barua Pepe</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email-volunteer"
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
              <Label htmlFor="interests-volunteer" className="font-body">Maeneo ya Kujitolea / Ujuzi (Hiari)</Label>
               <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="interests-volunteer"
                  placeholder="Mfano: Kufundisha watoto, uimbaji, usimamizi wa matukio, n.k."
                  value={interestsSkills}
                  onChange={(e) => setInterestsSkills(e.target.value)}
                  className="pl-10 font-body"
                  rows={3}
                  aria-label="Maeneo ya kujitolea au ujuzi"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="font-headline w-full" disabled={isLoading} suppressHydrationWarning={true}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Inatuma...' : 'Wasilisha Ombi la Kujitolea'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
