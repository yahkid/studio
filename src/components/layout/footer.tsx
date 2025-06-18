
import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Command, Users, HandHeart, Film, Handshake } from 'lucide-react'; // Added Users, HandHeart, Film, Handshake for Swahili links

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
                  <span>123 Mtaa wa Imani, Jiji la Huduma, JH 12345</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-hscm-green flex-shrink-0" style={{ width: '20px' }} />
                  <a href="tel:+15551234673" className="hover:text-white transition-colors">(555) 123-TUMAINI</a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-hscm-green flex-shrink-0" style={{ width: '20px' }} />
                  <a href="mailto:ungana@holyspiritconnect.org" className="hover:text-white transition-colors">ungana@holyspiritconnect.org</a>
                </li>
              </ul>
            </div>

            {/* Column 2: Quick Links (Viungo vya Haraka) */}
            <div>
              <h4 className="font-headline text-xl font-semibold text-white mb-6">
                Viungo vya Haraka
              </h4>
              <ul className="space-y-2 font-body text-sm">
                <li><Link href="/#dhamira" className="hover:text-white transition-colors flex items-center"><Users className="mr-2 h-4 w-4"/>Dhamira Yetu</Link></li>
                <li><Link href="/beliefs" className="hover:text-white transition-colors flex items-center"><HandHeart className="mr-2 h-4 w-4"/>Imani Yetu</Link></li>
                <li><Link href="/new" className="hover:text-white transition-colors flex items-center"><Users className="mr-2 h-4 w-4"/>Mimi Mgeni</Link></li>
                <li><Link href="/#tazama-na-ukue" className="hover:text-white transition-colors flex items-center"><Film className="mr-2 h-4 w-4"/>Tazama Ujumbe</Link></li>
                <li><Link href="/#matukio" className="hover:text-white transition-colors flex items-center"><Users className="mr-2 h-4 w-4"/>Matukio</Link></li>
                <li><Link href="/#ushirika" className="hover:text-white transition-colors flex items-center"><Handshake className="mr-2 h-4 w-4"/>Ushirika</Link></li>
                <li><Link href="/decision" className="hover:text-white transition-colors flex items-center"><HandHeart className="mr-2 h-4 w-4"/>Nimeamua Leo</Link></li>
              </ul>
            </div>

            {/* Column 3: Connect With Us (Ungana Nasi) */}
            <div>
              <h4 className="font-headline text-xl font-semibold text-white mb-6">
                Ungana Nasi
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
                  <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors">
                    <Youtube className="h-5 w-5 text-hscm-green" />
                    <span>YouTube</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-[#555555] my-8" />

          <div className="text-center font-body text-muted-foreground" style={{ fontSize: '0.85rem', color: 'var(--neutral-medium)' }}>
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
