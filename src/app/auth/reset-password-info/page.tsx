
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Weka Upya Nenosiri Lako | HSCM Connect',
  description: 'Taarifa kuhusu kuweka upya nenosiri lako.',
};

export default function ResetPasswordInfoPageSw() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-card p-8 rounded-lg shadow-xl border">
        <h1 className="font-headline text-3xl text-foreground mb-6 text-center">
          Weka Upya Nenosiri Lako
        </h1>
        <div className="font-body text-muted-foreground space-y-4">
          <p>
            Ikiwa umeomba kuweka upya nenosiri lako, utapokea barua pepe
            iliyo na kiungo maalum.
          </p>
          <p>
            Tafadhali angalia kikasha chako cha barua pepe kwa ujumbe huu.
            Fuata kiungo katika barua pepe hiyo ili kuunda nenosiri jipya kwa akaunti yako.
          </p>
          <p>
            Kiungo katika barua pepe kitaonekana kama hivi:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="font-semibold">Mfano wa Maudhui ya Barua Pepe:</p>
            <p>Fuata kiungo hiki ili kuweka upya nenosiri kwa mtumiaji wako:</p>
            <p><a href="#" className="text-primary hover:underline">Weka Upya Nenosiri ({{ .ConfirmationURL }})</a></p>
            <p className="text-sm mt-2">
              (Kumbuka: "{{ .ConfirmationURL }}" ni kishika nafasi ambacho kitabadilishwa na kiungo chako cha kipekee cha kuweka upya katika barua pepe halisi.)
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
