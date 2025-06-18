
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Umealikwa | HSCM Connect',
  description: 'Taarifa kuhusu kukubali mwaliko wa kujiunga.',
};

export default function InvitationInfoPageSw() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-card p-8 rounded-lg shadow-xl border">
        <h1 className="font-headline text-3xl text-foreground mb-6 text-center">
          Umealikwa
        </h1>
        <div className="font-body text-muted-foreground space-y-4">
          <p>
            Ikiwa umepokea mwaliko wa kuunda akaunti kwenye HSCM Connect,
            utapokea barua pepe yenye kiungo maalum.
          </p>
          <p>
            Tafadhali angalia kikasha chako cha barua pepe kwa mwaliko huu.
            Fuata kiungo katika barua pepe hiyo ili kukubali mwaliko na kuweka akaunti yako.
          </p>
          <p>
            Kiungo katika barua pepe kitaonekana kama hivi:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="font-semibold">Mfano wa Maudhui ya Barua Pepe:</p>
            <p>Umealikwa kuunda mtumiaji kwenye {"{{ .SiteURL }}"}. Fuata kiungo hiki ili kukubali mwaliko:</p>
            <p><a href="#" className="text-primary hover:underline">Kubali mwaliko ({"{{ .ConfirmationURL }}"})</a></p>
            <p className="text-sm mt-2">
              (Kumbuka: Vishika nafasi kama "{"{{ .SiteURL }}"}" na "{"{{ .ConfirmationURL }}"}" vitabadilishwa na maelezo mahususi katika barua pepe halisi.)
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
