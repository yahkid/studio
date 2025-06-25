
"use client";

import { useState } from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VolunteerPartnerModal } from '@/components/modals/volunteer-partner-modal';
import {
  Briefcase,
  Clapperboard,
  Server,
  Megaphone,
  HeartHandshake,
  Mountain,
  Music,
  Shield,
  BarChartBig,
  Users
} from 'lucide-react';

// Client components cannot export metadata directly.
// If needed, move to a parent Server Component or layout.
// export const metadata: Metadata = {
//   title: 'Kutumika | HSCM Connect',
//   description: 'Gundua idara mbalimbali za huduma katika HSCM Connect na utafute mahali pako pa kutumika.',
// };

export interface Department {
  name: string;
  icon: React.ElementType;
  description: string;
  roles: string[];
}

const departments: Department[] = [
  {
    name: 'Utawala (Administration)',
    icon: Briefcase,
    description: 'Husaidia katika uratibu wa kila siku na usimamizi wa shughuli za kanisa ili kuhakikisha kila kitu kinakwenda sawa.',
    roles: ['Utawala wa Ofisi', 'Uingizaji Data', 'Uratibu wa Matukio', 'Mawasiliano'],
  },
  {
    name: 'Rasilimali Watu (Human Resources)',
    icon: Users,
    description: 'Inasimamia ustawi wa wafanyakazi na wanaojitolea, ikiwa ni pamoja na kuajiri, mafunzo, na kukuza utamaduni mzuri wa huduma.',
    roles: ['Uajiri wa Wanaojitolea', 'Mafunzo na Maendeleo', 'Mahusiano ya Wafanyakazi', 'Utunzaji wa Rekodi'],
  },
  {
    name: 'Uzalishaji (Production)',
    icon: Clapperboard,
    description: 'Timu ya ubunifu inayosimamia sauti, video, na picha ili kuhakikisha ujumbe wetu unafika kwa ubora wa hali ya juu.',
    roles: ['Uhandisi wa Sauti', 'Uendeshaji wa Kamera za Video', 'Uhariri wa Video', 'Usanifu wa Picha (Graphics)', 'Uhuishaji (Animation)', 'Uendeshaji wa Taa'],
  },
  {
    name: 'Teknolojia ya Habari (IT)',
    icon: Server,
    description: 'Inasimamia mifumo ya kidijitali ya kanisa, kutoka kwa tovuti hadi mitandao, kuhakikisha muunganiko thabiti.',
    roles: ['Msaada wa Mtandao', 'Msaada wa Tovuti na App', 'Msaada wa Vifaa', 'Usaidizi wa Matangazo ya Moja kwa Moja (Live Stream)'],
  },
  {
    name: 'Uinjilisti na Ufikiaji (Outreach)',
    icon: Megaphone,
    description: 'Hupeleka Habari Njema kwa jamii yetu kupitia matukio mbalimbali na huduma za ufikiaji.',
    roles: ['Ufikiaji wa Jamii', 'Timu za Uinjilisti', 'Timu ya Ufuatiliaji', 'Upangaji wa Matukio ya Ufikiaji'],
  },
  {
    name: 'Hospitality (Matendo ya Rehema)',
    icon: HeartHandshake,
    description: 'Inadhihirisha upendo wa Kristo kwa vitendo kwa kuwakaribisha wageni na kusaidia wenye mahitaji katika jamii yetu, na kuunda mazingira ya joto kwa wote.',
    roles: ['Timu ya Ukaribishaji', 'Maandalizi ya Matukio', 'Msaada kwa Wageni Wapya', 'Huduma ya Vinywaji'],
  },
  {
    name: 'Mlima wa Maombi',
    icon: Mountain,
    description: 'Nguzo ya maombi ya kanisa, timu hii husimama katika maombi kwa ajili ya kanisa, viongozi, na mahitaji ya watu.',
    roles: ['Timu ya Maombezi', 'Mlolongo wa Maombi', 'Huduma ya Madhabahuni wakati wa maombi'],
  },
  {
    name: 'Sifa na Kuabudu',
    icon: Music,
    description: 'Huongoza kanisa katika ibada za kusisimua na za kina, na kuunda mazingira ya kukutana na Mungu.',
    roles: ['Mwimbaji', 'Mpiga Kinanda (Keyboard)', 'Mpiga Gitaa', 'Mpiga Ngoma (Drums)', 'Mpiga Gitaa la Besi (Bass)'],
  },
  {
    name: 'Usafiri na Usalama',
    icon: Shield,
    description: 'Huhakikisha usalama na mpangilio mzuri wa washiriki na wageni wote wakati wa ibada na matukio.',
    roles: ['Timu ya Maegesho', 'Timu ya Usalama', 'Wakaribishaji na Wasindikizaji', 'Timu ya Huduma ya Kwanza'],
  },
  {
    name: 'Idara ya Maendeleo',
    icon: BarChartBig,
    description: 'Hupanga na kutekeleza mikakati ya ukuaji na maendeleo endelevu ya huduma kwa siku zijazo.',
    roles: ['Usimamizi wa Miradi', 'Utafutaji wa Fedha na Ruzuku', 'Mipango Mkakati', 'Uendelezaji wa Ushirika'],
  },
];

export default function ServePage() {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const handleOpenModal = (department: Department) => {
    setSelectedDepartment(department);
  };

  const handleCloseModal = () => {
    setSelectedDepartment(null);
  };
  
  const isModalOpen = !!selectedDepartment;

  return (
    <>
      <div className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
             <Users className="mx-auto h-16 w-16 text-primary mb-6" />
            <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">Pata Mahali Pako pa Kutumika</h1>
            <p className="font-body text-xl text-muted-foreground">
              Tunaamini kila mtu ana karama ya kipekee kutoka kwa Mungu. Gundua idara zetu na uone ni wapi unaweza kutumia vipawa vyako kubariki wengine na kukua katika safari yako ya kiroho.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {departments.map((dept, index) => (
              <Card key={index} className="flex flex-col text-center overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out">
                <CardHeader className="items-center">
                   <div className="p-4 bg-primary/10 rounded-full mb-4">
                     <dept.icon className="h-8 w-8 text-primary" />
                   </div>
                  <CardTitle className="font-headline text-xl text-foreground">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">{dept.description}</p>
                </CardContent>
                <CardContent>
                  <Button onClick={() => handleOpenModal(dept)} className="w-full font-headline" suppressHydrationWarning={true}>
                    Jiunge na Timu Hii
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

           <div className="text-center mt-16">
              <h2 className="font-headline text-3xl text-foreground mb-4">Huna uhakika wapi pa kuanzia?</h2>
              <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Usijali! Wasiliana nasi na tutakusaidia kugundua karama zako na kupata eneo linalokufaa zaidi.
              </p>
              <Button onClick={() => handleOpenModal({ name: 'General Interest', description: '', icon: HeartHandshake, roles: [] })} size="lg" className="font-headline" suppressHydrationWarning={true}>
                Ongea Nasi Kuhusu Kujitolea
              </Button>
            </div>
        </div>
      </div>
      <VolunteerPartnerModal
        open={isModalOpen}
        onOpenChange={(open) => !open && handleCloseModal()}
        department={selectedDepartment}
      />
    </>
  );
}
