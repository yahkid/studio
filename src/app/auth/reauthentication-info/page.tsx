
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thibitisha Uthibitishaji Upya | HSCM Connect',
  description: 'Taarifa kuhusu kuthibitisha uthibitishaji upya, k.m., kwa nambari ya siri ya mara moja.',
};

export default function ReauthenticationInfoPageSw() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-card p-8 rounded-lg shadow-xl border">
        <h1 className="font-headline text-3xl text-foreground mb-6 text-center">
          Thibitisha Uthibitishaji Upya
        </h1>
        <div className="font-body text-muted-foreground space-y-4">
          <p>
            Kwa vitendo fulani nyeti, tunaweza kukuhitaji uthibitishe upya akaunti yako.
            Unaweza kupokea barua pepe au kuona kidokezo kinachokuuliza nambari ya uthibitisho.
          </p>
          <p>
            Ukiulizwa kuingiza nambari, inaweza kuonekana kama hivi:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="font-semibold">Mfano wa Kidokezo:</p>
            <p>Ingiza nambari: {{ .Token }}</p>
            <p className="text-sm mt-2">
              (Kumbuka: "{{ .Token }}" ni kishika nafasi ambacho kitabadilishwa na nambari yako ya kipekee katika kidokezo halisi au barua pepe.)
            </p>
          </div>
          <p>
            Tafadhali ingiza nambari hii pale unapoombwa ili kukamilisha kitendo.
            Ikiwa hukuamrisha kitendo hiki, tafadhali wasiliana na usaidizi mara moja.
          </p>
        </div>
      </div>
    </div>
  );
}
