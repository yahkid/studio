
"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { HandCoins, Smartphone, CreditCard, Banknote, Building, Loader2, Heart, CheckCircle, Info } from 'lucide-react';
import { logDonation } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const donationSchema = z.object({
  amount: z.coerce.number().min(100, { message: "Kiwango cha chini ni TZS 100." }),
  phone: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationSchema>;

export default function PartnerPage() {
  const { user } = useAuthFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedAmount, setSubmittedAmount] = useState<number | null>(null);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: { amount: 10000 },
  });

  const onSubmit = async (values: DonationFormValues, method: 'mpesa' | 'card' | 'bank' | 'cash') => {
    setIsLoading(true);
    setSubmittedAmount(values.amount);

    if (method === 'card') {
        // Simulate a delay for card processing
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    const result = await logDonation({
      amount: values.amount,
      method: method,
      userId: user?.uid,
      userName: user?.displayName || user?.email || "Guest",
      status: 'initiated'
    });

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Nia Imepokelewa",
        description: `Asante kwa nia yako ya kuchangia TZS ${values.amount.toLocaleString()}.`,
      });
      setIsSuccess(true);
      form.reset({ amount: 10000 });
    } else {
      toast({
        title: "Hitilafu",
        description: result.error || "Imeshindwa kurekodi mchango wako. Tafadhali jaribu tena.",
        variant: "destructive",
      });
    }
  };
  
  if (isSuccess && submittedAmount) {
    return (
       <Card className="w-full max-w-2xl mx-auto my-8 text-center animate-in fade-in-50">
          <CardHeader>
             <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="font-headline text-3xl">Asante Sana!</CardTitle>
            <CardDescription>
                Nia yako ya kuchangia <strong>TZS {submittedAmount.toLocaleString()}</strong> imepokelewa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
                Ushirika wako ni muhimu sana katika kuendeleza kazi ya Bwana. Tafadhali kamilisha malipo kupitia njia uliyoichagua. Mungu akubariki!
            </p>
            <Button onClick={() => { setIsSuccess(false); setSubmittedAmount(null); }}>
                Toa Mchango Mwingine
            </Button>
          </CardContent>
        </Card>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Heart className="mx-auto h-16 w-16 text-primary mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
          Shiriki Nasi Katika Kazi ya Mungu
        </h1>
        <p className="font-body text-xl text-muted-foreground">
          Utoaji wako wa ukarimu unatuwezesha kueneza Injili, kuhudumia jamii, na kubadilisha maisha. Asante kwa kuwa mshirika katika huduma hii.
        </p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <HandCoins className="mr-3 h-7 w-7 text-primary"/>
            Toa Mchango Wako
          </CardTitle>
          <CardDescription>
            Chagua kiasi na njia ya malipo unayopendelea. Kila mchango huleta mabadiliko.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="mb-6">
              <Label htmlFor="amount" className="text-lg font-semibold">Kiasi (TZS)</Label>
              <Controller
                name="amount"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="amount"
                    type="number"
                    className="text-2xl h-14 mt-2"
                    {...field}
                  />
                )}
              />
              {form.formState.errors.amount && <p className="text-destructive text-sm mt-1">{form.formState.errors.amount.message}</p>}
            </div>
          </form>

          <Tabs defaultValue="mpesa" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="mpesa"><Smartphone className="mr-2 h-4 w-4"/>M-Pesa</TabsTrigger>
              <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4"/>Kadi</TabsTrigger>
              <TabsTrigger value="bank"><Building className="mr-2 h-4 w-4"/>Benki</TabsTrigger>
              <TabsTrigger value="cash"><Banknote className="mr-2 h-4 w-4"/>Taslimu</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mpesa" className="mt-4">
                <Button onClick={form.handleSubmit(v => onSubmit(v, 'mpesa'))} className="w-full h-12 text-lg" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Lipa kwa M-Pesa
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">Utabonyeza *150*00# kukamilisha malipo (Hii ni simulizi).</p>
            </TabsContent>

            <TabsContent value="card" className="mt-4 space-y-4">
                <Alert variant="destructive">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Njia ya Mfano</AlertTitle>
                    <AlertDescription>
                        Fomu hii ni kwa ajili ya maonyesho tu. <strong>Usiweke taarifa halisi za kadi yako.</strong>
                    </AlertDescription>
                </Alert>
                <div className="space-y-2">
                    <Label htmlFor="card-name">Jina kwenye Kadi</Label>
                    <Input id="card-name" placeholder="Jina Kamili" disabled/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="card-number">Namba ya Kadi</Label>
                    <Input id="card-number" placeholder="0000 0000 0000 0000" disabled/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="expiry">Mwisho wa Matumizi</Label>
                        <Input id="expiry" placeholder="MM/YY" disabled/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" disabled/>
                    </div>
                </div>
                 <Button onClick={form.handleSubmit(v => onSubmit(v, 'card'))} className="w-full h-12 text-lg" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Toa kwa Kadi
                </Button>
            </TabsContent>

            <TabsContent value="bank" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Taarifa za Benki</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Jina la Akaunti:</strong> HSCM CONNECT</p>
                        <p><strong>Namba ya Akaunti:</strong> 0123456789012</p>
                        <p><strong>Benki:</strong> CRDB Bank PLC</p>
                        <p><strong>SWIFT Code:</strong> CORUTZTZ</p>
                         <Button onClick={form.handleSubmit(v => onSubmit(v, 'bank'))} className="w-full h-12 text-lg mt-4" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                           Nimefanya Muamala
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="cash" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Pesa Taslimu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Unaweza kutoa sadaka yako kwa pesa taslimu wakati wa ibada zetu. Tafuta bahasha maalum au muone mhudumu kwa msaada.
                        </p>
                        <Button onClick={form.handleSubmit(v => onSubmit(v, 'cash'))} className="w-full h-12 text-lg" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            Nitatoa Kanisani
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
