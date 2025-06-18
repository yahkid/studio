
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thibitisha Usajili Wako | HSCM Connect',
  description: 'Taarifa kuhusu kuthibitisha anwani yako ya barua pepe.',
};

export default function ConfirmationInfoPageSw() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-card p-8 rounded-lg shadow-xl border">
        <h1 className="font-headline text-3xl text-foreground mb-6 text-center">
          Thibitisha usajili wako
        </h1>
        <div className="font-body text-muted-foreground space-y-4">
          <p>
            Asante kwa kujisajili! Ili kukamilisha usajili wako, tafadhali angalia kikasha chako cha barua pepe.
          </p>
          <p>
            Unapaswa kupokea barua pepe kutoka kwetu hivi karibuni. Fuata kiungo katika barua pepe hiyo ili kuthibitisha akaunti yako ya mtumiaji.
          </p>
          <p>
            Kiungo katika barua pepe kitaonekana kama hivi:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="font-semibold">Mfano wa Maudhui ya Barua Pepe:</p>
            <p>Fuata kiungo hiki ili kuthibitisha mtumiaji wako:</p>
            <p><a href="#" className="text-primary hover:underline">Thibitisha barua pepe yako ({"{{ .ConfirmationURL }}"})</a></p>
            <p className="text-sm mt-2">
              (Kumbuka: "{"{{ .ConfirmationURL }}"}" ni kishika nafasi ambacho kitabadilishwa na kiungo chako cha kipekee cha uthibitishaji katika barua pepe halisi.)
            </p>
          </div>
          <p>
            Ikiwa huoni barua pepe hiyo ndani ya dakika chache, tafadhali angalia folda yako ya taka (spam/junk).
          </p>
        </div>
      </div>
    </div>
  );
}
