
"use client"

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { LeadMagnetModal } from "@/components/modals/lead-magnet-modal";
import { VisitPlannerModal } from "@/components/modals/visit-planner-modal";
import { ExitIntentModal } from "@/components/modals/exit-intent-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, CalendarDays, Users, ArrowRight, Film, CalendarHeart, HandCoins } from 'lucide-react';
import Link from 'next/link';


export default function Home() {
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
  const [isVisitPlannerOpen, setIsVisitPlannerOpen] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-12 py-8">
      <header className="text-center space-y-4">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          FIND YOUR PURPOSE.
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
            <Button onClick={() => setIsLeadMagnetOpen(true)} className="w-full font-headline font-bold">
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
            <Button onClick={() => setIsVisitPlannerOpen(true)} className="w-full font-headline font-bold">
              Plan Your Visit <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="w-full text-center py-24 space-y-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-12 w-12 text-primary-green mx-auto"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <h2 className="font-headline">Our Mission: A FAMILY BUILT ON FAITH</h2>
        <p className="font-body text-lg max-w-2xl mx-auto mt-4">
          We are a vibrant community dedicated to sharing God’s love, fostering spiritual growth, and making a positive impact. Join us as we build a family rooted in faith and compassion.
        </p>
        <div className="w-32 h-1 mx-auto bg-[#A8B8AD] mt-8"></div>
      </section>

      <section className="w-full max-w-4xl text-center py-8 space-y-6">
        <Film className="h-12 w-12 text-primary mx-auto" />
        <h2 className="font-headline text-3xl">Watch & Grow: A MESSAGE THAT CHANGES EVERYTHING</h2>
        <p className="font-body text-lg max-w-xl mx-auto">
          Explore our library of messages designed to inspire, challenge, and equip you for a life of purpose. Discover teachings that can transform your perspective and deepen your relationship with God.
        </p>
        <Image
          src="https://placehold.co/1200x400.png"
          alt="Message that changes everything"
          width={1200}
          height={400}
          className="rounded-lg shadow-md object-cover"
          data-ai-hint="sermon teaching"
        />
      </section>
      
      <section className="w-full max-w-4xl text-center py-8 space-y-6">
        <Image 
          src="https://placehold.co/1200x400.png" 
          alt="Community gathering for decision pathway" 
          width={1200} 
          height={400} 
          className="rounded-lg shadow-md object-cover"
          data-ai-hint="spiritual decision" 
        />
        <h2 className="font-headline text-3xl mt-8 mb-4">MADE A DECISION TODAY?</h2>
        <p className="font-body text-lg max-w-xl mx-auto mb-6">
            We offer various ways to connect, from small groups to serving opportunities. 
            If you've made a decision for Christ, we'd love to hear from you and help you take your next step.
        </p>
        <Button asChild variant="secondary" size="lg" className="font-headline font-bold">
            <Link href="/decision">Share Your Decision <Users className="ml-2 h-5 w-5" /></Link>
        </Button>
      </section>

      <section className="w-full max-w-4xl text-center py-8 space-y-6">
        <CalendarHeart className="h-12 w-12 text-primary mx-auto" />
        <h2 className="font-headline text-3xl">Events: LIFE IS BETTER TOGETHER</h2>
        <p className="font-body text-lg max-w-xl mx-auto">
          Join us for upcoming events, workshops, and gatherings. It's a great way to connect with others, grow in your faith, and experience the joy of community.
        </p>
        <Image
          src="https://placehold.co/1200x400.png"
          alt="Church events"
          width={1200}
          height={400}
          className="rounded-lg shadow-md object-cover"
          data-ai-hint="church event"
        />
         <Button variant="outline" size="lg" className="font-headline font-bold">
            View Upcoming Events <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>

      <section className="w-full max-w-4xl text-center py-8 space-y-6">
        <HandCoins className="h-12 w-12 text-primary mx-auto" />
        <h2 className="font-headline text-3xl">Partnership: BECOME PART OF THE STORY</h2>
        <p className="font-body text-lg max-w-xl mx-auto">
          Partner with us in spreading hope and transforming lives. Your support helps us continue our mission and reach more people with the message of faith.
        </p>
        <Image
          src="https://placehold.co/1200x400.png"
          alt="Partnership in ministry"
          width={1200}
          height={400}
          className="rounded-lg shadow-md object-cover"
          data-ai-hint="giving support"
        />
        <Button variant="outline" size="lg" className="font-headline font-bold">
            Learn About Partnership <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>

      <LeadMagnetModal open={isLeadMagnetOpen} onOpenChange={setIsLeadMagnetOpen} />
      <VisitPlannerModal open={isVisitPlannerOpen} onOpenChange={setIsVisitPlannerOpen} />
      <ExitIntentModal />
    </div>
  );
}
