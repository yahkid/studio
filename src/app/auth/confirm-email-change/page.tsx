
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirm Email Change | HSCM Connect',
  description: 'Information about confirming your email address change.',
};

export default function ConfirmEmailChangePage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-card p-8 rounded-lg shadow-xl border">
        <h1 className="font-headline text-3xl text-foreground mb-6 text-center">
          Confirm Email Change
        </h1>
        <div className="font-body text-muted-foreground space-y-4">
          <p>
            If you've requested to change the email address associated with your account,
            you will receive an email to confirm this change.
          </p>
          <p>
            Please check both your old and new email inboxes for confirmation messages.
            Follow the link in the email sent to your <strong>new email address</strong> to complete the change.
          </p>
          <p>
            The link in the email will look something like this:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="font-semibold">Example Email Content (to new email address):</p>
            <p>Follow this link to confirm the update of your email from {{ .Email }} to {{ .NewEmail }}:</p>
            <p><a href="#" className="text-primary hover:underline">Change Email ({{ .ConfirmationURL }})</a></p>
            <p className="text-sm mt-2">
              (Note: Placeholders like "{{ .Email }}", "{{ .NewEmail }}", and "{{ .ConfirmationURL }}" will be replaced with your specific details in the actual email.)
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
