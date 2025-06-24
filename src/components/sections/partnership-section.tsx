
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FinancialPartnerModal } from '@/components/modals/financial-partner-modal';
import { PrayerPartnerModal } from '@/components/modals/prayer-partner-modal';
import { VolunteerPartnerModal } from '@/components/modals/volunteer-partner-modal';
import { HandCoins, Sparkles, HandHeart, Users, TrendingUp, Heart, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PartnershipOption {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  action: () => void;
  buttonText: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
}

interface ImpactStat {
  value: string;
  label: string;
  Icon: React.ElementType;
  iconColorClass: string;
}

export function PartnershipSectionSw() {
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  const partnershipOptions: PartnershipOption[] = [
    { 
      id: 'financial', 
      title: 'Mshirika wa Kifedha', 
      icon: HandCoins, 
      description: 'Saidia dhamira yetu kwa mchango wako wa kifedha ili kupanua athari zetu.', 
      action: () => setIsFinancialModalOpen(true), 
      buttonText: 'Changia Sasa',
      buttonVariant: 'default',
    },
    { 
      id: 'prayer', 
      title: 'Mshirika wa Maombi', 
      icon: Sparkles, 
      description: 'Jiunge na timu yetu kuombea huduma, jamii, na mahitaji ya wengine.', 
      action: () => setIsPrayerModalOpen(true), 
      buttonText: 'Jiunge na Timu ya Maombi', 
      buttonVariant: 'outline',
    },
    { 
      id: 'volunteer', 
      title: 'Mshirika wa Kujitolea', 
      icon: HandHeart, 
      description: 'Tumia vipawa vyako kutumika katika huduma na kuleta mabadiliko maishani.', 
      action: () => setIsVolunteerModalOpen(true), 
      buttonText: 'Jitolee Leo', 
      buttonVariant: 'outline', 
    }
  ];

  const impactStats: ImpactStat[] = [
    { value: "500+", label: "Maisha Yaliyobadilishwa", Icon: Heart, iconColorClass: "text-primary" },
    { value: "250+", label: "Familia Zilizohudumiwa", Icon: Users, iconColorClass: "text-secondary" },
    { value: "50+", label: "Matukio ya Kijamii", Icon: TrendingUp, iconColorClass: "text-primary" },
    { value: "1000+", label: "Maombi Yaliyojibiwa", Icon: CheckCircle, iconColorClass: "text-secondary" },
  ];

  return (
    <>
      <motion.section 
        id="ushirika" 
        className="py-16 md:py-20 bg-muted/30 dark:bg-muted/10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-headline font-bold text-4xl md:text-5xl text-foreground mb-6">
                SHIRIKIANA NASI
                <span className="block text-primary">KULETA MABADILIKO</span>
              </h2>
              <p className="font-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Kila maisha yanayobadilishwa, kila familia inayoponywa, na kila jumuiya inayoinuliwa ni matokeo ya ushirika wetu. Tunapoungana pamoja—kwa maombi, kujitolea, na utoaji—tunaleta nuru ya Kristo kwa uhalisia.
              </p>
            </div>

            {/* Partnership Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
              {partnershipOptions.map((option) => (
                <Card key={option.id} className="flex flex-col">
                  <CardHeader className="items-center text-center">
                    <div className={`p-3 rounded-full bg-primary/10 dark:bg-primary/20 mb-4 inline-block`}>
                      <option.icon className={`h-10 w-10 ${option.id === 'financial' ? 'text-primary' : 'text-primary'}`} />
                    </div>
                    <CardTitle className="font-headline text-2xl">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow text-center">
                    <p className="font-body text-muted-foreground">{option.description}</p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button
                      onClick={option.action}
                      variant={option.buttonVariant || 'default'}
                      className="w-full sm:w-auto font-headline"
                      suppressHydrationWarning={true}
                    >
                      {option.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Impact Metrics Sub-section */}
            <div className="text-center py-12 md:py-16">
              <h3 className="font-headline text-3xl md:text-4xl text-foreground mb-10 md:mb-12">
                Athari ya Ushirika Wetu
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
                {impactStats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center">
                    <stat.Icon className={`h-12 w-12 mb-3 ${stat.iconColorClass}`} />
                    <p className={`font-headline font-bold text-4xl md:text-5xl ${stat.iconColorClass === 'text-primary' ? 'text-primary' : 'text-secondary' } mb-1`}>
                      {stat.value}
                    </p>
                    <p className="font-body text-muted-foreground text-center">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.section>
      <FinancialPartnerModal open={isFinancialModalOpen} onOpenChange={setIsFinancialModalOpen} />
      <PrayerPartnerModal open={isPrayerModalOpen} onOpenChange={setIsPrayerModalOpen} />
      <VolunteerPartnerModal open={isVolunteerModalOpen} onOpenChange={setIsVolunteerModalOpen} />
    </>
  );
}
