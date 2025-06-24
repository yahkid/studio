
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MapPin, Clock, Smile, Users, Baby, Coffee } from 'lucide-react';
import { VisitPlannerModal } from '@/components/modals/visit-planner-modal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function MimiMgeniPage() {
  const [isVisitPlannerOpen, setIsVisitPlannerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="bg-background">
        {/* Welcome Section */}
        <section className="relative py-24 md:py-32 flex items-center justify-center text-center overflow-hidden">
          <Image
            src="/DSC00243.jpg"
            alt="Welcome to HSCM Connect background"
            fill
            style={{ objectFit: 'cover' }}
            quality={85}
            className="z-0"
            data-ai-hint="church interior worship"
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="relative z-20 container mx-auto px-4 text-center text-white">
             <Smile className="mx-auto h-16 w-16 text-secondary mb-6" />
            <h1 className="font-headline text-4xl md:text-6xl mb-6">
              KARIBU NYUMBANI
            </h1>
            <p className="font-body text-xl md:text-2xl text-slate-100 max-w-3xl mx-auto mb-8">
              Tunajua kutafuta kanisa jipya inaweza kuwa changamoto. Sisi ni familia isiyo kamilifu lakini yenye upendo, na tungependa kukutana nawe. Hapa kuna kila kitu unachohitaji kujua kabla ya kututembelea.
            </p>
            <Button 
              onClick={() => setIsVisitPlannerOpen(true)}
              suppressHydrationWarning={true}
              size="lg" 
              className="font-headline text-lg"
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
                  <p>Barabara ya Nyerere, DSM</p>
                  <p>
                    <a
                      href="https://maps.app.goo.gl/5z3dGxia6ZDKoiMo7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Tazama Kwenye Ramani &rarr;
                    </a>
                  </p>
                  <p>Tuna maegesho ya kutosha yanayopatikana eneo letu.</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border">
                <Image
                  src="/Picsart_25-06-19_09-19-42-630.jpg"
                  alt="Exterior of the HSCM Connect church building"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover p-4"
                  data-ai-hint="church building exterior"
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
            {!mounted ? (
              <div className="w-full max-w-3xl mx-auto space-y-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : (
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
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-20 text-center border-t">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl text-foreground mb-6">
              Uko Tayari Kupata Uzoefu wa HSCM Connect?
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
             Tunatamani sana kukutana nawe! Bofya kitufe hapa chini ili kupanga ujio wako au kama una maswali yoyote. Tuko hapa kukusaidia!
            </p>
            <Button
              onClick={() => setIsVisitPlannerOpen(true)}
              suppressHydrationWarning={true}
              size="lg"
              className="text-lg font-headline"
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
