
"use client";

import type { MinistryEvent } from "@/lib/events-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { CalendarPlus, PlayCircle } from "lucide-react";

interface EventCardProps {
  event: MinistryEvent;
}

function isValidDate(date: Date | undefined): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export function EventCard({ event }: EventCardProps) {
  const parsedDate = event.parsedDate || parseISO(event.date);

  const getBorderColorClass = () => {
    switch (event.eventType) {
      case 'weekly':
        return 'border-primary'; // Green
      case 'monthly':
        return 'border-secondary'; // Gold - Mapped to secondary in theme
      case 'special':
        return 'border-destructive'; // Red
      default:
        return 'border-muted-foreground';
    }
  };

  const handleAddToCalendar = () => {
    // Placeholder for .ics generation or calendar integration
    console.log("Add to Calendar clicked for event:", event.title);
    alert("Kipengele cha 'Ongeza kwenye Kalenda' kitakuja hivi karibuni!");
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 flex">
        {/* Date Block */}
        <div className="w-24 flex-shrink-0 bg-muted/30 p-4 flex flex-col items-center justify-center text-center border-r">
          <span className="font-headline text-4xl font-bold text-primary">
            {isValidDate(parsedDate) ? format(parsedDate, "dd") : '??'}
          </span>
          <span className="font-body text-sm uppercase text-muted-foreground">
            {isValidDate(parsedDate) ? format(parsedDate, "MMM") : '---'}
          </span>
        </div>

        {/* Color Bar & Details Block Wrapper */}
        <div className={`flex-grow flex border-l-4 ${getBorderColorClass()}`}>
          {/* Details Block */}
          <div className="p-4 sm:p-6 flex-grow">
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">
              {event.title}
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-2 sm:mb-3">
              {isValidDate(parsedDate) ? format(parsedDate, "eeee, MMMM d, yyyy") : 'Tarehe Batili'} | {event.startTime} - {event.endTime} EAT
            </p>
            <p className="font-body text-muted-foreground mb-3 sm:mb-4 text-sm leading-relaxed">
              {event.description}
            </p>
            <div className="font-body text-xs text-muted-foreground mb-4">
                <p><strong>Jukwaa:</strong> {event.platform}</p>
                <p><strong>Walengwa:</strong> {event.audience}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                asChild 
                className="font-body w-full sm:w-auto"
                disabled={!event.streamUrl || event.streamUrl === "#"}
              >
                <a href={event.streamUrl} target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="mr-2 h-4 w-4" /> Tazama Moja kwa Moja
                </a>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAddToCalendar} 
                className="font-body w-full sm:w-auto"
              >
                <CalendarPlus className="mr-2 h-4 w-4" /> Ongeza Kwenye Kalenda
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
