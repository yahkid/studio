
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirm Your Signup | HSCM Connect',
  description: 'Information about confirming your email address.',
};

export default function ConfirmationInfoPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-card p-8 rounded-lg shadow-xl border">
        <h1 className="font-headline text-3xl text-foreground mb-6 text-center">
          Confirm your signup
        </h1>
        <div className="font-body text-muted-foreground space-y-4">
          <p>
            Thank you for signing up! To complete your registration, please check your email inbox.
          </p>
          <p>
            You should receive an email from us shortly. Follow the link in that email to confirm your user account.
          </p>
          <p>
            The link in the email will look something like this:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="font-semibold">Example Email Content:</p>
            <p>Follow this link to confirm your user:</p>
            <p><a href="#" className="text-primary hover:underline">Confirm your mail ({{ .ConfirmationURL }})</a></p>
            <p className="text-sm mt-2">
              (Note: "{{ .ConfirmationURL }}" is a placeholder that will be replaced with your unique confirmation link in the actual email.)
            </p>
          </div>
          <p>
            If you don't see the email within a few minutes, please check your spam or junk folder.
          </p>
        </div>
      </div>
    </div>
  );
}
