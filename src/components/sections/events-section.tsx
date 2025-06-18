
"use client";

import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface EventCardProps {
  imageSrc: string;
  imageAlt: string;
  aiHint: string;
  title: string;
  description: string;
  details: string;
  buttonText: string;
  onButtonClick?: () => void; // Optional: if button action is dynamic
}

function EventCard({
  imageSrc,
  imageAlt,
  aiHint,
  title,
  description,
  details,
  buttonText,
  onButtonClick,
}: EventCardProps) {
  return (
    <div className="event-card bg-card rounded-xl overflow-hidden border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col">
      <div className="relative h-48 w-full">
        <Image src={imageSrc} alt={imageAlt} layout="fill" objectFit="cover" data-ai-hint={aiHint} />
      </div>
      <div className="p-6 flex flex-col flex-grow"> 
        <h3 className="font-headline font-semibold text-xl text-primary mb-2"> 
          {title}
        </h3>
        <p className="font-body text-muted-foreground mb-4 flex-grow"> 
          {description}
        </p>
        <p className="detail-text font-body text-sm text-muted-foreground mb-4"> 
          {details}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="card-cta w-full font-body font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-auto" 
          onClick={onButtonClick}
          suppressHydrationWarning={true}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

interface EventsSectionSwProps {
  onOpenVisitPlanner: () => void;
}

export function EventsSectionSw({ onOpenVisitPlanner }: EventsSectionSwProps) {
  const eventCardsData: EventCardProps[] = [
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Mfano wa Ibada ya Jumapili",
      aiHint: "church worship service",
      title: "Ibada za Jumapili",
      description: "Ungana nasi kila Jumapili kwa ibada yenye kuinua na jumbe zinazobadilisha maisha.",
      details: "Kila Jumapili • Saa 3:00 Asubuhi & Saa 5:00 Asubuhi",
      buttonText: "Jifunze Zaidi",
    },
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Mkutano wa Vikundi Vidogo",
      aiHint: "group discussion community",
      title: "Vikundi Vidogo",
      description: "Jenga mahusiano ya kina na kukua katika imani na wengine katika vikundi vidogo.",
      details: "Nyakati Mbalimbali • Katika Wiki",
      buttonText: "Tafuta Kikundi",
    },
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Shughuli za Huduma ya Vijana",
      aiHint: "energetic teens youth",
      title: "Huduma ya Vijana",
      description: "Shughuli za kufurahisha, zenye imani kwa vijana kuungana na Mungu na wao kwa wao.",
      details: "Ijumaa • Saa 1:00 Jioni",
      buttonText: "Jiunge na Vijana",
    },
  ];

  return (
    <section id="matukio" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-headline font-bold text-4xl md:text-5xl text-foreground mb-6">
              MAISHA NI BORA <span className="block text-primary">PAMOJA</span>
            </h2>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Kuna nafasi kwa ajili yako daima. Gundua ibada, mikutano, na matukio yetu yajayo, na uwe sehemu ya jamii yetu changamfu.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"> 
            {eventCardsData.map((card) => (
              <EventCard key={card.title} {...card} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-headline font-semibold px-10 py-5 text-lg"
              onClick={onOpenVisitPlanner} // CRO #2
              suppressHydrationWarning={true}
            >
              Panga Ujio Wako
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Keep old export name for compatibility if needed, or remove if not.
export { EventsSectionSw as EventsSection };
