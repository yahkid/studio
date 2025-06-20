
"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, List, Filter, Mail, Loader2, Newspaper } from "lucide-react";
import { EventCard } from "@/components/cards/event-card";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isSameDay, startOfMonth, isValid } from "date-fns";
import { initialEventsData, type MinistryEvent } from '@/lib/events-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebaseClient'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from "framer-motion";

export default function MatukioPage() {
  const [viewMode, setViewMode] = useState<'list' | 'month'>('list');
  const [filterType, setFilterType] = useState<MinistryEvent['eventType'] | 'all'>('all');
  const [events, setEvents] = useState<MinistryEvent[]>(initialEventsData);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date(2025, 5, 1))); // Fixed date, fine for SSR

  const [eventSignupEmail, setEventSignupEmail] = useState('');
  const [isEventSignupLoading, setIsEventSignupLoading] = useState(false);
  const { toast } = useToast();

  const [calendarConfig, setCalendarConfig] = useState<{fromYear?: number, toYear?: number}>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentYear = new Date().getFullYear();
    setCalendarConfig({
      fromYear: currentYear - 1,
      toYear: currentYear + 5,
    });
  }, []);

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
    } else if (viewMode === 'month' && !selectedDate) { 
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

  const handleEventSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventSignupEmail || !/\S+@\S+\.\S+/.test(eventSignupEmail)) {
      toast({
        title: "Barua Pepe Batili",
        description: "Tafadhali ingiza anwani sahihi ya barua pepe.",
        variant: "destructive",
      });
      return;
    }

    setIsEventSignupLoading(true);
    try {
      if (!db) {
        throw new Error("Firestore database is not initialized.");
      }
      await addDoc(collection(db, 'weekly_updates_signups'), { 
        email: eventSignupEmail,
        created_at: serverTimestamp(),
        source: 'matukio_page' 
      });

      toast({
        title: "Umefanikiwa Kujisajili!",
        description: "Utapokea taarifa za matukio yetu mapya na ya kipekee.",
      });
      setEventSignupEmail('');
    } catch (error: any) {
      console.error('Error submitting event signup to Firestore:', error);
      toast({
        title: "Hitilafu Imetokea",
        description: `Imeshindwa kuwasilisha barua pepe yako. Tafadhali jaribu tena. ${error.message || ""}`,
        variant: "destructive",
      });
    } finally {
      setIsEventSignupLoading(false);
    }
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
            onClick={() => {
              setViewMode('month');
            }}
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
      
      {viewMode === 'month' && mounted && (
         <motion.div 
            className="mb-8 bg-card p-2 sm:p-4 rounded-lg border"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
         >
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date); 
                  if (date) setCurrentMonth(startOfMonth(date)); 
                }}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="p-0 [&_td]:w-12 [&_td]:h-12 [&_th]:w-12 sm:[&_td]:w-16 sm:[&_td]:h-16 sm:[&_th]:w-16"
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
                  day_today: "bg-accent text-accent-foreground",
                }}
                components={{
                    DayContent: DayContent 
                }}
                captionLayout="dropdown-buttons"
                fromYear={calendarConfig.fromYear} 
                toYear={calendarConfig.toYear}
            />
        </motion.div>
      )}
       {viewMode === 'month' && !mounted && (
        <div className="mb-8 bg-card p-2 sm:p-4 rounded-lg border min-h-[370px] flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" /> 
          <p className="ml-2 font-body">Inapakia Kalenda...</p>
        </div>
       )}


      {filteredAndSortedEvents.length > 0 ? (
        <div className="space-y-6">
          {viewMode === 'month' && selectedDate && (
            <h2 className="font-headline text-2xl text-foreground mb-4">
              Matukio ya {format(selectedDate, "MMMM d, yyyy")}
            </h2>
          )}
          {viewMode === 'month' && !selectedDate && (
               <h2 className="font-headline text-2xl text-foreground mb-4">
                  Matukio Yote kwa Mwezi wa {format(currentMonth, "MMMM yyyy")} ({filterType === 'all' ? 'Matukio Yote' : `Kichujio: ${filterType}`})
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
             viewMode === 'month' && !selectedDate ? `Hakuna matukio yanayolingana na kichujio chako kwa mwezi wa ${format(currentMonth, "MMMM yyyy")}.` :
             'Hakuna matukio yanayolingana na kichujio chako.'}
          </p>
        </div>
      )}

      <Card className="mt-12 max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <Newspaper className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-2xl text-foreground">Usikose Tukio!</CardTitle>
          </div>
          <CardDescription className="font-body">
            Jisajili kupokea taarifa za matukio yetu mapya na ya kipekee moja kwa moja kwenye barua pepe yako.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleEventSignupSubmit}>
            <CardContent className="space-y-3">
                <div>
                <Label htmlFor="email-event-signup" className="sr-only">Barua pepe</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                    id="email-event-signup" 
                    type="email"
                    value={eventSignupEmail}
                    onChange={(e) => setEventSignupEmail(e.target.value)}
                    placeholder="Weka barua pepe yako" 
                    required 
                    className="pl-10 font-body"
                    disabled={isEventSignupLoading}
                    />
                </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">Hatutakutumia barua taka. Faragha yako ni muhimu.</p>
            </CardContent>
            <CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => setEventSignupEmail('')}
                    disabled={isEventSignupLoading}
                >
                Ghairi
                </Button>
                <Button type="submit" className="w-full sm:w-auto font-headline" disabled={isEventSignupLoading}>
                {isEventSignupLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEventSignupLoading ? 'Inasajili...' : 'Nijulishe Kuhusu Matukio'}
                </Button>
            </CardFooter>
        </form>
      </Card>

    </div>
  );
}
