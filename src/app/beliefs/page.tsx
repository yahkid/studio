
import { type Metadata } from 'next';
import { Cross, Bird, SunIcon as Sun } from 'lucide-react'; 

export const metadata: Metadata = {
  title: 'Imani Yetu | HSCM Connect',
  description: 'Gundua kweli za msingi za Huduma ya Holy Spirit Connect.',
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

export default function ImaniYetuPage() {
  return (
    <div className="bg-background">
      <div className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">Imani Yetu</h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Hizi ndizo kweli za msingi zinazoongoza huduma yetu na matembezi yetu na Mungu.
          </p>
        </div>
      </div>

      <BeliefSection
        title="Msalaba: Kituo Chetu ni Yesu Kristo"
        scripture="Kwa maana neno la msalaba kwao wanaopotea ni upuuzi, bali kwetu sisi tunaookolewa ni nguvu ya Mungu."
        scriptureRef="1 Wakorintho 1:18"
        Icon={Cross}
      >
        <p>
          Tunaamini kwamba Yesu Kristo, Mwana wa Mungu, ndiye jiwe kuu la pembeni la imani yetu. Maisha yake, kifo, na ufufuo wake vinatoa dhabihu kuu kwa ajili ya dhambi na njia pekee ya upatanisho na Mungu.
        </p>
        <p>
          Huduma yetu imejikita katika kutangaza Injili yake, kulitukuza jina lake, na kuishi kulingana na mafundisho yake. Msalaba unaashiria upendo wake mkuu, dhabihu, na ushindi alioupata kwa wanadamu wote.
        </p>
      </BeliefSection>

      <BeliefSection
        title="Njiwa: Kuwezeshwa na Roho Mtakatifu"
        scripture="Naye Yesu alipokwisha kubatizwa, mara akapanda kutoka majini; na tazama, mbingu zikamfunukia, akamwona Roho wa Mungu akishuka kama njiwa, akija juu yake."
        scriptureRef="Mathayo 3:16"
        Icon={Bird}
      >
        <p>
          Tunaamini katika uwepo hai na nguvu za Roho Mtakatifu. Njiwa inaashiria uongozi wa Roho ulio mpole lakini wenye nguvu, faraja, na uwezeshaji katika maisha ya waumini.
        </p>
        <p>
          Ni kupitia Roho Mtakatifu ndipo tunapowezeshwa kwa huduma, kubadilishwa kuwa mfano wa Kristo, na kuunganishwa kama mwili wa Kristo. Tunatafuta kujazwa na kuongozwa na Roho daima katika yote tunayofanya.
        </p>
      </BeliefSection>

      <BeliefSection
        title="Jua: Kubeba Nuru ya Ulimwengu"
        scripture="Basi Yesu akawaambia tena akiwaambia, Mimi ndimi nuru ya ulimwengu; anifuataye mimi hatakwenda gizani kamwe, bali atakuwa na nuru ya uzima."
        scriptureRef="Yohana 8:12"
        Icon={Sun}
      >
        <p>
          Tunaamini kwamba Yesu ndiye Nuru ya Ulimwengu, na kama wafuasi wake, tumeitwa kuakisi nuru yake katika ulimwengu ambao mara nyingi umefunikwa na giza. Jua linaashiria tumaini, ukweli, na uwepo wa Kristo unaotoa uzima.
        </p>
        <p>
          Dhamira yetu ni kubeba nuru hii ya kimungu katika kila eneo la ushawishi, kushiriki habari njema, kuleta tumaini kwa wasio na tumaini, na kuleta tofauti inayoonekana katika jamii zetu na kwingineko.
        </p>
      </BeliefSection>
    </div>
  );
}
