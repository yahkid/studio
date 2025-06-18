
"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { initialEventsData } from '@/lib/events-data';
import { format, parseISO, isValid } from 'date-fns';
// import { sw } from 'date-fns/locale'; // Removed problematic import
import Link from 'next/link';

interface EventsSectionSwProps {
  onOpenVisitPlanner: () => void;
}

export function EventsSectionSw({ onOpenVisitPlanner }: EventsSectionSwProps) {
  const upcomingEvents = initialEventsData
    .map(event => ({
      ...event,
      parsedDate: parseISO(event.date)
    }))
    .filter(event => isValid(event.parsedDate) && event.parsedDate.getTime() >= new Date().setHours(0,0,0,0)) // Filter for today or future
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())
    .slice(0, 3);

  return (
    <section id="matukio" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-headline font-bold text-4xl md:text-5xl text-foreground mb-6">
              MAISHA NI BORA
              <span className="block text-primary">PAMOJA</span>
            </h2>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Kuna nafasi kwa ajili yako daima. Gundua ibada, mikutano, na matukio yetu yajayo, 
              na uwe sehemu ya jamii yetu changamfu.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-12 mb-12 md:mb-16 items-start">
            {/* Left Column */}
            <div className="space-y-6 md:space-y-8">
              <Card className="p-0 overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline font-semibold text-xl text-foreground mb-2">
                        Ibada ya Jumapili
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-muted-foreground text-sm mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Saa 3:00 Asbh & Saa 5:00 Asbh</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>123 Faith St, Ministry City</span>
                        </div>
                      </div>
                      <p className="font-body text-muted-foreground leading-relaxed">
                        Jiunge nasi kwa ibada yenye nguvu, nyimbo za kusifu, na mafundisho yenye maana. 
                        Karibu kwa kila mmoja—bila kujali umefika wapi katika safari yako ya imani.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={onOpenVisitPlanner}
                    className="w-full font-headline"
                    suppressHydrationWarning={true}
                  >
                    Panga Ujio Wako
                  </Button>
                </div>
              </Card>

              <Card className="p-0 overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-secondary/10 dark:bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🙏</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline font-semibold text-xl text-foreground mb-2">
                        Kikundi cha Maombi
                      </h3>
                      <div className="flex items-center space-x-4 text-muted-foreground text-sm mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Jumatatu Saa 1:00 Jioni</span>
                        </div>
                      </div>
                      <p className="font-body text-muted-foreground leading-relaxed">
                        Kila Jumatatu, tunakutana kwa maombi makuu ya kujikabidhi. Njoo uwe sehemu ya 
                        jamii inayoombea mahitaji ya kanisa na jamii.
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={onOpenVisitPlanner}
                    className="w-full font-headline"
                    suppressHydrationWarning={true}
                  >
                    Jiunge na Kikundi
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6 md:space-y-8">
              <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-card dark:to-secondary/10 rounded-2xl text-center p-0 overflow-hidden">
                <div className="p-6 md:p-8">
                  <h3 className="font-headline font-bold text-2xl text-foreground mb-6">
                    Matukio Yajayo
                  </h3>
                  
                  <div className="space-y-4 text-left font-body">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map(event => (
                        <div key={event.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                          <div>
                            <h4 className="font-semibold text-foreground">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {isValid(event.parsedDate) ? format(event.parsedDate, "MMMM d, yyyy") : 'Tarehe Batili'}
                            </p>
                          </div>
                          <Button asChild size="sm" variant="outline" suppressHydrationWarning={true}>
                            <Link href="/matukio">Pata Taarifa</Link>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center">Hakuna matukio yajayo kwa sasa.</p>
                    )}
                  </div>
                  {upcomingEvents.length > 0 && (
                     <Button asChild variant="link" className="mt-6 font-body" suppressHydrationWarning={true}>
                       <Link href="/matukio">Tazama Kalenda Kamili &rarr;</Link>
                     </Button>
                  )}
                </div>
              </Card>

              <Card className="text-center p-0 overflow-hidden">
                 <div className="p-6 md:p-8">
                  <h3 className="font-headline font-semibold text-xl text-foreground mb-4">
                    Mpya katika HSCM?
                  </h3>
                  <p className="font-body text-muted-foreground mb-6">
                    Tunahitaji kufahamu zaidi kukuhusu ili tuweze kukusaidia kutafuta mahali pako katika familia yetu.
                  </p>
                  <Button 
                    onClick={onOpenVisitPlanner}
                    className="w-full font-headline font-semibold"
                    suppressHydrationWarning={true}
                  >
                    Panga Ujio Wako wa Kwanza
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
