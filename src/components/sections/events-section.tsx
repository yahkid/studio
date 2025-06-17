
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
  gradientFrom?: string;
  gradientTo?: string;
}

function EventCard({
  imageSrc,
  imageAlt,
  aiHint,
  title,
  description,
  details,
  buttonText,
  gradientFrom = 'from-primary/20',
  gradientTo = 'to-secondary/20',
}: EventCardProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden border shadow-lg hover:shadow-xl transition-shadow">
      <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} dark:from-primary/30 dark:to-secondary/30 h-48 flex items-center justify-center`}>
        <Image src={imageSrc} alt={imageAlt} width={300} height={192} className="object-cover w-full h-full" data-ai-hint={aiHint} />
      </div>
      <div className="p-6">
        <h3 className="font-headline font-semibold text-xl text-foreground mb-2">
          {title}
        </h3>
        <p className="font-body text-muted-foreground mb-4">
          {description}
        </p>
        <div className="font-body text-sm text-muted-foreground mb-4">
          <p>{details}</p>
        </div>
        <Button variant="outline" size="sm" className="w-full font-body">
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

export function EventsSection() {
  const eventCardsData: EventCardProps[] = [
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Sunday Service Illustration",
      aiHint: "church worship",
      title: "Sunday Services",
      description: "Join us every Sunday for inspiring worship and life-changing messages.",
      details: "Every Sunday • 9:00 AM & 11:00 AM",
      buttonText: "Learn More",
    },
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Small Groups Meeting",
      aiHint: "small group",
      title: "Small Groups",
      description: "Build deeper relationships and grow in faith with others in intimate group settings.",
      details: "Various Times • Throughout the Week",
      buttonText: "Find a Group",
      gradientFrom: 'from-secondary/20',
      gradientTo: 'to-primary/20',
    },
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Youth Ministry Activities",
      aiHint: "youth group",
      title: "Youth Ministry",
      description: "Fun, faith-filled activities for teens to connect with God and each other.",
      details: "Fridays • 7:00 PM",
      buttonText: "Join Youth",
    },
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Community Outreach Event",
      aiHint: "community service",
      title: "Community Outreach",
      description: "Make a difference in our community through service and outreach programs.",
      details: "Monthly • Various Locations",
      buttonText: "Get Involved",
      gradientFrom: 'from-secondary/20',
      gradientTo: 'to-primary/20',
    },
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Prayer Night Gathering",
      aiHint: "prayer meeting",
      title: "Prayer Nights",
      description: "Powerful times of corporate prayer and intercession for our community and world.",
      details: "Wednesdays • 7:00 PM",
      buttonText: "Join Prayer",
    },
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Special Church Event",
      aiHint: "church celebration",
      title: "Special Events",
      description: "Holiday celebrations, conferences, and special gatherings throughout the year.",
      details: "Seasonal • Check Calendar",
      buttonText: "View Calendar",
      gradientFrom: 'from-secondary/20',
      gradientTo: 'to-primary/20',
    },
  ];

  return (
    <section id="events" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline font-bold text-5xl md:text-6xl text-foreground mb-6">
              LIFE IS BETTER
              <span className="block text-primary">TOGETHER</span>
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join us for meaningful connections, spiritual growth, and life-changing experiences
              that bring our community closer to God and each other.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {eventCardsData.map((card) => (
              <EventCard key={card.title} {...card} />
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-headline font-semibold px-8 py-4"
            >
              View All Events
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
