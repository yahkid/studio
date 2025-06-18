
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wasifu Wako | HSCM Connect',
  description: 'Angalia na dhibiti maelezo yako ya wasifu.',
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-4">
            <User className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-3xl text-foreground">Wasifu Wako</CardTitle>
          </div>
          <CardDescription className="font-body">
            Hapa ndipo maelezo yako ya wasifu yataonekana. Sehemu hii bado inaandaliwa.
          </CardDescription>
        </CardHeader>
        <CardContent className="font-body text-muted-foreground">
          <p>
            Kwa sasa, unaweza kuona barua pepe yako kwenye menyu kunjuzi ya kichwa cha ukurasa.
            Vipengele zaidi vya kudhibiti wasifu vitapatikana hapa siku zijazo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
