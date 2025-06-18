
"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { TestimonialCard } from "@/components/cards/testimonial-card";

const testimonials = [
  {
    imageSrc: "https://placehold.co/150x225.png",
    imageAlt: "Picha ya Asha Juma",
    aiHint: "portrait woman african",
    quote: "Nilipata familia na kusudi jipya.",
    story:
      "Kabla ya kujiunga na HSCM, nilijihisi mpweke na niliyepotea. Kupitia jumuiya na mafundisho, nimepata uponyaji na mwelekeo mpya maishani mwangu.",
    name: "Asha Juma",
    location: "Kinondoni, DSM",
  },
  {
    imageSrc: "https://placehold.co/150x225.png",
    imageAlt: "Picha ya John Peter",
    aiHint: "portrait man african",
    quote: "Maisha yangu yamebadilika kabisa.",
    story:
      "Nilikuwa nimekata tamaa, lakini HSCM ilinipa tumaini. Sasa nina furaha na nguvu mpya ya kumtumikia Mungu na jamii yangu.",
    name: "John Peter",
    location: "Temeke, DSM",
  },
  {
    imageSrc: "https://placehold.co/150x225.png",
    imageAlt: "Picha ya Fatuma Saidi",
    aiHint: "portrait young woman",
    quote: "Upendo nilioupata hapa hauna kifani.",
    story:
      "Jamii ya HSCM Connect ni ya kipekee. Nimekaribishwa kwa mikono miwili na nimejifunza mengi kuhusu imani yangu.",
    name: "Fatuma Saidi",
    location: "Ilala, DSM",
  },
];

export function TestimonialsSectionSw() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleDotClick = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <section
      id="shuhuda"
      className="w-full py-16 md:py-24 bg-background"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
          Hadithi za Mabadiliko
        </h2>
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed">
          Uaminifu wa Mungu unaonekana kupitia maisha ya watu wake.
        </p>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-3xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="basis-full">
                <TestimonialCard {...testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:inline-flex" />
          <CarouselNext className="hidden md:inline-flex" />
        </Carousel>

        {api && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                aria-label={`Nenda kwenye ushuhuda ${index + 1}`}
                className={cn(
                  "h-3 w-3 rounded-full transition-colors",
                  current === index + 1
                    ? "bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
