
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
}

function EventCard({
  imageSrc,
  imageAlt,
  aiHint,
  title,
  description,
  details,
  buttonText,
}: EventCardProps) {
  return (
    <div className="event-card bg-card rounded-xl overflow-hidden border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div className="relative h-48 w-full">
        <Image src={imageSrc} alt={imageAlt} layout="fill" objectFit="cover" data-ai-hint={aiHint} />
      </div>
      <div className="p-6"> {/* Corresponds to padding: 1.5rem */}
        <h3 className="font-headline font-semibold text-xl text-primary mb-2"> {/* Global h3 style, color: var(--primary-green) */}
          {title}
        </h3>
        <p className="font-body text-muted-foreground mb-4"> {/* Global body style */}
          {description}
        </p>
        <p className="detail-text font-body text-sm text-muted-foreground mb-4"> {/* font-size: 0.9rem; color: var(--neutral-medium); */}
          {details}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="card-cta w-full font-body font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-4" // Secondary button style
        >
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
      aiHint: "church worship service", // Updated hint for Unsplash
      title: "Sunday Services",
      description: "Join us every Sunday for inspiring worship and life-changing messages.",
      details: "Every Sunday • 9:00 AM & 11:00 AM",
      buttonText: "Learn More",
    },
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Small Groups Meeting",
      aiHint: "group discussion community", // Updated hint for Unsplash
      title: "Small Groups",
      description: "Build deeper relationships and grow in faith with others in intimate group settings.",
      details: "Various Times • Throughout the Week",
      buttonText: "Find a Group",
    },
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Youth Ministry Activities",
      aiHint: "energetic teens youth", // Updated hint for Unsplash
      title: "Youth Ministry",
      description: "Fun, faith-filled activities for teens to connect with God and each other.",
      details: "Fridays • 7:00 PM",
      buttonText: "Join Youth",
    },
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Community Outreach Event",
      aiHint: "community service volunteering",
      title: "Community Outreach",
      description: "Make a difference in our community through service and outreach programs.",
      details: "Monthly • Various Locations",
      buttonText: "Get Involved",
    },
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Prayer Night Gathering",
      aiHint: "prayer meeting candles",
      title: "Prayer Nights",
      description: "Powerful times of corporate prayer and intercession for our community and world.",
      details: "Wednesdays • 7:00 PM",
      buttonText: "Join Prayer",
    },
    {
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Special Church Event",
      aiHint: "church celebration event",
      title: "Special Events",
      description: "Holiday celebrations, conferences, and special gatherings throughout the year.",
      details: "Seasonal • Check Calendar",
      buttonText: "View Calendar",
    },
  ];

  return (
    <section id="events" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline font-bold text-5xl md:text-6xl text-foreground mb-6">
              LIFE IS BETTER <span className="block text-primary">TOGETHER</span>
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-4 mb-12"> {/* max-width: 700px, margin: 1rem auto 3rem auto */}
              Join us for meaningful connections, spiritual growth, and life-changing experiences
              that bring our community closer to God and each other.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"> {/* Three-column grid with 2rem gap */}
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
