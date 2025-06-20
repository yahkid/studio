
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
import { User, Mail, HandHeart, MessageSquare, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebaseClient'; // Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Firebase

interface VolunteerPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VolunteerPartnerModal({ open, onOpenChange }: VolunteerPartnerModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [interestsSkills, setInterestsSkills] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setInterestsSkills('');
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
      await addDoc(collection(db, 'volunteer_partner_signups'), { 
          first_name: firstName, 
          last_name: lastName, 
          email, 
          interests_skills: interestsSkills || null,
          created_at: serverTimestamp()
        });

      toast({
        title: "Asante kwa Kujitolea!",
        description: "Tumepokea ombi lako la kujitolea. Tutawasiliana nawe hivi karibuni na fursa zilizopo.",
      });
      onOpenChange(false); 
      resetForm(); 
    } catch (error: any) {
      console.error('Error submitting volunteer signup to Firestore:', error);
      toast({
        title: "Hitilafu Imetokea",
        description: "Imeshindwa kuwasilisha ombi lako. Tafadhali jaribu tena. " + (error.message || ""),
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
            <HandHeart className="mr-2 h-6 w-6 text-primary"/>
            Jitolee Nasi
          </DialogTitle>
          <DialogDescription className="font-body">
            Tunathamini shauku yako ya kutumika! Tafadhali tuambie zaidi kuhusu wewe na jinsi ungependa kujihusisha.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName-volunteer" className="font-body">Jina la Kwanza</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName-volunteer"
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
                <Label htmlFor="lastName-volunteer" className="font-body">Jina la Mwisho</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName-volunteer"
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
              {isLoading ? 'Inatuma...' : 'Wasilisha Ombi la Kujitolea'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
