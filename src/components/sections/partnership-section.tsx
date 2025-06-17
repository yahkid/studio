import { Button } from '@/components/ui/button';
import { HeartHandshake, HelpingHand, Users, Handshake as PartnershipIcon } from 'lucide-react'; // Renamed Handshake to PartnershipIcon

export function PartnershipSection() {
  return (
    <section id="partnership" className="py-20 bg-muted/50 dark:bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline font-bold text-5xl md:text-6xl text-foreground mb-6">
              Partner With
              <span className="block text-primary">THE MISSION</span>
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your generous partnership enables us to connect the world to the life-changing power of the Gospel, 
              transforming lives and communities with God's love.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8">
              <div className="bg-card rounded-xl p-8 border shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-hscm-red/10 dark:bg-hscm-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="h-6 w-6 text-hscm-red" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-xl text-foreground mb-3">
                      Financial Partnership
                    </h3>
                    <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                      Support our mission through your giving. Every contribution helps us expand our reach
                      and impact in sharing the message of Jesus Christ.
                    </p>
                    <Button
                      className="bg-hscm-red hover:bg-hscm-red/90 text-white font-body font-semibold"
                    >
                      Give Now
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-8 border shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpingHand className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-xl text-foreground mb-3">
                      Prayer Partnership
                    </h3>
                    <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                      Join our prayer team and intercede for our ministry, community,
                      and the needs of those we serve. Your prayers are vital.
                    </p>
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body"
                    >
                      Join Prayer Team
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-8 border shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-xl text-foreground mb-3">
                      Volunteer Partnership
                    </h3>
                    <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                      Use your gifts and talents to serve in various ministries and
                      make a direct impact in people's lives.
                    </p>
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body"
                    >
                      Volunteer Today
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <div className="bg-[#FCFBF8] dark:bg-neutral-dark/30 rounded-2xl p-8 border"> {/* Updated dark mode background slightly */}
                <h3 className="font-headline font-bold text-2xl text-foreground mb-6 text-center">
                  Your Partnership Impact
                </h3>

                <div className="space-y-6 font-body">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lives Transformed Annually</span>
                    <span className="font-headline font-bold text-2xl text-primary">
                      500+
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Families Ministered To</span>
                    <span className="font-headline font-bold text-2xl text-primary">
                      250+
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Community Outreach Events</span>
                    <span className="font-headline font-bold text-2xl text-secondary">
                      50+
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Weekly Online Viewers</span>
                    <span className="font-headline font-bold text-2xl text-secondary">
                      1000+
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-8 border shadow-lg text-center">
                <h3 className="font-headline font-semibold text-xl text-foreground mb-4">
                  Ready to Partner With Us?
                </h3>
                <p className="font-body text-muted-foreground mb-6">
                  Become a vital part of what God is doing through HSCM Connect.
                </p>
                <Button
                  size="lg"
                  className="bg-hscm-gold hover:bg-hscm-gold/90 text-black font-body font-bold w-full px-8 py-4 text-lg" // Using HSCM Gold for this main conversion
                >
                  <PartnershipIcon className="mr-2 h-5 w-5" />
                  Start My Partnership
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}