"use client";

import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cn } from "@/lib/utils";
import Link from 'next/link';

export function FloatingWhatsAppButton() {
  const ministryPhone = "255652796450";
  const message = "Hello! I'm visiting the HSCM Connect website and wanted to get in touch.";
  const whatsappUrl = `https://wa.me/${ministryPhone}?text=${encodeURIComponent(message)}`;

  return (
    <Button
      asChild
      size="icon"
      className={cn(
        'fixed bottom-8 left-8 z-50 rounded-full h-14 w-14 shadow-lg',
        'bg-[#25D366] text-white hover:bg-[#128C7E]'
      )}
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp"
      suppressHydrationWarning
    >
      <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon className="h-7 w-7" />
      </Link>
    </Button>
  );
}
