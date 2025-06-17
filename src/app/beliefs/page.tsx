import { type Metadata } from 'next';
import { Cross, Bird, SunIcon as Sun } from 'lucide-react'; // Renamed Sun to SunIcon to avoid conflict

export const metadata: Metadata = {
  title: 'Our Beliefs | HSCM Connect',
  description: 'Discover the foundational truths of Holy Spirit Connect Ministry.',
};

interface BeliefSectionProps {
  title: string;
  scripture: string;
  scriptureRef: string;
  children: React.ReactNode;
  Icon: React.ElementType;
}

function BeliefSection({ title, scripture, scriptureRef, children, Icon }: BeliefSectionProps) {
  return (
    <section className="py-12 md:py-16 border-b last:border-b-0">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Icon className="mx-auto h-16 w-16 text-primary mb-6" />
          <h2 className="font-headline text-3xl md:text-4xl text-foreground mb-4">{title}</h2>
          <div className="font-body text-lg text-muted-foreground space-y-4">
            {children}
          </div>
          <p className="font-body text-md text-muted-foreground/80 mt-6 italic">
            "{scripture}" - {scriptureRef}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function OurBeliefsPage() {
  return (
    <div className="bg-background">
      <div className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">Our Beliefs</h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            These are the foundational truths that guide our ministry and our walk with God.
          </p>
        </div>
      </div>

      <BeliefSection
        title="The Cross: Centered on Jesus Christ"
        scripture="For the message of the cross is foolishness to those who are perishing, but to us who are being saved it is the power of God."
        scriptureRef="1 Corinthians 1:18"
        Icon={Cross}
      >
        <p>
          We believe that Jesus Christ, the Son of God, is the cornerstone of our faith. His life, death, and resurrection provide the ultimate sacrifice for sin and the only way to reconciliation with God.
        </p>
        <p>
          Our ministry is centered on proclaiming His gospel, exalting His name, and living according to His teachings. The Cross symbolizes His immense love, sacrifice, and the victory He won for all humanity.
        </p>
      </BeliefSection>

      <BeliefSection
        title="The Dove: Empowered by the Holy Spirit"
        scripture="As soon as Jesus was baptized, he went up out of the water. At that moment heaven was opened, and he saw the Spirit of God descending like a dove and alighting on him."
        scriptureRef="Matthew 3:16"
        Icon={Bird}
      >
        <p>
          We believe in the active presence and power of the Holy Spirit. The Dove symbolizes the Spirit's gentle yet powerful guidance, comfort, and empowerment in the lives of believers.
        </p>
        <p>
          It is through the Holy Spirit that we are equipped for ministry, transformed into Christ's likeness, and united as the body of Christ. We seek to be continually filled and led by the Spirit in all we do.
        </p>
      </BeliefSection>

      <BeliefSection
        title="The Sun: Carrying the Light of the World"
        scripture="When Jesus spoke again to the people, he said, 'I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.'"
        scriptureRef="John 8:12"
        Icon={Sun}
      >
        <p>
          We believe that Jesus is the Light of the World, and as His followers, we are called to reflect His light in a world often covered by darkness. The Sun symbolizes hope, truth, and the life-giving presence of Christ.
        </p>
        <p>
          Our mission is to carry this divine light into every sphere of influence, sharing the good news, bringing hope to the hopeless, and making a tangible difference in our communities and beyond.
        </p>
      </BeliefSection>
    </div>
  );
}