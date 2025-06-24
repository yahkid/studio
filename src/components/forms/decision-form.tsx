
"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { User, Mail, MessageSquare, HeartHandshake, HelpCircle, Users2, CheckCircle, Loader2, LogIn, Info, Sparkles, BookOpen, Users as UsersIcon } from 'lucide-react';
import { db } from '@/lib/firebaseClient'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { useAuthFirebase } from '@/contexts/AuthContextFirebase'; 
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { personalizeNextSteps, type PersonalizeNextStepsOutput } from '@/ai/flows/personalize-next-steps-flow';

const decisionOptions = [
    { id: "faith", label: "Nilifanya agano la kwanza na Kristo.", Icon: HeartHandshake },
    { id: "rededication", label: "Niliweka upya maisha yangu kwa Kristo.", Icon: CheckCircle },
    { id: "baptism", label: "Nataka kujifunza zaidi kuhusu ubatizo.", Icon: HelpCircle },
    { id: "membership", label: "Ninapenda kuwa mwanachama wa kanisa.", Icon: Users2 },
    { id: "other", label: "Nyingine (tafadhali eleza kwenye maoni).", Icon: MessageSquare },
];

const iconMap: { [key: string]: React.ElementType } = {
  BookOpen,
  Users: UsersIcon,
  HeartHandshake,
  Info,
};


export function DecisionForm() {
  const { user, loading: authLoading, initialLoadingComplete } = useAuthFirebase();
  const [formState, setFormState] = useState<'form' | 'submitting' | 'success'>('form');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [decisionType, setDecisionType] = useState('');
  const [comments, setComments] = useState('');
  const [aiResponse, setAiResponse] = useState<PersonalizeNextStepsOutput | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (initialLoadingComplete && user) {
      if (!name && user.displayName) setName(user.displayName);
      if (!email && user.email) setEmail(user.email);
    }
  }, [user, initialLoadingComplete, name, email]);

  const resetForm = () => {
    setDecisionType('');
    setComments('');
    setAiResponse(null);
    setFormState('form');
  }

  const handleWhatsAppSubmit = () => {
    if (!name || !email || !decisionType) {
      toast({
        title: "Taarifa Hazijakamilika",
        description: "Tafadhali jaza jina lako, barua pepe, na uchague aina ya uamuzi kabla ya kutuma kupitia WhatsApp.",
        variant: "destructive",
      });
      return;
    }

    const ministryPhone = "255652796450";
    const selectedOption = decisionOptions.find(opt => opt.id === decisionType);
    
    const message = `*Uamuzi Mpya kutoka HSCM Connect:*
    
*Jina:* ${name}
*Barua Pepe:* ${email}
*Aina ya Uamuzi:* ${selectedOption ? selectedOption.label : decisionType}
*Maoni:* ${comments || "Hakuna"}
    `;

    const whatsappUrl = `https://wa.me/${ministryPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!initialLoadingComplete) {
        toast({ title: "Tafadhali subiri", description: "Inapakia uthibitishaji...", variant: "default"});
        return;
    }
    if (!user) {
      toast({
        title: "Unahitaji Kuingia Kwanza",
        description: (
            <div>
                Tafadhali ingia au jisajili ili kuwasilisha uamuzi wako.
                <Button asChild variant="link" className="p-0 ml-1 h-auto text-primary">
                    <Link href="/auth?mode=login">Nenda Kwenye Ukurasa wa Kuingia</Link>
                </Button>
            </div>
        ),
        variant: "destructive",
      });
      return;
    }
    if (!name || !email || !decisionType) {
      toast({ title: "Taarifa Hazijakamilika", description: "Tafadhali jaza jina lako, barua pepe, na uchague aina ya uamuzi.", variant: "destructive" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({ title: "Barua Pepe Batili", description: "Tafadhali ingiza anwani sahihi ya barua pepe.", variant: "destructive" });
      return;
    }

    setFormState('submitting');
    try {
      // Step 1: Save to Firestore
      await addDoc(collection(db, 'decisions'), {
        name, email, decision_type: decisionType, comments: comments || null, user_id: user.uid, created_at: serverTimestamp()
      });
      toast({ title: "Uamuzi Umepokelewa!", description: "Mtu kutoka timu yetu atawasiliana nawe hivi karibuni." });

      // Step 2: Get AI-powered next steps (don't block UI on this)
      personalizeNextSteps({ userName: name.split(' ')[0], decisionType: decisionType as any })
        .then(response => {
          setAiResponse(response);
          setFormState('success');
        })
        .catch(aiError => {
          console.error("AI Personalization Error:", aiError);
          // If AI fails, still show a generic success message.
          setAiResponse({
            greeting: `Hongera sana, ${name}! Tumefurahi sana kwa ajili yako.`,
            nextSteps: [{
              title: "Ongea na Mchungaji",
              description: "Mchungaji atakupigia simu hivi karibuni ili kukuongoza.",
              url: "/#",
              icon: "HeartHandshake"
            }]
          });
          setFormState('success');
        });

    } catch (error: any) {
      console.error('Error submitting decision to Firestore:', error);
      toast({ title: "Hitilafu Imetokea", description: `Imeshindwa kuwasilisha uamuzi wako. Tafadhali jaribu tena. ${error.message || ""}`, variant: "destructive" });
      setFormState('form');
    }
  };

  const isSubmitDisabled = authLoading || formState === 'submitting';

  return (
    <Card className="w-full max-w-lg mx-auto my-8">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center">Nimeinua Mkono Wangu</CardTitle>
        <CardDescription className="font-body text-center mb-4">
          {formState !== 'success'
            ? "Tumefurahi sana umefanya uamuzi! Tafadhali shiriki maelezo machache nasi."
            : "Hongera! Tunasherehekea nawe."
          }
        </CardDescription>
        {formState === 'form' && (
             <Alert variant="default" className="border-primary/30 bg-primary/5 dark:bg-primary/10">
                <Info className="h-5 w-5 text-primary" />
                <AlertTitle className="font-body text-sm text-foreground">Hatua Zinazofuata</AlertTitle>
                <AlertDescription className="font-body text-xs text-muted-foreground">
                Baada ya kuwasilisha, tutakupa mapendekezo ya hatua zako zinazofuata hapa hapa!
                </AlertDescription>
            </Alert>
        )}
      </CardHeader>
      
      {formState === 'success' && aiResponse && (
        <CardContent className="text-center space-y-6 animate-in fade-in-50">
           <Sparkles className="h-16 w-16 text-secondary mx-auto" />
           <p className="font-body text-lg text-muted-foreground">{aiResponse.greeting}</p>
           <div>
            <h3 className="font-headline text-xl mb-4">Hatua Zako Zinazofuata:</h3>
            <div className="space-y-3 text-left">
                {aiResponse.nextSteps.map(step => {
                    const Icon = iconMap[step.icon] || Info;
                    return (
                        <Link href={step.url} key={step.url} className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-foreground">{step.title}</h4>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
           </div>
        </CardContent>
      )}

      {(formState === 'form' || formState === 'submitting') && (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-0">
             <div className="space-y-2">
                <Label htmlFor="name-decision" className="font-body">Jina Kamili</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name-decision" placeholder="Jina lako kamili" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 font-body" required disabled={isSubmitDisabled} suppressHydrationWarning={true} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-decision" className="font-body">Anwani ya Barua Pepe</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email-decision" type="email" placeholder="barua.pepe@mfano.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 font-body" required disabled={isSubmitDisabled} suppressHydrationWarning={true}/>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-body">Ulifanya uamuzi gani leo?</Label>
                <RadioGroup value={decisionType} onValueChange={setDecisionType} className="space-y-2" aria-label="Aina ya uamuzi">
                  {decisionOptions.map(option => (
                    <div key={option.id} className={`flex items-center space-x-3 p-3 border rounded-md hover:bg-accent/50 transition-colors ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <RadioGroupItem value={option.id} id={`decision-${option.id}`} disabled={isSubmitDisabled} />
                      <Label htmlFor={`decision-${option.id}`} className={`font-body flex items-center gap-2 text-sm ${isSubmitDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        <option.Icon className="h-5 w-5 text-primary" />{option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comments-decision" className="font-body">Maoni (Hiari)</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea id="comments-decision" placeholder="Je, kuna kingine ungependa kushiriki?" value={comments} onChange={(e) => setComments(e.target.value)} className="pl-10 font-body" rows={4} disabled={isSubmitDisabled} />
                </div>
              </div>
          </CardContent>
        </form>
      )}

      <CardFooter className="flex flex-col sm:flex-row gap-2">
        {formState === 'form' && (
          <>
            <Button type="submit" onClick={handleSubmit} className="w-full font-headline sm:flex-1" disabled={isSubmitDisabled} suppressHydrationWarning={true}>
              {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!authLoading && !user && initialLoadingComplete && <LogIn className="mr-2 h-4 w-4" />}
              {authLoading ? 'Inapakia...' : !user && initialLoadingComplete ? 'Tafadhali Ingia Kwanza' : 'Wasilisha Uamuzi Wangu'}
            </Button>
            <Button type="button" variant="outline" className="w-full font-headline sm:flex-1 text-green-600 border-green-600 hover:bg-green-600 hover:text-white" onClick={handleWhatsAppSubmit} disabled={isSubmitDisabled}>
              <WhatsAppIcon className="mr-2" /> Tuma kwa WhatsApp
            </Button>
          </>
        )}
        {formState === 'submitting' && (
            <Button className="w-full font-headline" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inawasilisha...
            </Button>
        )}
         {formState === 'success' && (
            <Button onClick={resetForm} className="w-full font-headline">Fanya Uamuzi Mwingine</Button>
        )}
      </CardFooter>
    </Card>
  );
}
