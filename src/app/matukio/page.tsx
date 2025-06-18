
"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, List, Filter } from "lucide-react";
import { EventCard } from "@/components/cards/event-card";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isValid } from "date-fns";
import { sw } from 'date-fns/locale'; // For Swahili month names if needed, or can format manually

export interface MinistryEvent {
  id: number;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  eventType: 'weekly' | 'monthly' | 'special' | 'all';
  platform: string;
  streamUrl: string;
  audience: string;
}

const initialEventsData: MinistryEvent[] = [
  {
    "id": 2025060101,
    "title": "Maombi ya Kufungua Mwezi",
    "description": "Join Rev. Innocent Morris live as we dedicate the month of June to the Lord, declaring blessings and breakthrough for your life, family, and work.",
    "date": "2025-06-01",
    "startTime": "10:00",
    "endTime": "11:30",
    "eventType": "monthly",
    "platform": "YouTube Live, Facebook Live",
    "streamUrl": "#",
    "audience": "All"
  },
  {
    "id": 2025060102,
    "title": "Sunday Night Service",
    "description": "A powerful time of worship with the HSCM Worship team and a life-changing message from the Word to start your week strong and centered on Christ.",
    "date": "2025-06-01",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "weekly",
    "platform": "YouTube Live",
    "streamUrl": "#",
    "audience": "All"
  },
  {
    "id": 2025060301,
    "title": "Mafundisho ya Biblia (Bible Study)",
    "description": "Deep dive into the scriptures. This month's series: Foundations of Faith. Tonight's topic: The Role of the Holy Spirit in a Believer's Life.",
    "date": "2025-06-03",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "weekly",
    "platform": "YouTube Live, Zoom",
    "streamUrl": "#",
    "audience": "All (Live), Members (Interactive Q&A)"
  },
  {
    "id": 2025060601,
    "title": "Usiku wa Maombi (All-Night Prayer Vigil)",
    "description": "Join us for a night of powerful intercession, worship, and spiritual warfare. Submit your prayer requests live in the chat.",
    "date": "2025-06-06",
    "startTime": "22:00",
    "endTime": "01:00", // Assuming next day, handle display carefully
    "eventType": "weekly",
    "platform": "YouTube Live",
    "streamUrl": "#",
    "audience": "All"
  },
  {
    "id": 2025060801,
    "title": "Sunday Night Service",
    "description": "A powerful time of worship and Word.",
    "date": "2025-06-08",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "weekly",
    "platform": "YouTube Live",
    "streamUrl": "#",
    "audience": "All"
  },
  {
    "id": 2025061001,
    "title": "Mafundisho ya Biblia (Bible Study)",
    "description": "Foundations of Faith series continues.",
    "date": "2025-06-10",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "weekly",
    "platform": "YouTube Live, Zoom",
    "streamUrl": "#",
    "audience": "All (Live), Members (Interactive Q&A)"
  },
   {
    "id": 2025061501,
    "title": "Sunday Night Service - Special Guest",
    "description": "Join us for a special Sunday Night Service with a guest speaker.",
    "date": "2025-06-15",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "special",
    "platform": "YouTube Live",
    "streamUrl": "#",
    "audience": "All"
  },
];

export default function MatukioPage() {
  const [viewMode, setViewMode] = useState<'list' | 'month'>('list');
  const [filterType, setFilterType] = useState<MinistryEvent['eventType'] | 'all'>('all');
  const [events, setEvents] = useState<MinistryEvent[]>(initialEventsData);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 5, 1)); // June 2025
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 5, 1));


  const filteredAndSortedEvents = useMemo(() => {
    let processedEvents = events
      .map(event => ({
        ...event,
        parsedDate: parseISO(event.date),
      }))
      .filter(event => isValid(event.parsedDate));

    if (filterType !== 'all') {
      processedEvents = processedEvents.filter(event => event.eventType === filterType);
    }

    if (viewMode === 'month' && selectedDate) {
      processedEvents = processedEvents.filter(event => isSameDay(event.parsedDate, selectedDate));
    }
    
    // Sort by date, then by start time
    return processedEvents.sort((a, b) => {
      const dateComparison = a.parsedDate.getTime() - b.parsedDate.getTime();
      if (dateComparison !== 0) {
        return dateComparison;
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }, [events, filterType, viewMode, selectedDate]);

  const eventDaysInCurrentMonth = useMemo(() => {
    const daysWithEvents = new Map<string, MinistryEvent['eventType'][]>();
    const monthEvents = events.filter(event => {
        const eventDate = parseISO(event.date);
        return isValid(eventDate) && eventDate.getFullYear() === currentMonth.getFullYear() && eventDate.getMonth() === currentMonth.getMonth();
    });

    monthEvents.forEach(event => {
      const dayKey = format(parseISO(event.date), "yyyy-MM-dd");
      const types = daysWithEvents.get(dayKey) || [];
      if (!types.includes(event.eventType)) {
        types.push(event.eventType);
      }
      daysWithEvents.set(dayKey, types);
    });
    return daysWithEvents;
  }, [events, currentMonth]);
  
  const DayContent = ({ date }: { date: Date }) => {
    const dayKey = format(date, "yyyy-MM-dd");
    const eventTypesOnDay = eventDaysInCurrentMonth.get(dayKey);
    
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span>{format(date, "d")}</span>
        {eventTypesOnDay && eventTypesOnDay.length > 0 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-0.5">
            {eventTypesOnDay.slice(0,3).map((type, index) => {
               let bgColor = "bg-gray-400";
               if (type === 'weekly') bgColor = "bg-primary";
               else if (type === 'monthly') bgColor = "bg-secondary";
               else if (type === 'special') bgColor = "bg-destructive";
               return <div key={index} className={`h-1.5 w-1.5 rounded-full ${bgColor}`}></div>;
            })}
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
          Kalenda ya Matukio
        </h1>
        <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
          Gundua na ujiunge na matukio yetu ya kusisimua. Kuna kitu kwa kila mtu!
        </p>
      </header>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            className="font-body"
            aria-pressed={viewMode === 'list'}
          >
            <List className="mr-2 h-4 w-4" /> Mipangilio
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            onClick={() => setViewMode('month')}
            className="font-body"
            aria-pressed={viewMode === 'month'}
          >
            <CalendarIcon className="mr-2 h-4 w-4" /> Mwezi
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={filterType} onValueChange={(value) => setFilterType(value as MinistryEvent['eventType'] | 'all')}>
            <SelectTrigger className="w-full sm:w-[180px] font-body">
              <SelectValue placeholder="Chuja kwa aina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-body">Matukio Yote</SelectItem>
              <SelectItem value="weekly" className="font-body">Ratiba ya Wiki</SelectItem>
              <SelectItem value="monthly" className="font-body">Matukio ya Mwezi</SelectItem>
              <SelectItem value="special" className="font-body">Matukio Maalum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {viewMode === 'month' && (
         <div className="mb-8 bg-card p-2 sm:p-4 rounded-lg border">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (date) setCurrentMonth(startOfMonth(date));
                }}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="p-0 [&_td]:w-12 [&_td]:h-12 [&_th]:w-12"
                classNames={{
                  day: "w-full h-full",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
                  day_today: "bg-accent text-accent-foreground",
                }}
                components={{
                    DayContent: DayContent
                }}
                locale={sw} 
                captionLayout="dropdown-buttons" 
                fromYear={2024} toYear={2030}
            />
        </div>
      )}

      {viewMode === 'list' || (viewMode === 'month' && selectedDate) ? (
        filteredAndSortedEvents.length > 0 ? (
          <div className="space-y-6">
            {viewMode === 'month' && selectedDate && (
              <h2 className="font-headline text-2xl text-foreground mb-4">
                Matukio ya {format(selectedDate, "MMMM d, yyyy", { locale: sw })}
              </h2>
            )}
            {filteredAndSortedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground text-lg">
              {viewMode === 'month' && selectedDate ? 'Hakuna matukio yaliyopangwa kwa tarehe hii.' : 'Hakuna matukio yanayolingana na kichujio chako.'}
            </p>
          </div>
        )
      ) : null}
       {viewMode === 'month' && !selectedDate && filteredAndSortedEvents.length > 0 && (
         <div className="space-y-6 mt-8">
            <h2 className="font-headline text-2xl text-foreground mb-4">
                Matukio Yote kwa Mwezi wa {format(currentMonth, "MMMM yyyy", { locale: sw })} (kichujio: {filterType})
            </h2>
            {filteredAndSortedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
        </div>
      )}


    </div>
  );
}

    
