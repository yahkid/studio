
"use client"

import { useState, useEffect } from 'react';
import type { Department } from '@/app/huduma/page';
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { User, Mail, HandHeart, MessageSquare, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface VolunteerPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
}

export function VolunteerPartnerModal({ open, onOpenChange, department }: VolunteerPartnerModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Reset form when modal is closed or department changes
  useEffect(() => {
    if (!open) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setSelectedRoles([]);
      setAdditionalInfo('');
      setIsLoading(false);
    }
  }, [open]);
  
  const handleRoleChange = (role: string, checked: boolean) => {
    setSelectedRoles(prev => 
      checked ? [...prev, role] : prev.filter(r => r !== role)
    );
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
        department: department?.name || 'General Interest',
        selected_roles: selectedRoles,
        interests_skills: additionalInfo || null,
        created_at: serverTimestamp()
      });

      toast({
        title: "Asante kwa Kujitolea!",
        description: "Tumepokea ombi lako. Tutawasiliana nawe hivi karibuni na fursa zilizopo.",
      });
      onOpenChange(false); 
    } catch (error: any) {
      console.error('Error submitting volunteer signup to Firestore:', error);
      toast({
        title: "Hitilafu Imetokea",
        description: `Imeshindwa kuwasilisha ombi lako. Tafadhali jaribu tena. ${error.message || ""}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const DepartmentIcon = department?.icon || HandHeart;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
            <DepartmentIcon className="mr-2 h-6 w-6 text-primary"/>
            Jiunge na Idara ya {department?.name || "Kujitolea"}
          </DialogTitle>
          <DialogDescription className="font-body">
            Tunathamini shauku yako ya kutumika! Tafadhali jaza fomu hii ili tuweze kukufahamu zaidi.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName-volunteer" className="font-body">Jina la Kwanza</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="firstName-volunteer" placeholder="Jina lako" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="pl-10 font-body" required disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName-volunteer" className="font-body">Jina la Mwisho</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="lastName-volunteer" placeholder="la familia" value={lastName} onChange={(e) => setLastName(e.target.value)} className="pl-10 font-body" required disabled={isLoading} />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email-volunteer" className="font-body">Barua Pepe</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email-volunteer" type="email" placeholder="barua.pepe@mfano.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 font-body" required disabled={isLoading} />
              </div>
            </div>

            {department && department.roles.length > 0 && (
              <div className="space-y-2">
                <Label className="font-body">Chagua maeneo unayopenda:</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 rounded-md border p-4">
                  {department.roles.map(role => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        onCheckedChange={(checked) => handleRoleChange(role, !!checked)}
                        checked={selectedRoles.includes(role)}
                        disabled={isLoading}
                      />
                      <Label htmlFor={`role-${role}`} className="text-sm font-normal cursor-pointer">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <Label htmlFor="interests-volunteer" className="font-body">Ujuzi Mwingine au Maelezo ya Ziada</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea id="interests-volunteer" placeholder="Tuambie zaidi kuhusu vipawa vyako au jinsi unavyopenda kutumika..." value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="pl-10 font-body" rows={3} disabled={isLoading} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">Hatutakutumia barua taka. Faragha yako ni muhimu.</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-4">
            <DialogClose asChild>
              <Button variant="outline" className="font-headline" type="button" disabled={isLoading} suppressHydrationWarning={true}>Ghairi</Button>
            </DialogClose>
            <Button type="submit" className="font-headline" disabled={isLoading} suppressHydrationWarning={true}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Inatuma...' : 'Wasilisha Ombi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    