
import { type Metadata } from 'next';
import Image from 'next/image';
import { Heart, Target, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Kuhusu Sisi | HSCM Connect',
  description: 'Jifunze zaidi kuhusu dhamira, maono, na maadili ya msingi ya Huduma ya Holy Spirit Connect.',
};

interface ValueCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

function ValueCard({ icon: Icon, title, children }: ValueCardProps) {
  return (
    <Card className="text-center">
      <CardHeader className="items-center">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-body text-muted-foreground">{children}</p>
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/herosection.png"
          alt="Community at HSCM Connect"
          fill
          style={{ objectFit: 'cover' }}
          quality={85}
          className="z-0 opacity-80"
          data-ai-hint="church community diverse"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <h1 className="font-headline text-4xl md:text-6xl mb-4">
            Kuhusu HSCM Connect
          </h1>
          <p className="font-body text-xl md:text-2xl text-slate-100 max-w-3xl mx-auto">
            Sisi ni familia ya kimataifa, iliyounganishwa na upendo na kusudi la Yesu Kristo.
          </p>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-headline text-3xl text-foreground flex items-center">
                <Target className="h-8 w-8 mr-3 text-primary" />
                Dhamira Yetu
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                Dhamira yetu ni kukuunganisha: wewe na Mungu, wewe na wengine, na wewe na kusudi lako tukufu. Tunajitahidi kushiriki nuru ya Yesu na kuleta tumaini, kuanzia hapa Tanzania hadi mwisho wa dunia, tukijenga jamii imara ya waumini wenye mabadiliko.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="font-headline text-3xl text-foreground flex items-center">
                <Eye className="h-8 w-8 mr-3 text-primary" />
                Maono Yetu
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                Tunatamani kuona ulimwengu ambapo kila mtu amekutana na upendo wa Yesu unaobadilisha, anatembea katika kusudi alilopewa na Mungu, na ni sehemu ya familia ya kanisa inayojali na kusaidia. Tunalenga kuwa kituo cha kimataifa cha uponyaji, tumaini, na uwezeshaji wa kiroho.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="py-12 md:py-20 bg-muted/30 border-t border-b">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl text-foreground text-center mb-12">
            Maadili Yetu ya Msingi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard icon={Heart} title="Upendo Kwanza">
              Kila kitu tunachofanya kinatokana na upendo wa Mungu na upendo kwa wengine. Sisi ni familia.
            </ValueCard>
            <ValueCard icon={Target} title="Kusudi la Kimungu">
              Tunaamini kila mtu ana kusudi la kipekee kutoka kwa Mungu. Tunakusaidia kuligundua na kuliishi.
            </ValueCard>
            <ValueCard icon={Eye} title="Imani Yenye Matendo">
              Imani yetu si ya maneno tu, bali inadhihirika katika matendo yetu ya huduma kwa jamii na ulimwengu.
            </ValueCard>
          </div>
        </div>
      </section>
    </div>
  );
}
