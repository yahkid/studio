
"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, List, Filter } from "lucide-react";
import { EventCard } from "@/components/cards/event-card";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isValid } from "date-fns";
import { sw } from 'date-fns/locale'; 
import { initialEventsData, type MinistryEvent } from '@/lib/events-data';


export default function MatukioPage() {
  const [viewMode, setViewMode] = useState<'list' | 'month'>('list');
  const [filterType, setFilterType] = useState<MinistryEvent['eventType'] | 'all'>('all');
  const [events, setEvents] = useState<MinistryEvent[]>(initialEventsData);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); 
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 5, 1)); // Default to June 2025


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
    } else if (viewMode === 'month' && !selectedDate) { // Show all events for the current month if no specific date is selected
        processedEvents = processedEvents.filter(event => {
            const eventDate = event.parsedDate;
            return eventDate.getFullYear() === currentMonth.getFullYear() && eventDate.getMonth() === currentMonth.getMonth();
        });
    }
    
    return processedEvents.sort((a, b) => {
      const dateComparison = a.parsedDate.getTime() - b.parsedDate.getTime();
      if (dateComparison !== 0) {
        return dateComparison;
      }
      // If dates are the same, sort by start time
      return a.startTime.localeCompare(b.startTime);
    });
  }, [events, filterType, viewMode, selectedDate, currentMonth]);

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
               let bgColor = "bg-gray-400"; // Default or for 'other'
               if (type === 'weekly') bgColor = "bg-primary"; // Green
               else if (type === 'monthly') bgColor = "bg-secondary"; // Gold
               else if (type === 'special') bgColor = "bg-destructive"; // Red
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
                  setSelectedDate(date); // Keep the selected date
                  if (date) setCurrentMonth(startOfMonth(date)); // Update month if a date is picked
                }}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="p-0 [&_td]:w-12 [&_td]:h-12 [&_th]:w-12" // Adjusted for cell size
                classNames={{
                  day: "w-full h-full", // Ensure day cell takes full space for content
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
                  day_today: "bg-accent text-accent-foreground",
                }}
                components={{
                    DayContent: DayContent // Custom day cell content
                }}
                locale={sw} // Swahili locale
                captionLayout="dropdown-buttons" // Enable month/year dropdowns
                fromYear={2024} toYear={2030} // Year range for dropdowns
            />
        </div>
      )}

      {/* List View or Filtered Month View (events below calendar) */}
      {/* This section will show if in 'list' mode OR if in 'month' mode (selectedDate or not) */}
      {viewMode === 'list' || viewMode === 'month' ? (
        filteredAndSortedEvents.length > 0 ? (
          <div className="space-y-6">
            {viewMode === 'month' && selectedDate && (
              <h2 className="font-headline text-2xl text-foreground mb-4">
                Matukio ya {format(selectedDate, "MMMM d, yyyy", { locale: sw })}
              </h2>
            )}
            {viewMode === 'month' && !selectedDate && (
                 <h2 className="font-headline text-2xl text-foreground mb-4">
                    Matukio Yote kwa Mwezi wa {format(currentMonth, "MMMM yyyy", { locale: sw })} ({filterType === 'all' ? 'Matukio Yote' : `Kichujio: ${filterType}`})
                </h2>
            )}
            {filteredAndSortedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground text-lg">
              {viewMode === 'month' && selectedDate ? 'Hakuna matukio yaliyopangwa kwa tarehe hii.' : 
               viewMode === 'month' && !selectedDate ? `Hakuna matukio yanayolingana na kichujio chako kwa mwezi wa ${format(currentMonth, "MMMM yyyy", { locale: sw })}.` :
               'Hakuna matukio yanayolingana na kichujio chako.'}
            </p>
          </div>
        )
      ) : null}

    </div>
  );
}
