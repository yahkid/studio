
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button'; // Import GradientButton

export function DecisionPathwaySectionSw() {
  return (
    <section id="njia-ya-uamuzi" className="w-full max-w-5xl mx-auto text-center py-16 md:py-24 space-y-6 px-4">
      <Image
        src="https://placehold.co/1200x400.png"
        alt="Mkutano wa jamii kwa ajili ya njia ya uamuzi"
        width={1200}
        height={400}
        className="rounded-lg shadow-md object-cover w-full"
        data-ai-hint="spiritual decision community"
      />
      <h2 className="font-headline text-4xl md:text-5xl text-foreground mt-10 mb-4">
        UMEFANYA UAMUZI LEO?
      </h2>
      <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
        Huu ndio uamuzi mkuu kuliko yote uliyowahi kufanya! Tunataka kusherehekea nawe na kukuongoza katika hatua zako zinazofuata.
      </p>
      <GradientButton asChild className="text-lg" suppressHydrationWarning={true}>
        <Link href="/decision">
          Nimeamua Leo <Users className="ml-2 h-5 w-5" />
        </Link>
      </GradientButton>
    </section>
  );
}
