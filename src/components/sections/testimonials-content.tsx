
"use client";

import * as React from "react";
import type { StaticImageData } from 'next/image';
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { TestimonyForm } from "@/components/forms/testimony-form";
import { Feather, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Testimonial {
  imageSrc: string | StaticImageData;
  imageAlt: string;
  quote: string;
  story: string;
  name: string;
  location: string;
  aiHint?: string;
}

interface TestimonialsContentProps {
  testimonials: Testimonial[];
  showFallbackMessage: boolean;
}

export function TestimonialsContent({ testimonials, showFallbackMessage }: TestimonialsContentProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
    <motion.section
      id="shuhuda"
      className="w-full py-16 md:py-24 bg-background"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
          Hadithi za Mabadiliko
        </h2>
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed">
          Sikia jinsi Mungu anavyofanya kazi kupitia maisha ya watu kama wewe. Ushuhuda wako unaweza kuwa unaofuata!
        </p>

        {showFallbackMessage && (
          <Alert className="max-w-xl mx-auto mb-8 text-left">
            <Info className="h-4 w-4" />
            <AlertTitle>Showing Example Content</AlertTitle>
            <AlertDescription>
              This is example content because no approved testimonials were found in the database. To display your own, add documents to the 'published_testimonials' collection in Firestore.
            </AlertDescription>
          </Alert>
        )}

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

        <div className="mt-16">
          <Button
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="font-headline text-lg"
            suppressHydrationWarning={true}
          >
            <Feather className="mr-2 h-5 w-5" />
            Shiriki Hadithi Yako
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center">
              <Feather className="mr-2 h-6 w-6 text-primary"/>
              Shiriki Ushuhuda Wako
            </DialogTitle>
            <DialogDescription className="font-body pt-1">
              Tunapenda kusikia jinsi Mungu anavyofanya kazi maishani mwako. Tafadhali shiriki hadithi yako nasi.
              Shuhuda zilizowasilishwa zinaweza kupitiwa na kushirikiwa hadharani (tutakuomba ruhusa zaidi ikihitajika kabla ya kuchapisha).
            </DialogDescription>
          </DialogHeader>
          <TestimonyForm onFormSubmit={() => setIsModalOpen(false)} />
          <DialogClose onClick={() => setIsModalOpen(false)} asChild>
            <button className="sr-only">Funga</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
}
