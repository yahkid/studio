
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mipangilio ya Akaunti | HSCM Connect',
  description: 'Dhibiti mipangilio ya akaunti yako.',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <Card> {/* Removed shadow-xl */}
        <CardHeader>
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-3xl text-foreground">Mipangilio ya Akaunti</CardTitle>
          </div>
          <CardDescription className="font-body">
            Hapa ndipo utaweza kudhibiti mipangilio mbalimbali ya akaunti yako. Sehemu hii bado inaandaliwa.
          </CardDescription>
        </CardHeader>
        <CardContent className="font-body text-muted-foreground">
          <p>
            Vipengele vya kudhibiti mipangilio ya akaunti kama vile kubadilisha nenosiri,
            mapendeleo ya arifa, na zaidi vitapatikana hapa siku zijazo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
