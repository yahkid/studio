import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, /* For TikTok, consider Music2 or MessageCircle */ Command } from 'lucide-react'; // Command as placeholder for TikTok

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-dark text-[#D3D3D3]" style={{ padding: "5rem 2rem 2rem" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-10">
            {/* Column 1: Brand & Contact */}
            <div>
              <h3 className="font-headline text-2xl font-bold text-white mb-6">
                HSCM Connect
              </h3>
              <ul className="space-y-3 font-body text-sm" style={{ listStyle: 'none', padding: 0 }}>
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-hscm-green flex-shrink-0 mt-0.5" style={{ width: '20px' }} />
                  <span>123 Faith Street, Ministry City, MC 12345</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-hscm-green flex-shrink-0" style={{ width: '20px' }} />
                  <a href="tel:+15551234673" className="hover:text-white transition-colors">(555) 123-HOPE</a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-hscm-green flex-shrink-0" style={{ width: '20px' }} />
                  <a href="mailto:connect@holyspiritconnect.org" className="hover:text-white transition-colors">connect@holyspiritconnect.org</a>
                </li>
              </ul>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-headline text-xl font-semibold text-white mb-6">
                Quick Links
              </h4>
              <ul className="space-y-2 font-body text-sm">
                <li><Link href="/#mission" className="hover:text-white transition-colors">Our Mission</Link></li>
                <li><Link href="/beliefs" className="hover:text-white transition-colors">Our Beliefs</Link></li>
                <li><Link href="/new" className="hover:text-white transition-colors">I'm New</Link></li>
                <li><Link href="/#watch" className="hover:text-white transition-colors">Watch Messages</Link></li>
                <li><Link href="/#events" className="hover:text-white transition-colors">Events</Link></li>
                <li><Link href="/#partnership" className="hover:text-white transition-colors">Partnership</Link></li>
                <li><Link href="/decision" className="hover:text-white transition-colors">I've Raised My Hand</Link></li>
              </ul>
            </div>

            {/* Column 3: Connect With Us */}
            <div>
              <h4 className="font-headline text-xl font-semibold text-white mb-6">
                Connect With Us
              </h4>
              <ul className="space-y-3 font-body text-sm">
                <li>
                  <a href="https://facebook.com/@holyspiritconnect" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-white transition-colors">
                    <Facebook className="h-5 w-5 text-hscm-green" /> 
                    <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/holyspiritconnect" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-white transition-colors">
                    <Instagram className="h-5 w-5 text-hscm-green" />
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="https://tiktok.com/@hscworship" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-white transition-colors">
                    <Command className="h-5 w-5 text-hscm-green" /> {/* Placeholder for TikTok */}
                    <span>TikTok</span>
                  </a>
                </li>
                <li>
                  {/* The text should still say 'YouTube'. */}
                  <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors">
                    <Youtube className="h-5 w-5 text-hscm-green" />
                    <span>YouTube</span> {/* YouTube link is # for now */}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-[#555555] my-8" />

          <div className="text-center font-body text-muted-foreground" style={{ fontSize: '0.85rem', color: 'var(--neutral-medium)' }}>
            <p>
              © {currentYear} HSCM Connect Ministry. All rights reserved.
              <span className="mx-2">•</span>
              Built with faith and purpose.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
