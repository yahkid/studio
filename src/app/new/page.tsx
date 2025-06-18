
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MapPin, Clock, Smile, Users, Baby, Coffee } from 'lucide-react';
import { VisitPlannerModal } from '@/components/modals/visit-planner-modal';

export default function MimiMgeniPage() {
  const [isVisitPlannerOpen, setIsVisitPlannerOpen] = useState(false);

  return (
    <>
      <div className="bg-background">
        {/* Welcome Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-hscm-gold/10 via-white to-hscm-green/10 dark:from-hscm-gold-dark-theme/10 dark:via-background dark:to-hscm-green-dark-theme/10">
          <div className="container mx-auto px-4 text-center">
            <Smile className="mx-auto h-16 w-16 text-hscm-gold mb-6" />
            <h1 className="font-headline text-4xl md:text-6xl text-foreground mb-6">
              Karibu HSCM Connect!
            </h1>
            <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Tunafurahi kuwa uko hapa na unafikiria kututembelea. Tunajua kutembelea kanisa jipya kunaweza kuwa tukio la kusisimua,
              na tunataka kufanya uzoefu wako wa kwanza nasi uwe wa kukaribisha na kustarehesha iwezekanavyo.
            </p>
            <Button 
              size="lg" 
              className="bg-hscm-green hover:bg-hscm-green/90 text-primary-foreground font-body font-semibold px-10 py-5 text-lg"
              onClick={() => setIsVisitPlannerOpen(true)}
              suppressHydrationWarning={true}
            >
              Panga Ujio Wako Leo
            </Button>
          </div>
        </section>

        {/* Service Times & Location Section */}
        <section className="py-12 md:py-16 border-t">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h2 className="font-headline text-3xl text-foreground mb-6 flex items-center">
                  <Clock className="h-8 w-8 mr-3 text-primary" />
                  Nyakati za Ibada
                </h2>
                <div className="font-body text-lg text-muted-foreground space-y-3 mb-6">
                  <p><strong>Ibada ya Jumapili:</strong> Saa 3:00 Asubuhi & Saa 5:00 Asubuhi</p>
                  <p><strong>Maombi ya Katikati ya Wiki:</strong> Jumatano Saa 1:00 Jioni</p>
                  <p>Tunakualika ujiunge nasi kwa wakati wa ibada yenye kuinua, jumbe zenye kuvutia, na ushirika wa joto.</p>
                </div>

                <h2 className="font-headline text-3xl text-foreground mb-6 mt-8 flex items-center">
                  <MapPin className="h-8 w-8 mr-3 text-primary" />
                  Mahali Petu
                </h2>
                <div className="font-body text-lg text-muted-foreground space-y-2">
                  <p>123 Mtaa wa Imani, Jiji la Huduma, JH 12345</p>
                  <p>Tuna maegesho ya kutosha yanayopatikana eneo letu.</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="Ramani ikionyesha eneo la HSCM Connect"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  data-ai-hint="map location church"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="py-12 md:py-16 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl md:text-4xl text-foreground text-center mb-10">
              Nini cha Kutarajia
            </h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-body text-lg hover:no-underline">
                  <Users className="h-5 w-5 mr-2 text-primary" /> Ibada ikoje?
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground text-base pl-7">
                  Ibada zetu ni za kusisimua na za kisasa, zikiwa na mchanganyiko wa nyimbo za kisasa za kuabudu na tenzi za kale.
                  Lengo letu ni kuunda mazingira ambapo unaweza kuungana na Mungu kikweli.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-body text-lg hover:no-underline">
                  <Baby className="h-5 w-5 mr-2 text-primary" /> Kuna nini kwa ajili ya watoto wangu?
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground text-base pl-7">
                  Tunawapenda watoto HSCM Connect! Tunatoa programu zinazovutia na zinazolingana na umri kwa watoto kuanzia chekechea hadi shule ya msingi wakati wa ibada zetu za Jumapili.
                  Watoto wako watajifunza kuhusu Mungu katika mazingira salama, ya kufurahisha, na yenye kulea.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="font-body text-lg hover:no-underline">
                  Nivae nini?
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground text-base pl-7">
                  Njoo ulivyo! Utakuta mitindo mbalimbali katika ibada zetu, kuanzia mavazi ya kawaida hadi yale ya kupendeza zaidi.
                  Tunajali zaidi wewe kuungana na Mungu kuliko unachovaa.
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-4">
                <AccordionTrigger className="font-body text-lg hover:no-underline">
                  <Coffee className="h-5 w-5 mr-2 text-primary" /> Kuna kahawa?
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground text-base pl-7">
                  Bila shaka! Tunakualika ujiunge nasi kwa kahawa na ushirika kabla au baada ya ibada.
                  Ni njia nzuri ya kukutana na watu na kuunganishwa.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-20 text-center border-t">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl text-foreground mb-6">
              Uko Tayari Kupata Uzoefu wa HSCM Connect?
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Tunatarajia kukutana nawe! Bofya kitufe hapa chini kutujulisha unakuja au kama una maswali yoyote.
            </p>
            <Button
              size="lg"
              className="bg-hscm-green hover:bg-hscm-green/90 text-primary-foreground font-body font-semibold px-12 py-5 text-lg"
              onClick={() => setIsVisitPlannerOpen(true)}
              suppressHydrationWarning={true}
            >
              Tujulishe Unakuja
            </Button>
          </div>
        </section>
      </div>
      <VisitPlannerModal open={isVisitPlannerOpen} onOpenChange={setIsVisitPlannerOpen} />
    </>
  );
}
