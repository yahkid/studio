
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ingia kwa Kiungo cha Kichawi | HSCM Connect',
  description: 'Taarifa kuhusu kuingia kwa kutumia Kiungo cha Kichawi.',
};

export default function MagicLinkInfoPageSw() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-card p-8 rounded-lg shadow-xl border">
        <h1 className="font-headline text-3xl text-foreground mb-6 text-center">
          Ingia kwa Kiungo cha Kichawi
        </h1>
        <div className="font-body text-muted-foreground space-y-4">
          <p>
            Ikiwa umeomba kuingia kwa kutumia Kiungo cha Kichawi, utapokea barua pepe
            iliyo na kiungo maalum.
          </p>
          <p>
            Tafadhali angalia kikasha chako cha barua pepe kwa ujumbe huu.
            Fuata kiungo katika barua pepe hiyo ili kuingia kwa usalama kwenye akaunti yako bila kuhitaji nenosiri.
          </p>
          <p>
            Kiungo katika barua pepe kitaonekana kama hivi:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="font-semibold">Mfano wa Maudhui ya Barua Pepe:</p>
            <p>Fuata kiungo hiki ili kuingia:</p>
            <p><a href="#" className="text-primary hover:underline">Ingia ({{ .ConfirmationURL }})</a></p>
            <p className="text-sm mt-2">
              (Kumbuka: "{{ .ConfirmationURL }}" ni kishika nafasi ambacho kitabadilishwa na kiungo chako cha kipekee cha kuingia katika barua pepe halisi.)
            </p>
          </div>
          <p>
            Ikiwa huoni barua pepe hiyo ndani ya dakika chache, tafadhali angalia folda yako ya taka (spam/junk).
            Kiungo hicho huwa na muda maalum wa matumizi kwa sababu za kiusalama.
          </p>
        </div>
      </div>
    </div>
  );
}
