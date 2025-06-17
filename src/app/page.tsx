"use client"

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { LeadMagnetModal } from "@/components/modals/lead-magnet-modal";
import { VisitPlannerModal } from "@/components/modals/visit-planner-modal";
import { ExitIntentModal } from "@/components/modals/exit-intent-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, CalendarDays, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';


export default function Home() {
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
  const [isVisitPlannerOpen, setIsVisitPlannerOpen] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-12 py-8">
      <header className="text-center space-y-4">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Welcome to HSCM Connect
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto font-body">
          Discover community, grow in faith, and find your place. We're excited to connect with you!
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <Handshake className="mr-2 h-6 w-6 text-primary" />
              Start Your Journey
            </CardTitle>
            <CardDescription className="font-body">
              New here? Take the first step. Get our exclusive guide to help you get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsLeadMagnetOpen(true)} className="w-full font-headline">
              Get Your 'First Steps' Guide <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <CalendarDays className="mr-2 h-6 w-6 text-primary" />
              Plan Your Visit
            </CardTitle>
            <CardDescription className="font-body">
              Ready to visit us in person? Find service details and let us know you're coming.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsVisitPlannerOpen(true)} className="w-full font-headline">
              Plan Your Visit <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
      
      <section className="w-full max-w-4xl text-center py-8">
        <Image 
          src="https://placehold.co/1200x400.png" 
          alt="Community gathering" 
          width={1200} 
          height={400} 
          className="rounded-lg shadow-md object-cover"
          data-ai-hint="church community" 
        />
        <h2 className="font-headline text-3xl mt-8 mb-4">Connect and Grow</h2>
        <p className="font-body text-lg max-w-xl mx-auto mb-6">
            We offer various ways to connect, from small groups to serving opportunities. 
            Find where you belong and grow with us.
        </p>
        <Button asChild variant="secondary" size="lg" className="font-headline">
            <Link href="/decision">Made a Decision? Share with Us <Users className="ml-2 h-5 w-5" /></Link>
        </Button>
      </section>


      <LeadMagnetModal open={isLeadMagnetOpen} onOpenChange={setIsLeadMagnetOpen} />
      <VisitPlannerModal open={isVisitPlannerOpen} onOpenChange={setIsVisitPlannerOpen} />
      <ExitIntentModal />
    </div>
  );
}
