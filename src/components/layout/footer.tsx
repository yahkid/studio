
"use client"; 

import Link from "next/link";
import { 
  MapPin, Phone, Mail as MailIconLucide, Facebook, Instagram, Youtube, Command, 
  Users, HandHeart, Film, Handshake, MicVocal, Mail, Loader2, Shield, Heart, 
  BookOpen, Download, FileText 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const quickLinks = [
    { href: "/beliefs", label: "Imani Yetu", icon: HandHeart },
    { href: "/uongozi", label: "Uongozi Wetu", icon: Shield },
    { href: "/new", label: "Mimi Mgeni", icon: Users },
    { href: "/kozi", label: "Kozi za Kujifunza", icon: BookOpen },
    { href: "/huduma", label: "Kutumika", icon: Heart },
    { href: "/resources", label: "Rasilimali", icon: Download },
    { href: "/sermons", label: "Mahubiri", icon: Film },
    { href: "/podcast", label: "Podikasti", icon: MicVocal },
    { href: "/blog", label: "Blog", icon: FileText },
    { href: "/matukio", label: "Matukio", icon: Users },
    { href: "/partner", label: "Ushirika", icon: Handshake },
    { href: "/decision", label: "Nimeamua Leo", icon: HandHeart },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const [footerEmail, setFooterEmail] = useState('');
  const [isFooterSignupLoading, setIsFooterSignupLoading] = useState(false);
  const { toast } = useToast();

  const handleFooterEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail || !/\S+@\S+\.\S+/.test(footerEmail)) {
      toast({
        title: "Barua Pepe Batili",
        description: "Tafadhali ingiza anwani sahihi ya barua pepe.",
        variant: "destructive",
      });
      return;
    }

    setIsFooterSignupLoading(true);
    try {
      await addDoc(collection(db, 'weekly_updates_signups'), {
        email: footerEmail,
        created_at: serverTimestamp(),
        source: 'footer_signup'
      });

      toast({
        title: "Umefanikiwa Kujisajili!",
        description: "Utapokea taarifa zetu za kila wiki.",
      });
      setFooterEmail('');
    } catch (error: any) {
      console.error('Error submitting footer email signup to Firestore:', error);
      toast({
        title: "Hitilafu Imetokea",
        description: `Imeshindwa kuwasilisha barua pepe yako. Tafadhali jaribu tena. ${error.message || ""}`,
        variant: "destructive",
      });
    } finally {
      setIsFooterSignupLoading(false);
    }
  };

  return (
    <footer className="bg-background-dark text-[#D3D3D3]" style={{ padding: "5rem 2rem 2rem" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-10">
            {/* Column 1: Contact Info */}
            <div>
              <h3 className="font-headline text-xl font-semibold text-white mb-6">
                Mawasiliano
              </h3>
              <div className="space-y-3 font-body text-sm text-[#D3D3D3]">
                <p className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    Barabara ya Nyerere, DSM<br />
                    Dar es Salaam, Tanzania
                  </span>
                </p>
                <p className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Simu: </span>
                  <a href="tel:+255652796450" className="hover:text-white transition-colors">
                    +255 652 796 450
                  </a>
                </p>
                <p className="flex items-center space-x-3">
                  <MailIconLucide className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Barua Pepe: </span>
                  <a href="mailto:info@holyspiritconnect.org" className="hover:text-white transition-colors">
                    info@holyspiritconnect.org
                  </a>
                </p>
                <p className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    Mahali: Barabara ya Nyerere, DSM <br />
                    <a
                      href="https://maps.app.goo.gl/5z3dGxia6ZDKoiMo7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-hscm-gold hover:text-hscm-gold/80 transition-colors"
                    >
                      Tazama Kwenye Ramani &rarr;
                    </a>
                  </span>
                </p>
              </div>
            </div>

            {/* Column 2: Connect With Us (Central Focus) */}
            <div className="md:text-center">
              <h3 className="font-headline text-xl font-semibold text-white mb-6">
                Ungana Nasi
              </h3>
              <div className="flex md:justify-center space-x-5">
                <a href="https://facebook.com/@holyspiritconnect" target="_blank" rel="noopener noreferrer" aria-label="HSCM Facebook" className="text-[#D3D3D3] hover:text-white transition-colors">
                  <Facebook className="h-8 w-8" />
                </a>
                <a href="https://instagram.com/holyspiritconnect" target="_blank" rel="noopener noreferrer" aria-label="HSCM Instagram" className="text-[#D3D3D3] hover:text-white transition-colors">
                  <Instagram className="h-8 w-8" />
                </a>
                <a href="https://tiktok.com/@hscworship" target="_blank" rel="noopener noreferrer" aria-label="HSCM TikTok" className="text-[#D3D3D3] hover:text-white transition-colors">
                   <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor">
                    <title>TikTok</title>
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.85-.38-6.95-1.48-2.05-1.08-3.5-2.95-4.17-5.12-.52-1.68-.56-3.43-.44-5.16.24-3.34 1.91-6.42 4.84-8.18 2.12-1.26 4.6-1.66 6.92-1.15.02 1.52.01 3.04.01 4.57-.93-.13-1.86-.21-2.79-.21-1.95 0-3.59.85-4.43 2.59-.49 1.06-.52 2.34-.04 3.48.49 1.14 1.36 2.02 2.58 2.45 1.18.42 2.5.34 3.59-.11.18-.08.34-.17.51-.27v-4.67c.01-1.19-.43-2.33-1.25-3.16C9.92 6.13 8.7 5.56 7.4 5.56c-.02 0-.03 0-.05 0v-4.2c.98.05 1.96.12 2.94.12 1.17 0 2.34-.05 3.51-.08z" />
                  </svg>
                </a>
                <a href="#" aria-label="HSCM YouTube" className="text-[#D3D3D3] hover:text-white transition-colors">
                  <Youtube className="h-8 w-8" />
                </a>
              </div>
            </div>

            {/* Column 3: Quick Links */}
            <div>
              <h3 className="font-headline text-xl font-semibold text-white mb-6">
                Viungo vya Haraka
              </h3>
              <ul className="space-y-2 font-body text-sm">
                {quickLinks.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-white transition-colors flex items-center">
                      <Icon className="mr-2 h-4 w-4 text-primary" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup Section */}
          <div className="my-10 py-8 border-t border-b border-zinc-700 text-center">
            <h4 className="font-headline text-lg font-semibold text-white mb-3">
              Endelea Kuunganishwa
            </h4>
            <p className="font-body text-sm text-zinc-400 mb-5 max-w-md mx-auto">
              Pata jumbe za kutia moyo, habari za matukio, na mafundisho mapya moja kwa moja kwenye barua pepe yako.
            </p>
            <form onSubmit={handleFooterEmailSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Label htmlFor="footer-email-signup" className="sr-only">Barua pepe</Label>
              <div className="relative flex-grow w-full sm:w-auto">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="footer-email-signup"
                  type="email"
                  placeholder="Weka barua pepe yako"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  className="pl-10 pr-3 py-2.5 w-full font-body text-sm bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-primary focus:border-primary"
                  required
                  disabled={isFooterSignupLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="font-headline text-sm bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto shrink-0" 
                disabled={isFooterSignupLoading}
              >
                {isFooterSignupLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isFooterSignupLoading ? 'Inatuma...' : 'Jisajili'}
              </Button>
            </form>
             <p className="text-xs text-zinc-500 mt-3">Hatutakutumia barua taka.</p>
          </div>

          <hr className="border-zinc-700 my-8" />

          <div className="text-center font-body text-zinc-400 text-sm">
            <p>
              © {currentYear} Huduma ya HSCM Connect. Haki zote zimehifadhiwa.
              <span className="mx-2">•</span>
              Imejengwa kwa imani na kusudi.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
