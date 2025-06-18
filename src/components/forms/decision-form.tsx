
"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { User, Mail, MessageSquare, HeartHandshake, HelpCircle, Users2, CheckCircle } from 'lucide-react'; // Users2 for membership

export function DecisionForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [decisionType, setDecisionType] = useState('');
  const [comments, setComments] = useState('');
  const { toast, dismiss } = useToast(); 

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
    
    // Basic console log, replace with actual submission logic (e.g., to Supabase)
    console.log("Decision form submitted (Swahili):", { name, email, decisionType, comments });

    // Supabase submission example (uncomment and adapt if using Supabase)
    /*
    const { error } = await supabase.from('decisions').insert([
      { name, email, decision_type: decisionType, comments }
    ]);

    if (error) {
      toast({
        title: "Hitilafu Imetokea",
        description: "Imeshindwa kuwasilisha uamuzi wako. Tafadhali jaribu tena." error.message,
        variant: "destructive",
      });
      return;
    }
    */

    const { id: toastId } = toast({
      title: "Asante kwa Kushiriki!",
      description: "Tumepokea uamuzi wako na tutawasiliana nawe hivi karibuni.",
    });

    setTimeout(() => {
      dismiss(toastId);
    }, 5000);

    setName('');
    setEmail('');
    setDecisionType('');
    setComments('');
  };

  const decisionOptions = [
    { id: "faith", label: "Nilifanya agano la kwanza na Kristo.", Icon: HeartHandshake },
    { id: "rededication", label: "Niliweka upya maisha yangu kwa Kristo.", Icon: CheckCircle }, // Using CheckCircle for rededication
    { id: "baptism", label: "Nataka kujifunza zaidi kuhusu ubatizo.", Icon: HelpCircle },
    { id: "membership", label: "Ninapenda kuwa mwanachama wa kanisa.", Icon: Users2 },
    { id: "other", label: "Nyingine (tafadhali eleza kwenye maoni).", Icon: MessageSquare },
  ];

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl my-8">
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
                <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value={option.id} id={`decision-${option.id}`} />
                  <Label htmlFor={`decision-${option.id}`} className="font-body flex items-center gap-2 cursor-pointer text-sm">
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
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full font-headline" suppressHydrationWarning={true}>Wasilisha Uamuzi Wangu</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
