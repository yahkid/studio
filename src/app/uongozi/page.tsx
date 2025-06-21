
import { type Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Uongozi Wetu | HSCM Connect',
  description: 'Kutana na timu ya uongozi iliyojitolea katika Huduma ya Holy Spirit Connect.',
};

const leaders = [
  {
    name: 'Rev. Innocent Morris',
    title: 'Mchungaji Kiongozi & Mwanzilishi',
    imageSrc: 'https://placehold.co/400x400.png',
    aiHint: 'portrait man pastor',
    bio: 'Rev. Innocent Morris ni mwanzilishi wa Holy Spirit Connect Ministry. Kwa shauku ya kuona maisha yakibadilishwa na Neno la Mungu, anaongoza huduma kwa maono na upendo, akihimiza kila mtu kugundua kusudi lake katika Kristo.',
  },
  {
    name: 'Jane Doe',
    title: 'Mkurugenzi wa Huduma za Watoto',
    imageSrc: 'https://placehold.co/400x400.png',
    aiHint: 'portrait woman teacher',
    bio: 'Jane anaongoza timu yetu ya watoto kwa ubunifu na kujitolea. Dhamira yake ni kujenga mazingira salama na ya kufurahisha ambapo watoto wanaweza kujifunza kumhusu Yesu na kukua katika imani yao tangu wakiwa wadogo.',
  },
  {
    name: 'John Smith',
    title: 'Kiongozi wa Ibada na Sifa',
    imageSrc: 'https://placehold.co/400x400.png',
    aiHint: 'portrait man musician',
    bio: 'John anaongoza timu yetu ya sifa na ibada kwa shauku kubwa ya kumleta Mungu utukufu kupitia muziki. Anajitahidi kuunda mazingira ya ibada ambapo watu wanaweza kukutana na uwepo wa Mungu kwa njia ya pekee.',
  },
    {
    name: 'Asha Juma',
    title: 'Mzee wa Kanisa & Mshauri',
    imageSrc: 'https://placehold.co/400x400.png',
    aiHint: 'portrait senior woman elder',
    bio: 'Asha ni nguzo ya hekima na maombi katika kanisa letu. Akiwa na uzoefu wa miaka mingi katika kutembea na Kristo, anatoa ushauri wa kiroho na uongozi kwa waumini, akisaidia kujenga msingi imara wa imani.',
  },
  {
    name: 'David Okello',
    title: 'Kiongozi wa Huduma za Jamii',
    imageSrc: 'https://placehold.co/400x400.png',
    aiHint: 'portrait man community leader',
    bio: 'David anaratibu jitihada zetu za kufikia jamii, akiongoza miradi inayolenga kuleta athari chanya na kushiriki upendo wa Kristo kwa vitendo. Anaamini katika kuwa mikono na miguu ya Yesu kwa wahitaji.',
  },
   {
    name: 'Fatuma Said',
    title: 'Mratibu wa Vikundi Vidogo',
    imageSrc: 'https://placehold.co/400x400.png',
    aiHint: 'portrait woman smiling',
    bio: 'Fatuma anahakikisha kila mshiriki anapata fursa ya kuwa sehemu ya jumuiya ndogo kwa ajili ya kukua kiroho na kujengana. Anasimamia vikundi vidogo ili kuhakikisha vinakuwa sehemu za ushirika wa kweli.',
  },
];

export default function LeadershipPage() {
  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">Uongozi Wetu</h1>
          <p className="font-body text-xl text-muted-foreground">
            Kutana na timu ya wachungaji na viongozi waliojitolea kuongoza na kulisha kundi la Mungu katika HSCM Connect kwa upendo na unyenyekevu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {leaders.map((leader, index) => (
            <Card key={index} className="flex flex-col items-center text-center overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <div className="w-full aspect-square relative">
                <Image
                  src={leader.imageSrc}
                  alt={`Picha ya ${leader.name}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="bg-muted"
                  data-ai-hint={leader.aiHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-foreground">{leader.name}</CardTitle>
                <CardDescription className="font-body text-primary font-semibold">{leader.title}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{leader.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
