
"use client";

import { Button } from '@/components/ui/button';
import { GradientButton } from '@/components/ui/gradient-button';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventsSectionSwProps {
  onOpenVisitPlanner: () => void;
}

export function EventsSectionSw({ onOpenVisitPlanner }: EventsSectionSwProps) {
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
              <div className="bg-card rounded-xl p-6 md:p-8 border shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                <GradientButton 
                  onClick={onOpenVisitPlanner}
                  className="w-full font-headline"
                  suppressHydrationWarning={true}
                >
                  Panga Ujio Wako
                </GradientButton>
              </div>

              <div className="bg-card rounded-xl p-6 md:p-8 border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-secondary/10 dark:bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🙏</span> {/* Using emoji as per example */}
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
                  className="w-full font-headline border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  suppressHydrationWarning={true}
                >
                  Jiunge na Kikundi
                </Button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 md:space-y-8">
              <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-card dark:to-secondary/10 rounded-2xl p-6 md:p-8 border text-center shadow-lg">
                <h3 className="font-headline font-bold text-2xl text-foreground mb-6">
                  Matukio Yajayo
                </h3>
                
                <div className="space-y-4 text-left font-body">
                  <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                    <div>
                      <h4 className="font-semibold text-foreground">Crusade ya Matumaini</h4>
                      <p className="text-sm text-muted-foreground">Juni 25, 2025</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={onOpenVisitPlanner} suppressHydrationWarning={true}>Pata Taarifa</Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                    <div>
                      <h4 className="font-semibold text-foreground">Semina ya Vijana</h4>
                      <p className="text-sm text-muted-foreground">Julai 10, 2025</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={onOpenVisitPlanner} suppressHydrationWarning={true}>Pata Taarifa</Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-semibold text-foreground">Mkutano wa Familia</h4>
                      <p className="text-sm text-muted-foreground">Agosti 15, 2025</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={onOpenVisitPlanner} suppressHydrationWarning={true}>Pata Taarifa</Button>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 md:p-8 border shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <h3 className="font-headline font-semibold text-xl text-foreground mb-4">
                  Mpya katika HSCM?
                </h3>
                <p className="font-body text-muted-foreground mb-6">
                  Tunahitaji kufahamu zaidi kukuhusu ili tuweze kukusaidia kutafuta mahali pako katika familia yetu.
                </p>
                <GradientButton 
                  onClick={onOpenVisitPlanner}
                  className="w-full font-headline font-semibold"
                  suppressHydrationWarning={true}
                >
                  Panga Ujio Wako wa Kwanza
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
