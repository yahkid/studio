import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">H</span>
                </div>
                <Link href="/" className="font-headline font-bold text-xl text-foreground">
                  Holy Spirit Connect
                </Link>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed font-body">
                Transforming lives through the power of God's love and building a community
                where everyone can find their purpose and grow in faith.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground font-body">
                <p>📍 123 Faith Street, Ministry City, MC 12345</p>
                <p>📞 (555) 123-HOPE</p>
                <p>📧 connect@holyspiritconnect.org</p>
              </div>
            </div>

            <div>
              <h3 className="font-headline font-semibold text-lg text-foreground mb-4">
                Quick Links
              </h3>
              <div className="space-y-2 font-body">
                <a href="/#mission" className="block text-muted-foreground hover:text-primary transition-colors">
                  Our Mission
                </a>
                <a href="/#watch" className="block text-muted-foreground hover:text-primary transition-colors">
                  Watch Messages
                </a>
                <a href="/#events" className="block text-muted-foreground hover:text-primary transition-colors">
                  Events
                </a>
                <a href="/#partnership" className="block text-muted-foreground hover:text-primary transition-colors">
                  Partnership
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-headline font-semibold text-lg text-foreground mb-4">
                Connect With Us
              </h3>
              <div className="space-y-3 font-body">
                <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                  <span>📘</span>
                  <span>Facebook</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                  <span>📸</span>
                  <span>Instagram</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                  <span>🐦</span>
                  <span>Twitter</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                  <span>📺</span>
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center font-body">
            <p className="text-muted-foreground">
              © 2025 Holy Spirit Connect Ministry. All rights reserved.
              <span className="mx-2">•</span>
              Built with faith and purpose.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
