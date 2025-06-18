
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mipangilio ya Akaunti | HSCM Connect',
  description: 'Dhibiti mipangilio ya akaunti yako, ikiwa ni pamoja na barua pepe, nambari ya simu, na nenosiri.',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-3xl text-foreground">Mipangilio ya Akaunti</CardTitle>
          </div>
          <CardDescription className="font-body">
            Hapa ndipo mahali pa kudhibiti maelezo ya wasifu wako. Unaweza kubadilisha anwani yako ya barua pepe, nambari ya simu, na nenosiri.
          </CardDescription>
        </CardHeader>
        <CardContent className="font-body text-muted-foreground">
          <p>
            Sehemu hii bado inaandaliwa. Hivi karibuni, utaweza kutumia fomu maalum kubadilisha maelezo yako moja kwa moja hapa.
            Kwa sasa, mabadiliko muhimu ya akaunti yanaweza kuhitaji usaidizi wa moja kwa moja.
          </p>
          <p className="mt-4">
            Vipengele vya ziada, kama vile mapendeleo ya arifa na mipangilio mingine, vitaongezwa pia siku zijazo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
