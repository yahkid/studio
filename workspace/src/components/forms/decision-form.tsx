
"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { User, Mail, MessageSquare, HeartHandshake, HelpCircle, Users2, CheckCircle, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebaseClient'; // Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Firebase
import { useAuthFirebase } from '@/contexts/AuthContextFirebase'; // Import Firebase Auth Context

export function DecisionForm() {
  const { user } = useAuthFirebase(); // Get current user
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [decisionType, setDecisionType] = useState('');
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !decisionType) {
      toast({
        title: "Taarifa Hazijakamilika",
        description: "Tafadhali jaza jina lako, barua pepe, na uchague aina ya uamuzi.",
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
      await addDoc(collection(db, 'decisions'), {
        name,
        email,
        decision_type: decisionType,
        comments: comments || null,
        user_id: user ? user.uid : "anonymous_user", // Use placeholder if user is not logged in
        created_at: serverTimestamp()
      });

      toast({
        title: "Asante kwa Kushiriki Uamuzi Wako!",
        description: "Tumefurahi sana na uamuzi wako. Mtu kutoka timu yetu atawasiliana nawe hivi karibuni (ndani ya saa 24-48) ili kukusaidia katika hatua zako zinazofuata. Karibu kwenye familia!",
        duration: 7000,
      });

      setName('');
      setEmail('');
      setDecisionType('');
      setComments('');
    } catch (error: any) {
      console.error('Error submitting decision to Firestore:', error);
      toast({
        title: "Hitilafu Imetokea",
        description: "Imeshindwa kuwasilisha uamuzi wako. Tafadhali jaribu tena. " + (error.message || ""),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const decisionOptions = [
    { id: "faith", label: "Nilifanya agano la kwanza na Kristo.", Icon: HeartHandshake },
    { id: "rededication", label: "Niliweka upya maisha yangu kwa Kristo.", Icon: CheckCircle },
    { id: "baptism", label: "Nataka kujifunza zaidi kuhusu ubatizo.", Icon: HelpCircle },
    { id: "membership", label: "Ninapenda kuwa mwanachama wa kanisa.", Icon: Users2 },
    { id: "other", label: "Nyingine (tafadhali eleza kwenye maoni).", Icon: MessageSquare },
  ];

  return (
    <Card className="w-full max-w-lg mx-auto my-8">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center">Nimeinua Mkono Wangu</CardTitle>
        <CardDescription className="font-body text-center">
          Tumefurahi sana umefanya uamuzi! Tafadhali shiriki maelezo machache nasi ili tuweze kukufuatilia.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name-decision" className="font-body">Jina Kamili</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name-decision"
                placeholder="Jina lako kamili"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 font-body"
                required
                aria-label="Jina lako kamili"
                disabled={isLoading}
                suppressHydrationWarning={true}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-decision" className="font-body">Anwani ya Barua Pepe</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email-decision"
                type="email"
                placeholder="barua.pepe@mfano.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 font-body"
                required
                aria-label="Anwani yako ya barua pepe"
                disabled={isLoading}
                suppressHydrationWarning={true}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-body">Ulifanya uamuzi gani leo?</Label>
            <RadioGroup
              value={decisionType}
              onValueChange={setDecisionType}
              className="space-y-2"
              aria-label="Aina ya uamuzi"
            >
              {decisionOptions.map(option => (
                <div key={option.id} className={`flex items-center space-x-3 p-3 border rounded-md hover:bg-accent/50 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <RadioGroupItem value={option.id} id={`decision-${option.id}`} disabled={isLoading} />
                  <Label htmlFor={`decision-${option.id}`} className={`font-body flex items-center gap-2 text-sm ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    <option.Icon className="h-5 w-5 text-primary" />
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments-decision" className="font-body">Maoni (Hiari)</Label>
             <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="comments-decision"
                placeholder="Je, kuna kingine ungependa kushiriki?"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="pl-10 font-body"
                rows={4}
                aria-label="Maoni ya hiari"
                disabled={isLoading}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">Hatutakutumia barua taka. Faragha yako ni muhimu.</p>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full font-headline" disabled={isLoading} suppressHydrationWarning={true}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Inawasilisha...' : 'Wasilisha Uamuzi Wangu'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
