
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
// import { GradientButton } from '@/components/ui/gradient-button'; // Removed
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FinancialPartnerModal } from '@/components/modals/financial-partner-modal';
import { PrayerPartnerModal } from '@/components/modals/prayer-partner-modal';
import { VolunteerPartnerModal } from '@/components/modals/volunteer-partner-modal';
import { HandCoins, Sparkles, HandHeart, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton'; 
import { motion, AnimatePresence } from 'framer-motion';
import { ExpandableTabs } from "@/components/ui/expandable-tabs"; // Keep this for the reverted version logic

interface PartnershipOption {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  action: () => void;
  buttonText: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
}

export function PartnershipSectionSw() {
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState<PartnershipOption | null>(null);


  const partnershipOptions: PartnershipOption[] = [
    { 
      id: 'financial', 
      title: 'Mshirika wa Kifedha', 
      icon: HandCoins, 
      description: 'Unga mkono dhamira yetu kupitia kuchangia mara kwa mara, tukisaidia kupanua mwelekeo wetu na athari katika jamii.', 
      action: () => setIsFinancialModalOpen(true), 
      buttonText: 'Changia Sasa',
      buttonVariant: 'default',
    },
    { 
      id: 'prayer', 
      title: 'Mshirika wa Maombi', 
      icon: Sparkles, 
      description: 'Jiunge na timu yetu ya maombi na uombee huduma yetu, jamii, na mahitaji ya wale tunaowawakilisha.', 
      action: () => setIsPrayerModalOpen(true), 
      buttonText: 'Jiunge na Timu ya Maombi', 
      buttonVariant: 'outline',
    },
    { 
      id: 'volunteer', 
      title: 'Mshirika wa Kujitolea', 
      icon: HandHeart, 
      description: 'Tumia vipawa na talanta zako kutumika katika huduma mbalimbali na kuwa na athari ya moja kwa moja katika maisha ya watu.', 
      action: () => setIsVolunteerModalOpen(true), 
      buttonText: 'Jitolee Leo', 
      buttonVariant: 'outline', 
    }
  ];
  
  useEffect(() => {
    setMounted(true);
    // Set initial selection to the first partnership option if not already set
    if (!selectedPartnership && partnershipOptions.length > 0) {
      setSelectedPartnership(partnershipOptions[0]);
    }
  }, [selectedPartnership, partnershipOptions]);


  if (!mounted) {
    return (
      <section id="ushirika" className="py-16 md:py-20 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <Skeleton className="h-10 w-3/4 mx-auto mb-6" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
            <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-start">
              <div className="space-y-8">
                {/* Placeholder for partnership options */}
                <Card className="p-0 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
                 <div className="mt-8 p-6 border rounded-lg min-h-[150px]">
                   <Skeleton className="h-6 w-3/4 mb-2" />
                   <Skeleton className="h-4 w-full mb-4" />
                   <Skeleton className="h-4 w-full mb-4" />
                   <Skeleton className="h-10 w-1/2" />
                 </div>
              </div>
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-card dark:to-secondary/10 rounded-2xl p-0 overflow-hidden">
                  <div className="p-8">
                    <Skeleton className="h-8 w-3/4 mx-auto mb-6" />
                    <div className="space-y-6">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-5 w-1/3" />
                          <Skeleton className="h-8 w-1/4" />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
                <Card className="text-center p-0 overflow-hidden">
                  <div className="p-8">
                    <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-6 w-1/2 mx-auto mb-4" />
                    <Skeleton className="h-4 w-full mb-6" />
                    <div className="space-y-3 mb-4">
                      <Skeleton className="h-4 w-1/2 mx-auto" />
                      <div className="grid grid-cols-3 gap-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    </div>
                    <Skeleton className="h-12 w-full" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const tabItems = partnershipOptions.map(option => ({
    title: option.title,
    icon: option.icon,
  }));

  const handleTabChange = (index: number | null) => {
    if (index !== null && partnershipOptions[index]) {
      setSelectedPartnership(partnershipOptions[index]);
    } else {
      setSelectedPartnership(null);
    }
  };


  return (
    <>
      <section id="ushirika" className="py-16 md:py-20 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-headline font-bold text-4xl md:text-5xl text-foreground mb-6">
                KUWA SEHEMU YA
                <span className="block text-primary">HADITHI</span>
              </h2>
              <p className="font-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Unapokuwa mshirika na HSCM, hauchangii tu—unawekeza katika maisha yanayobadilishwa. 
                Ukarimu wako unatuwezesha kuipeleka Injili mbali zaidi na kujenga kanisa la karibu.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 md:gap-12 mb-12 md:mb-16 items-start">
              {/* Left Column: Partnership Options */}
              <div className="space-y-8">
                <div className="flex justify-center lg:justify-start">
                  <ExpandableTabs tabs={tabItems} onChange={handleTabChange} />
                </div>

                <AnimatePresence mode="wait">
                  {selectedPartnership && (
                    <motion.div
                      key={selectedPartnership.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mt-8 p-6 border rounded-lg bg-card" // Added bg-card for better visibility
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        <div className={`w-10 h-10 ${selectedPartnership.id === 'financial' ? 'bg-hscm-red/10 dark:bg-hscm-red/20' : 'bg-primary/10 dark:bg-primary/20'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <selectedPartnership.icon className={`w-5 h-5 ${selectedPartnership.id === 'financial' ? 'text-hscm-red' : 'text-primary'}`} />
                        </div>
                        <h3 className="font-headline text-xl text-foreground pt-1.5">{selectedPartnership.title}</h3>
                      </div>
                      <p className="font-body text-muted-foreground mb-6">{selectedPartnership.description}</p>
                      <Button
                        onClick={selectedPartnership.action}
                        variant={selectedPartnership.buttonVariant || 'default'}
                        className="w-full font-body font-semibold"
                        suppressHydrationWarning={true}
                      >
                        {selectedPartnership.buttonText}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column: Impact Stats & Final CTA */}
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-card dark:to-secondary/10 rounded-2xl p-0 overflow-hidden">
                   <div className="p-8"> {/* Padding applied to inner div */}
                    <h3 className="font-headline font-bold text-2xl text-foreground mb-6 text-center">
                      Athari ya Ushirika
                    </h3>
                    
                    <div className="space-y-6 font-body">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Maisha Yaliyobadilishwa</span>
                        <span className="font-headline font-bold text-2xl text-primary">
                          500+
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Familia Zilizohudumika</span>
                        <span className="font-headline font-bold text-2xl text-secondary">
                          250+
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Matukio ya Kijamii</span>
                        <span className="font-headline font-bold text-2xl text-primary">
                          50+
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Maombi Yaliyojibiwa</span>
                        <span className="font-headline font-bold text-2xl text-secondary">
                          1000+
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="text-center p-0 overflow-hidden">
                  <div className="p-8"> {/* Padding applied to inner div */}
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2 font-body">
                        Ungana na washirika 250+ wanaoleta mabadiliko duniani
                      </p>
                    </div>
                    
                    <h3 className="font-headline font-semibold text-xl text-foreground mb-4">
                      Tayari Kuwa Mshirika Nasi?
                    </h3>
                    <p className="text-muted-foreground mb-6 font-body">
                      Anza leo na uwe sehemu ya kitu kikuu kuliko wewe mwenyewe.
                    </p>
                    
                    <div className="space-y-3 font-body">
                      <div className="text-sm text-muted-foreground">
                        Chagua aina ya ushirika:
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80 px-2 py-1 rounded-md">Mshirika wa Maombi</span>
                        <span className="bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary/80 px-2 py-1 rounded-md">Mshirika wa Maono</span>
                        <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80 px-2 py-1 rounded-md">Mjenzi wa Ufalme</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setIsFinancialModalOpen(true)}
                      className="w-full mt-6 font-headline font-semibold"
                      suppressHydrationWarning={true}
                    >
                      Anza Ushirika Wangu
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FinancialPartnerModal open={isFinancialModalOpen} onOpenChange={setIsFinancialModalOpen} />
      <PrayerPartnerModal open={isPrayerModalOpen} onOpenChange={setIsPrayerModalOpen} />
      <VolunteerPartnerModal open={isVolunteerModalOpen} onOpenChange={setIsVolunteerModalOpen} />
    </>
  );
}
