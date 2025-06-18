
import Image from 'next/image';
import type { StaticImageData } from 'next/image';

interface TestimonialCardProps {
  imageSrc: string | StaticImageData;
  imageAlt: string;
  aiHint?: string;
  quote: string;
  story: string;
  name: string;
  location: string;
}

export function TestimonialCard({
  imageSrc,
  imageAlt,
  aiHint,
  quote,
  story,
  name,
  location,
}: TestimonialCardProps) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-8 py-8 md:py-12">
      <div className="flex-shrink-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={150}
          height={225}
          className="rounded-xl object-cover w-[150px] h-[225px]"
          data-ai-hint={aiHint || "portrait person"}
        />
      </div>
      <div className="flex flex-col">
        <blockquote className="font-headline text-2xl md:text-3xl font-bold text-foreground mb-4">
          <p>&ldquo;{quote}&rdquo;</p>
        </blockquote>
        <p className="font-body text-muted-foreground mb-4 leading-relaxed">
          {story}
        </p>
        <cite className="font-body not-italic">
          <span className="font-semibold text-foreground">{name},</span>
          <span className="text-muted-foreground/80"> {location}</span>
        </cite>
      </div>
    </div>
  );
}
