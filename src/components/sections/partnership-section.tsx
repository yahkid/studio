
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FinancialPartnerModal } from '@/components/modals/financial-partner-modal';
import { PrayerPartnerModal } from '@/components/modals/prayer-partner-modal';
import { VolunteerPartnerModal } from '@/components/modals/volunteer-partner-modal';
import { ExpandableTabs } from '@/components/ui/expandable-tabs'; // Import ExpandableTabs
import { HandCoins, Sparkles, HandHeart } from 'lucide-react'; // Import icons
import type { LucideIcon } from 'lucide-react';

interface PartnershipOption {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  action: () => void;
  buttonText: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  buttonClass?: string;
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
      description: 'Unga mkono dhamira yetu kupitia kuchangia mara kwa mara, tukisaidia kupanua mwelekeo wetu na athari katika jamii.', 
      action: () => setIsFinancialModalOpen(true), 
      buttonText: 'Changia Sasa', 
      buttonVariant: 'default', 
      buttonClass: 'bg-hscm-red hover:bg-hscm-red/90 text-white font-body font-semibold' 
    },
    { 
      id: 'prayer', 
      title: 'Mshirika wa Maombi', 
      icon: Sparkles, 
      description: 'Jiunge na timu yetu ya maombi na uombee huduma yetu, jamii, na mahitaji ya wale tunaowawakilisha.', 
      action: () => setIsPrayerModalOpen(true), 
      buttonText: 'Jiunge na Timu ya Maombi', 
      buttonVariant: 'outline', 
      buttonClass: 'border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body' 
    },
    { 
      id: 'volunteer', 
      title: 'Mshirika wa Kujitolea', 
      icon: HandHeart, 
      description: 'Tumia vipawa na talanta zako kutumika katika huduma mbalimbali na kuwa na athari ya moja kwa moja katika maisha ya watu.', 
      action: () => setIsVolunteerModalOpen(true), 
      buttonText: 'Jitolee Leo', 
      buttonVariant: 'outline', 
      buttonClass: 'border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body' 
    }
  ];

  const [selectedPartnership, setSelectedPartnership] = useState<PartnershipOption | null>(partnershipOptions[0]); // Default to first option selected

  const expandableTabsItems = partnershipOptions.map(p => ({ title: p.title, icon: p.icon }));

  const handleTabChange = (index: number | null) => {
    if (index !== null) {
      setSelectedPartnership(partnershipOptions[index]);
    } else {
      // Optionally, clear selection or default to first if clicks outside deselect
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
              {/* Left Column: Expandable Tabs and Selected Partnership Details */}
              <div className="space-y-8">
                <div className="flex justify-center lg:justify-start">
                  <ExpandableTabs tabs={expandableTabsItems} onChange={handleTabChange} />
                </div>

                {selectedPartnership && (
                  <div className="mt-6 bg-card rounded-xl p-6 md:p-8 border shadow-lg animate-fadeIn">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${selectedPartnership.id === 'financial' ? 'bg-hscm-red/10 dark:bg-hscm-red/20' : 'bg-primary/10 dark:bg-primary/20'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <selectedPartnership.icon className={`w-6 h-6 ${selectedPartnership.id === 'financial' ? 'text-hscm-red' : 'text-primary'}`} />
                      </div>
                      <div>
                        <h3 className="font-headline font-semibold text-xl text-foreground mb-3">
                          {selectedPartnership.title}
                        </h3>
                        <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                          {selectedPartnership.description}
                        </p>
                        <Button 
                          onClick={selectedPartnership.action}
                          variant={selectedPartnership.buttonVariant || 'default'}
                          className={selectedPartnership.buttonClass}
                          suppressHydrationWarning={true}
                        >
                          {selectedPartnership.buttonText}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Impact Stats and Final CTA (remains largely unchanged) */}
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-card dark:to-secondary/10 rounded-2xl p-8 border shadow-lg">
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

                <div className="bg-card rounded-xl p-8 border shadow-lg text-center">
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
                      <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80 px-2 py-1 rounded">Mshirika wa Maombi</span>
                      <span className="bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary/80 px-2 py-1 rounded">Mshirika wa Maono</span>
                      <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80 px-2 py-1 rounded">Mjenzi wa Ufalme</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setIsFinancialModalOpen(true)} // Opens Financial Partner modal as primary CTA
                    size="lg"
                    className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-headline font-semibold"
                    suppressHydrationWarning={true}
                  >
                    Anza Ushirika Wangu
                  </Button>
                </div>
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

// Basic fade-in animation for the selected partnership details
// Add this to your globals.css or a relevant CSS file if you want a smoother transition
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out forwards;
// }
// For Tailwind, you can define it in tailwind.config.js
// theme: {
//   extend: {
//     keyframes: {
//       fadeIn: {
//         '0%': { opacity: '0', transform: 'translateY(10px)' },
//         '100%': { opacity: '1', transform: 'translateY(0)' },
//       },
//     },
//     animation: {
//       fadeIn: 'fadeIn 0.3s ease-out forwards',
//     },
//   },
// },

