
"use client";

import { Button } from '@/components/ui/button';
// Note: Lucide icons are no longer used in this version as per the provided code. Emojis are used instead.

export function PartnershipSectionSw() {
  return (
    <section id="ushirika" className="py-16 md:py-20 bg-muted/30 dark:bg-muted/10"> {/* Adjusted padding to match previous version */}
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16"> {/* Adjusted margin to match previous version */}
            <h2 className="font-headline font-bold text-4xl md:text-5xl text-foreground mb-6"> {/* Used font-headline and adjusted text size */}
              KUWA SEHEMU YA
              <span className="block text-primary">HADITHI</span> {/* Used text-primary for accent */}
            </h2>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"> {/* Used font-body and adjusted text size */}
              Unapokuwa mshirika na HSCM, hauchangii tu—unawekeza katika maisha yanayobadilishwa. 
              Ukarimu wako unatuwezesha kuipeleka Injili mbali zaidi na kujenga kanisa la karibu.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-12 mb-12 md:mb-16 items-start"> {/* Adjusted gap and margin */}
            <div className="space-y-8">
              <div className="bg-card rounded-xl p-6 md:p-8 border shadow-lg"> {/* Adjusted padding */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-hscm-red/10 dark:bg-hscm-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💝</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-xl text-foreground mb-3"> {/* Used font-headline */}
                      Mshirika wa Kifedha
                    </h3>
                    <p className="font-body text-muted-foreground mb-4 leading-relaxed"> {/* Used font-body */}
                      Unga mkono dhamira yetu kupitia kuchangia mara kwa mara, tukisaidia kupanua 
                      mwelekeo wetu na athari katika jamii.
                    </p>
                    <Button 
                      className="bg-hscm-red hover:bg-hscm-red/90 text-white font-body font-semibold" /* Adjusted for hscm-red and font-body */
                      suppressHydrationWarning={true}
                    >
                      Changia Sasa
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 md:p-8 border shadow-lg"> {/* Adjusted padding */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0"> {/* Used primary for consistency */}
                    <span className="text-2xl">🙏</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-xl text-foreground mb-3"> {/* Used font-headline */}
                      Mshirika wa Maombi
                    </h3>
                    <p className="font-body text-muted-foreground mb-4 leading-relaxed"> {/* Used font-body */}
                      Jiunge na timu yetu ya maombi na uombee huduma yetu, jamii, 
                      na mahitaji ya wale tunaowawakilisha.
                    </p>
                    <Button 
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body" /* Used primary and font-body */
                      suppressHydrationWarning={true}
                    >
                      Jiunge na Timu ya Maombi
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 md:p-8 border shadow-lg"> {/* Adjusted padding */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0"> {/* Used primary for consistency */}
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-xl text-foreground mb-3"> {/* Used font-headline */}
                      Mshirika wa Kujitolea
                    </h3>
                    <p className="font-body text-muted-foreground mb-4 leading-relaxed"> {/* Used font-body */}
                      Tumia vipawa na talanta zako kutumika katika huduma mbalimbali na 
                      kuwa na athari ya moja kwa moja katika maisha ya watu.
                    </p>
                    <Button 
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body" /* Used primary and font-body */
                      suppressHydrationWarning={true}
                    >
                      Jitolee Leo
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-card dark:to-secondary/10 rounded-2xl p-8 border shadow-lg"> {/* Adjusted gradient and padding */}
                <h3 className="font-headline font-bold text-2xl text-foreground mb-6 text-center"> {/* Used font-headline */}
                  Athari ya Ushirika
                </h3>
                
                <div className="space-y-6 font-body"> {/* Used font-body */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Maisha Yaliyobadilishwa</span>
                    <span className="font-headline font-bold text-2xl text-primary"> {/* Used font-headline and primary color */}
                      500+
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Familia Zilizohudumika</span>
                    <span className="font-headline font-bold text-2xl text-secondary"> {/* Used font-headline and secondary color */}
                      250+
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Matukio ya Kijamii</span>
                    <span className="font-headline font-bold text-2xl text-primary"> {/* Used font-headline and primary color */}
                      50+
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Maombi Yaliyojibiwa</span>
                    <span className="font-headline font-bold text-2xl text-secondary"> {/* Used font-headline and secondary color */}
                      1000+
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-8 border shadow-lg text-center">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2 font-body"> {/* Used font-body */}
                    Ungana na washirika 250+ wanaoleta mabadiliko duniani
                  </p>
                </div>
                
                <h3 className="font-headline font-semibold text-xl text-foreground mb-4"> {/* Used font-headline */}
                  Tayari Kuwa Mshirika Nasi?
                </h3>
                <p className="text-muted-foreground mb-6 font-body"> {/* Used font-body */}
                  Anza leo na uwe sehemu ya kitu kikuu kuliko wewe mwenyewe.
                </p>
                
                <div className="space-y-3 font-body"> {/* Used font-body */}
                  <div className="text-sm text-muted-foreground">
                    Chagua aina ya ushirika:
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80 px-2 py-1 rounded">Mshirika wa Maombi</span> {/* Used primary for consistency */}
                    <span className="bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary/80 px-2 py-1 rounded">Mshirika wa Maono</span>
                    <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80 px-2 py-1 rounded">Mjenzi wa Ufalme</span> {/* Used primary for consistency */}
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-headline font-semibold" /* Used primary, primary-foreground, and font-headline */
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
  );
}
