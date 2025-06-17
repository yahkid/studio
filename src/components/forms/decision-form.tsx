
"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { User, Mail, MessageSquare, HeartHandshake, HelpCircle, Users } from 'lucide-react';

export function DecisionForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [decisionType, setDecisionType] = useState('');
  const [comments, setComments] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !decisionType) {
      toast({
        title: "Missing Information",
        description: "Please fill out your name, email, and select a decision type.",
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
    console.log("Decision form submitted:", { name, email, decisionType, comments });
    toast({
      title: "Thank You for Sharing!",
      description: "We've received your decision and will be in touch soon.",
    });
    setName('');
    setEmail('');
    setDecisionType('');
    setComments('');
  };

  const decisionOptions = [
    { id: "faith", label: "I made a first-time commitment to Christ.", Icon: HeartHandshake },
    { id: "rededication", label: "I rededicated my life to Christ.", Icon: HeartHandshake },
    { id: "baptism", label: "I want to learn more about baptism.", Icon: HelpCircle },
    { id: "membership", label: "I'm interested in church membership.", Icon: Users },
    { id: "other", label: "Other (please specify in comments).", Icon: MessageSquare },
  ];

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center">I've Raised My Hand</CardTitle>
        <CardDescription className="font-body text-center">
          We're so glad you've made a decision! Please share a few details with us so we can follow up.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name-decision" className="font-body">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name-decision"
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 font-body"
                required
                aria-label="Your full name"
                suppressHydrationWarning={true}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-decision" className="font-body">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email-decision"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 font-body"
                required
                aria-label="Your email address"
                suppressHydrationWarning={true}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-body">What decision did you make today?</Label>
            <RadioGroup
              value={decisionType}
              onValueChange={setDecisionType}
              className="space-y-2"
              aria-label="Decision type"
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
            <Label htmlFor="comments-decision" className="font-body">Comments (Optional)</Label>
             <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="comments-decision"
                placeholder="Anything else you'd like to share?"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="pl-10 font-body"
                rows={4}
                aria-label="Optional comments"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full font-headline" suppressHydrationWarning={true}>Submit My Decision</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
