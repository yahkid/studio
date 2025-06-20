
"use client"; // Make this a client component

import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Command, Users, HandHeart, Film, Handshake, MicVocal, Languages } from 'lucide-react'; // Added Languages
import { Button } from "@/components/ui/button"; // Added Button
import { useState, useEffect } from "react"; // Added useState, useEffect

export function Footer() {
  const currentYear = new Date().getFullYear();

  const [currentLanguage, setCurrentLanguage] = useState<'sw' | 'en'>('sw');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem('hscm-connect-language') as 'sw' | 'en' | null;
    if (storedLang) {
      setCurrentLanguage(storedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'sw' ? 'en' : 'sw';
    setCurrentLanguage(newLang);
    if (mounted) {
      localStorage.setItem('hscm-connect-language', newLang);
    }
    // Note: Actual content language change is not implemented here.
    // This just updates the visual state and localStorage.
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
                    P.O. Box 65409, Ilala<br />
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
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
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
                  <Command className="h-8 w-8" /> {/* Placeholder for TikTok */}
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
                <li><Link href="/#dhamira" className="hover:text-white transition-colors flex items-center"><Users className="mr-2 h-4 w-4 text-primary"/>Dhamira Yetu</Link></li>
                <li><Link href="/beliefs" className="hover:text-white transition-colors flex items-center"><HandHeart className="mr-2 h-4 w-4 text-primary"/>Imani Yetu</Link></li>
                <li><Link href="/new" className="hover:text-white transition-colors flex items-center"><Users className="mr-2 h-4 w-4 text-primary"/>Mimi Mgeni</Link></li>
                <li><Link href="/#tazama-na-ukue" className="hover:text-white transition-colors flex items-center"><Film className="mr-2 h-4 w-4 text-primary"/>Tazama Ujumbe</Link></li>
                <li><Link href="/podcast" className="hover:text-white transition-colors flex items-center"><MicVocal className="mr-2 h-4 w-4 text-primary"/>Podikasti</Link></li>
                <li><Link href="/#matukio" className="hover:text-white transition-colors flex items-center"><Users className="mr-2 h-4 w-4 text-primary"/>Matukio</Link></li>
                <li><Link href="/#ushirika" className="hover:text-white transition-colors flex items-center"><Handshake className="mr-2 h-4 w-4 text-primary"/>Ushirika</Link></li>
                <li><Link href="/decision" className="hover:text-white transition-colors flex items-center"><HandHeart className="mr-2 h-4 w-4 text-primary"/>Nimeamua Leo</Link></li>
              </ul>
            </div>
          </div>

          {/* Language Switch Button */}
          <div className="my-8 flex justify-center">
            <Button
              variant="ghost"
              size="sm" // Adjusted size for footer
              className="rounded-md text-xs sm:text-sm text-[#D3D3D3] hover:text-white hover:bg-white/10 transition-colors"
              title={mounted ? (currentLanguage === 'sw' ? "Switch to English" : "Badilisha kwenda Kiswahili") : "Switch Language"}
              aria-label={mounted ? (currentLanguage === 'sw' ? "Switch to English" : "Badilisha kwenda Kiswahili") : "Switch Language"}
              onClick={toggleLanguage}
              suppressHydrationWarning={true}
            >
              <Languages className="h-5 w-5 mr-2" />
              {mounted ? (currentLanguage === 'sw' ? "English" : "Kiswahili") : "Language"}
            </Button>
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
