
"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { HandCoins, Smartphone, CreditCard, Banknote, Building, Loader2, Heart, CheckCircle, Info, User, Mail, Repeat, ArrowRight } from 'lucide-react';
import { logDonation } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const TIGO_PESA_ICON = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#4a4a4a"/>
    <path d="M12 4c-2.76 0-5.26 1.12-7.07 2.93L12 14.12l7.07-7.19C17.26 5.12 14.76 4 12 4zm0 14c-1.38 0-2.63-.56-3.54-1.46L12 12.88l3.54 3.66C14.63 17.44 13.38 18 12 18z" fill="#4a4a4a"/>
    <path d="M6.34 8.34L12 13.99l5.66-5.65C16.53 7.47 14.39 6.5 12 6.5s-4.53.97-5.66 1.84z" fill="#00adee"/>
  </svg>
);


const donationSchema = z.object({
  name: z.string().min(2, { message: "Tafadhali ingiza jina lako." }),
  email: z.string().email({ message: "Anwani ya barua pepe si sahihi." }),
  frequency: z.enum(['onetime', 'monthly'], { required_error: 'Tafadhali chagua marudio.' }),
  amount: z.coerce.number().min(1000, { message: "Kiwango cha chini ni TZS 1,000." }),
});

type DonationFormValues = z.infer<typeof donationSchema>;

export default function PartnerPage() {
  const { user, initialLoadingComplete } = useAuthFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState<DonationFormValues | null>(null);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      frequency: 'onetime',
      amount: 10000,
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (initialLoadingComplete && user) {
        form.setValue('name', user.displayName || '');
        form.setValue('email', user.email || '');
    }
  }, [user, initialLoadingComplete, form]);

  const presetAmounts = [10000, 25000, 50000, 100000];

  const onSubmit = async (values: DonationFormValues, method: 'mpesa' | 'tigopesa' | 'card' | 'bank' | 'cash') => {
    setIsLoading(true);
    setSubmittedDetails(values);

    if (method === 'card') {
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    const result = await logDonation({
      amount: values.amount,
      frequency: values.frequency,
      name: values.name,
      email: values.email,
      method: method,
      userId: user?.uid,
      status: 'initiated'
    });

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Nia Imepokelewa",
        description: `Asante kwa nia yako ya kuchangia TZS ${values.amount.toLocaleString()}.`,
      });
      setIsSuccess(true);
      form.reset();
    } else {
      toast({
        title: "Hitilafu",
        description: result.error || "Imeshindwa kurekodi mchango wako. Tafadhali jaribu tena.",
        variant: "destructive",
      });
    }
  };
  
  if (isSuccess && submittedDetails) {
    return (
       <Card className="w-full max-w-2xl mx-auto my-8 text-center animate-in fade-in-50">
          <CardHeader>
             <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="font-headline text-3xl">Asante, {submittedDetails.name.split(' ')[0]}!</CardTitle>
            <CardDescription>
                Nia yako ya kuchangia <strong>TZS {submittedDetails.amount.toLocaleString()}</strong> ({submittedDetails.frequency === 'monthly' ? 'kila mwezi' : 'mara moja'}) imepokelewa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
                Ushirika wako wa ukarimu unaleta mabadiliko ya kweli. Tafadhali kamilisha malipo kupitia njia uliyoichagua. Mungu akubariki kwa wingi!
            </p>
            <Button onClick={() => { setIsSuccess(false); setSubmittedDetails(null); }}>
                Toa Mchango Mwingine
            </Button>
          </CardContent>
        </Card>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div 
        className="text-center max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heart className="mx-auto h-16 w-16 text-primary mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
          Kuwa Mshirika wa Maono
        </h1>
        <p className="font-body text-xl text-muted-foreground">
          Utoaji wako unatuwezesha kueneza Injili, kuhudumia jamii, na kubadilisha maisha. Asante kwa kuwa sehemu ya kile Mungu anachofanya kupitia HSCM Connect.
        </p>
      </motion.div>

      <Form {...form}>
        <form>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center">
                    <HandCoins className="mr-3 h-7 w-7 text-primary"/>
                    Toa Mchango Wako
                </CardTitle>
                <CardDescription>
                    Fuata hatua hizi rahisi ili kutoa mchango wako salama.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Step 1: Frequency */}
                  <div>
                    <Label className="text-lg font-semibold mb-3 block">Hatua ya 1: Chagua Marudio</Label>
                    <Controller
                        name="frequency"
                        control={form.control}
                        render={({ field }) => (
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                            <Label className={cn("flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", field.value === 'onetime' && "border-primary")}>
                                <RadioGroupItem value="onetime" className="sr-only" />
                                <Repeat className="mb-3 h-6 w-6" /> Mara Moja
                            </Label>
                            <Label className={cn("flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", field.value === 'monthly' && "border-primary")}>
                                <RadioGroupItem value="monthly" className="sr-only" />
                                <CalendarCheck className="mb-3 h-6 w-6" /> Kila Mwezi
                            </Label>
                          </RadioGroup>
                        )}
                    />
                  </div>
                  
                  {/* Step 2: Amount */}
                  <div>
                    <Label htmlFor="amount" className="text-lg font-semibold">Hatua ya 2: Chagua Kiasi (TZS)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                        {presetAmounts.map(preset => (
                            <Button key={preset} type="button" variant="outline" onClick={() => form.setValue('amount', preset, { shouldValidate: true })}>
                                {preset.toLocaleString()}
                            </Button>
                        ))}
                    </div>
                     <Controller
                        name="amount"
                        control={form.control}
                        render={({ field }) => (
                        <Input
                            id="amount"
                            type="number"
                            className="text-2xl h-14 mt-3"
                            {...field}
                        />
                        )}
                    />
                    {form.formState.errors.amount && <p className="text-destructive text-sm mt-1">{form.formState.errors.amount.message}</p>}
                  </div>

                  {/* Step 3: Details */}
                   <div>
                        <Label className="text-lg font-semibold mb-3 block">Hatua ya 3: Maelezo Yako</Label>
                        <div className="grid grid-cols-1 gap-4">
                             <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Jina Kamili</FormLabel><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input className="pl-10" {...field} /></FormControl></div><FormMessage /></FormItem>
                             )}/>
                             <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Barua Pepe</FormLabel><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input type="email" className="pl-10" {...field} /></FormControl></div><FormMessage /></FormItem>
                             )}/>
                        </div>
                   </div>

                </CardContent>
                 <CardFooter>
                  <p className="text-muted-foreground text-sm flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2"/> Endelea hapa chini kuchagua njia ya malipo.
                  </p>
                </CardFooter>
            </Card>

            <Card className="w-full max-w-2xl mx-auto mt-8">
                <CardHeader>
                     <Label className="text-lg font-semibold">Hatua ya 4: Chagua Njia ya Malipo</Label>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="mpesa" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
                            <TabsTrigger value="mpesa"><Smartphone className="mr-2 h-4 w-4"/>M-Pesa</TabsTrigger>
                            <TabsTrigger value="tigopesa"><TIGO_PESA_ICON /> Tigo Pesa</TabsTrigger>
                            <TabsTrigger value="card" className="hidden md:flex"><CreditCard className="mr-2 h-4 w-4"/>Kadi</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="mpesa" className="mt-4">
                            <Button onClick={form.handleSubmit(v => onSubmit(v, 'mpesa'))} className="w-full h-12 text-lg" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                Lipa kwa M-Pesa
                            </Button>
                            <p className="text-xs text-center text-muted-foreground mt-2">Utabonyeza *150*00# kukamilisha malipo (Hii ni simulizi).</p>
                        </TabsContent>

                         <TabsContent value="tigopesa" className="mt-4">
                            <Button onClick={form.handleSubmit(v => onSubmit(v, 'tigopesa'))} className="w-full h-12 text-lg" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                Lipa kwa Tigo Pesa
                            </Button>
                            <p className="text-xs text-center text-muted-foreground mt-2">Utabonyeza *150*01# kukamilisha malipo (Hii ni simulizi).</p>
                        </TabsContent>

                        <TabsContent value="card" className="mt-4 space-y-4">
                            <Alert variant="destructive">
                                <Info className="h-4 w-4" />
                                <AlertTitle>Njia ya Mfano</AlertTitle>
                                <AlertDescription>
                                    Fomu hii ni kwa ajili ya maonyesho tu. <strong>Usiweke taarifa halisi za kadi yako.</strong>
                                </AlertDescription>
                            </Alert>
                             <Button onClick={form.handleSubmit(v => onSubmit(v, 'card'))} className="w-full h-12 text-lg" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                Toa kwa Kadi
                            </Button>
                        </TabsContent>

                    </Tabs>
                </CardContent>
            </Card>
        </form>
      </Form>
    </div>
  );
}

