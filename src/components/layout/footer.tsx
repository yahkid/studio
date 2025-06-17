import Link from "next/link";
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#333333] text-[#D3D3D3] py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-10">
            {/* Column 1: Brand & Contact */}
            <div>
              <h3 className="font-headline text-2xl font-bold text-white mb-6">
                HSCM Connect
              </h3>
              <ul className="space-y-3 font-body text-sm">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>123 Faith Street, Ministry City, MC 12345</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="tel:+15551234673" className="hover:text-white/80 transition-colors">(555) 123-HOPE</a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="mailto:connect@holyspiritconnect.org" className="hover:text-white/80 transition-colors">connect@holyspiritconnect.org</a>
                </li>
              </ul>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-headline text-xl font-semibold text-white mb-6">
                Quick Links
              </h4>
              <ul className="space-y-2 font-body text-sm">
                <li><Link href="/#mission" className="hover:text-white/80 transition-colors">Our Mission</Link></li>
                <li><Link href="/#watch" className="hover:text-white/80 transition-colors">Watch Messages</Link></li>
                <li><Link href="/#events" className="hover:text-white/80 transition-colors">Events</Link></li>
                <li><Link href="/#partnership" className="hover:text-white/80 transition-colors">Partnership</Link></li>
                <li><Link href="/decision" className="hover:text-white/80 transition-colors">I've Raised My Hand</Link></li>
              </ul>
            </div>

            {/* Column 3: Connect With Us */}
            <div>
              <h4 className="font-headline text-xl font-semibold text-white mb-6">
                Connect With Us
              </h4>
              <ul className="space-y-3 font-body text-sm">
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:text-white/80 transition-colors">
                    <span role="img" aria-label="Facebook icon">📘</span>
                    <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:text-white/80 transition-colors">
                    <span role="img" aria-label="Instagram icon">📸</span>
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:text-white/80 transition-colors">
                    <span role="img" aria-label="Twitter icon">🐦</span>
                    <span>Twitter</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:text-white/80 transition-colors">
                    <span role="img" aria-label="YouTube icon">📺</span>
                    <span>YouTube</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-[#555555] my-8" />

          <div className="text-center font-body text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} HSCM Connect Ministry. All rights reserved.
              <span className="mx-2">•</span>
              Built with faith and purpose.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
