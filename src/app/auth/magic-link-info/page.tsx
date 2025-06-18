
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Magic Link Login | HSCM Connect',
  description: 'Information about logging in with a Magic Link.',
};

export default function MagicLinkInfoPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-card p-8 rounded-lg shadow-xl border">
        <h1 className="font-headline text-3xl text-foreground mb-6 text-center">
          Magic Link Login
        </h1>
        <div className="font-body text-muted-foreground space-y-4">
          <p>
            If you've requested to log in using a Magic Link, you will receive an email
            containing a special link.
          </p>
          <p>
            Please check your email inbox for this message.
            Follow the link in that email to securely log in to your account without needing a password.
          </p>
          <p>
            The link in the email will look something like this:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="font-semibold">Example Email Content:</p>
            <p>Follow this link to login:</p>
            <p><a href="#" className="text-primary hover:underline">Log In ({{ .ConfirmationURL }})</a></p>
            <p className="text-sm mt-2">
              (Note: "{{ .ConfirmationURL }}" is a placeholder that will be replaced with your unique login link in the actual email.)
            </p>
          </div>
          <p>
            If you don't see the email within a few minutes, please check your spam or junk folder.
            The link is typically valid for a limited time for security reasons.
          </p>
        </div>
      </div>
    </div>
  );
}
