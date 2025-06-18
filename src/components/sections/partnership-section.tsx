
"use client";

import { Button } from '@/components/ui/button';
import { HeartHandshake, HelpingHand, Users, Handshake as PartnershipIcon } from 'lucide-react'; 

export function PartnershipSectionSw() {
  return (
    <section id="ushirika" className="py-16 md:py-20 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-headline font-bold text-4xl md:text-5xl text-foreground mb-6">
              KUWA SEHEMU YA 
              <span className="block text-primary">HADITHI</span>
            </h2>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Unapokuwa mshirika na HSCM, hauchangii tu—unawekeza katika maisha yanayobadilishwa. Ukarimu wako unatuwezesha kuipeleka Injili mbali zaidi na kujenga kanisa la karibu.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-12 mb-12 md:mb-16 items-start">
            <div className="space-y-8">
              {/* Financial Partnership - Example, repeat for Prayer and Volunteer */}
              <div className="bg-card rounded-xl p-6 md:p-8 border shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-hscm-red/10 dark:bg-hscm-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="h-6 w-6 text-hscm-red" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-xl text-foreground mb-3">
                      Mshirika wa Kifedha
                    </h3>
                    <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                      Saidia dhamira yetu kupitia utoaji wako. Kila mchango husaidia kupanua ufikiaji wetu.
                    </p>
                    <Button className="bg-hscm-red hover:bg-hscm-red/90 text-white font-body font-semibold">
                      Toa Sasa
                    </Button>
                  </div>
                </div>
              </div>
             
              <div className="bg-card rounded-xl p-6 md:p-8 border shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpingHand className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-xl text-foreground mb-3">
                      Mshirika wa Maombi
                    </h3>
                    <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                      Jiunge na timu yetu ya maombi kuombea huduma na jamii yetu.
                    </p>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body">
                      Jiunge na Timu ya Maombi
                    </Button>
                  </div>
                </div>
              </div>
              
               <div className="bg-card rounded-xl p-6 md:p-8 border shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-xl text-foreground mb-3">
                      Mshirika wa Kujitolea
                    </h3>
                    <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                      Tumia vipawa vyako kutumikia katika huduma mbalimbali na kuleta athari.
                    </p>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body">
                      Jitolee Leo
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <div className="bg-card dark:bg-neutral-dark/30 rounded-2xl p-8 border shadow-lg">
                <h3 className="font-headline font-bold text-2xl text-foreground mb-6 text-center">
                  Athari ya Ushirika Wako
                </h3>
                <div className="space-y-6 font-body">
                  {/* Partnership Tiers from PRD */}
                   <p className="text-center text-muted-foreground italic">Ungana na washirika 250+ wanaoleta mabadiliko duniani.</p>
                  <div className="text-center space-y-2 mt-4">
                    <p className="font-semibold text-primary">Ngazi za Ushirika:</p>
                    <p className="text-muted-foreground">Mshirika wa Maombi</p>
                    <p className="text-muted-foreground">Mshirika wa Maono</p>
                    <p className="text-muted-foreground">Mjenzi wa Ufalme</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-8 border shadow-lg text-center">
                <h3 className="font-headline font-semibold text-xl text-foreground mb-4">
                  Tayari Kuwa Mshirika?
                </h3>
                <p className="font-body text-muted-foreground mb-6">
                  Kuwa sehemu muhimu ya kile Mungu anachofanya kupitia HSCM Connect.
                </p>
                <Button
                  size="lg"
                  className="bg-hscm-gold hover:bg-hscm-gold/90 text-black font-body font-bold w-full px-8 py-4 text-lg"
                >
                  <PartnershipIcon className="mr-2 h-5 w-5" />
                  Anza Ushirika Wangu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Keep old export name for compatibility if needed
export { PartnershipSectionSw as PartnershipSection };
