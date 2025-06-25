"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Building, Smartphone, HandCoins } from "lucide-react";

interface PaymentOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center border-b py-2 last:border-b-0">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm font-semibold text-foreground">{value}</dd>
  </div>
);


export function PaymentOptionsModal({ open, onOpenChange }: PaymentOptionsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
            <HandCoins className="mr-2 h-6 w-6 text-primary"/>
            Toa Sadaka Yako
          </DialogTitle>
          <DialogDescription className="font-body">
            Chagua njia rahisi kwako ya kutoa. Mchango wako unasaidia kueneza Injili.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="mpesa" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mpesa"><Smartphone className="mr-2 h-4 w-4"/>M-Pesa</TabsTrigger>
            <TabsTrigger value="bank"><Building className="mr-2 h-4 w-4"/>Benki</TabsTrigger>
            <TabsTrigger value="cash"><Banknote className="mr-2 h-4 w-4"/>Taslimu</TabsTrigger>
          </TabsList>

          <TabsContent value="mpesa" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Toa kwa M-Pesa</CardTitle>
                <CardDescription>Fuata hatua hizi kutoa kupitia simu yako.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <dl className="space-y-1">
                  <InfoRow label="Nenda kwenye M-Pesa" value="*150*00#" />
                  <InfoRow label="Chagua" value="4. Lipa kwa M-Pesa" />
                  <InfoRow label="Namba ya Kampuni" value="123456" />
                  <InfoRow label="Kumbukumbu Namba" value="SADAKA" />
                </dl>
                <p className="text-xs text-center text-muted-foreground">Jina litaonekana kama HOLY SPIRIT CONNECT.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank" className="mt-4">
             <Card>
              <CardHeader>
                <CardTitle>Toa kwa Benki</CardTitle>
                <CardDescription>Weka pesa moja kwa moja kwenye akaunti yetu ya benki.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <dl className="space-y-1">
                  <InfoRow label="Jina la Akaunti" value="HSCM CONNECT" />
                  <InfoRow label="Namba ya Akaunti" value="0123456789012" />
                  <InfoRow label="Jina la Benki" value="CRDB Bank PLC" />
                  <InfoRow label="SWIFT Code" value="CORUTZTZ" />
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cash" className="mt-4">
             <Card>
              <CardHeader>
                <CardTitle>Toa kwa Pesa Taslimu</CardTitle>
                <CardDescription>Unaweza kutoa sadaka yako wakati wa ibada zetu.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                    Bahasha za sadaka zinapatikana wakati wote wa ibada zetu za Jumapili na katikati ya wiki. Waone wasimamizi wetu kwa msaada zaidi.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
}
