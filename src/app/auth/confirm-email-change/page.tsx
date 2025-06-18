
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thibitisha Mabadiliko ya Barua Pepe | HSCM Connect',
  description: 'Taarifa kuhusu kuthibitisha mabadiliko ya anwani yako ya barua pepe.',
};

export default function ConfirmEmailChangePageSw() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-card p-8 rounded-lg shadow-xl border">
        <h1 className="font-headline text-3xl text-foreground mb-6 text-center">
          Thibitisha Mabadiliko ya Barua Pepe
        </h1>
        <div className="font-body text-muted-foreground space-y-4">
          <p>
            Ikiwa umeomba kubadilisha anwani ya barua pepe inayohusishwa na akaunti yako,
            utapokea barua pepe ili kuthibitisha mabadiliko haya.
          </p>
          <p>
            Tafadhali angalia vikasha vyako vya barua pepe vya zamani na vipya kwa ujumbe wa uthibitisho.
            Fuata kiungo katika barua pepe iliyotumwa kwa anwani yako <strong>mpya ya barua pepe</strong> ili kukamilisha mabadiliko.
          </p>
          <p>
            Kiungo katika barua pepe kitaonekana kama hivi:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="font-semibold">Mfano wa Maudhui ya Barua Pepe (kwa anwani mpya ya barua pepe):</p>
            <p>Fuata kiungo hiki ili kuthibitisha sasisho la barua pepe yako kutoka {{ .Email }} kwenda {{ .NewEmail }}:</p>
            <p><a href="#" className="text-primary hover:underline">Badilisha Barua Pepe ({{ .ConfirmationURL }})</a></p>
            <p className="text-sm mt-2">
              (Kumbuka: Vishika nafasi kama "{{ .Email }}", "{{ .NewEmail }}", na "{{ .ConfirmationURL }}" vitabadilishwa na maelezo yako mahususi katika barua pepe halisi.)
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
