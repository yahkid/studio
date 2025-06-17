import { type Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MapPin, Clock, Smile, Users, Baby, Coffee } from 'lucide-react';

export const metadata: Metadata = {
  title: "I'm New | HSCM Connect",
  description: "Welcome to Holy Spirit Connect Ministry! Find service times, what to expect, and plan your visit.",
};

export default function ImNewPage() {
  return (
    <div className="bg-background">
      {/* Welcome Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-hscm-gold/10 via-white to-hscm-green/10 dark:from-hscm-gold-dark-theme/10 dark:via-background dark:to-hscm-green-dark-theme/10">
        <div className="container mx-auto px-4 text-center">
          <Smile className="mx-auto h-16 w-16 text-hscm-gold mb-6" />
          <h1 className="font-headline text-4xl md:text-6xl text-foreground mb-6">
            Welcome to HSCM Connect!
          </h1>
          <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're thrilled you're here and considering a visit. We know visiting a new church can be an adventure, 
            and we want to make your first experience with us as welcoming and comfortable as possible.
          </p>
          <Button size="lg" className="bg-hscm-green hover:bg-hscm-green/90 text-primary-foreground font-body font-semibold px-10 py-5 text-lg">
            Plan Your Visit Today
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
                Service Times
              </h2>
              <div className="font-body text-lg text-muted-foreground space-y-3 mb-6">
                <p><strong>Sunday Worship:</strong> 9:00 AM & 11:00 AM</p>
                <p><strong>Mid-week Prayer:</strong> Wednesdays at 7:00 PM</p>
                <p>We invite you to join us for a time of uplifting worship, inspiring messages, and warm fellowship.</p>
              </div>
              
              <h2 className="font-headline text-3xl text-foreground mb-6 mt-8 flex items-center">
                <MapPin className="h-8 w-8 mr-3 text-primary" />
                Our Location
              </h2>
              <div className="font-body text-lg text-muted-foreground space-y-2">
                <p>123 Faith Street, Ministry City, MC 12345</p>
                <p>We have ample parking available on-site.</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Map showing location of HSCM Connect"
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
            What to Expect
          </h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-body text-lg hover:no-underline">
                <Users className="h-5 w-5 mr-2 text-primary" /> What is the worship like?
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground text-base pl-7">
                Our worship services are vibrant and contemporary, featuring a mix of modern worship songs and timeless hymns. 
                We aim to create an atmosphere where you can connect with God authentically.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-body text-lg hover:no-underline">
                <Baby className="h-5 w-5 mr-2 text-primary" /> What is available for my children?
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground text-base pl-7">
                We love kids at HSCM Connect! We offer engaging and age-appropriate programs for children from nursery through elementary school during our Sunday services. 
                Your children will learn about God in a safe, fun, and nurturing environment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="font-body text-lg hover:no-underline">
                What should I wear?
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground text-base pl-7">
                Come as you are! You'll find a variety of styles at our services, from casual to more dressed-up. 
                We care more about you connecting with God than what you're wearing.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger className="font-body text-lg hover:no-underline">
                <Coffee className="h-5 w-5 mr-2 text-primary" /> Is there coffee?
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground text-base pl-7">
                Absolutely! We invite you to join us for coffee and fellowship before or after the service. 
                It's a great way to meet people and get connected.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 text-center border-t">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl text-foreground mb-6">
            Ready to Experience HSCM Connect?
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            We can't wait to meet you! Click the button below to let us know you're coming or if you have any questions.
          </p>
          <Button 
            size="lg" 
            className="bg-hscm-green hover:bg-hscm-green/90 text-primary-foreground font-body font-semibold px-12 py-5 text-lg"
            // onClick={() => { /* Logic to open VisitPlannerModal or navigate */ }}
          >
            Let Us Know You're Coming
          </Button>
        </div>
      </section>
    </div>
  );
}