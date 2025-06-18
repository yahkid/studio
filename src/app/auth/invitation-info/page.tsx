
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'You Have Been Invited | HSCM Connect',
  description: 'Information about accepting an invitation to join.',
};

export default function InvitationInfoPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-card p-8 rounded-lg shadow-xl border">
        <h1 className="font-headline text-3xl text-foreground mb-6 text-center">
          You Have Been Invited
        </h1>
        <div className="font-body text-muted-foreground space-y-4">
          <p>
            If you've received an invitation to create an account on HSCM Connect,
            you will receive an email with a special link.
          </p>
          <p>
            Please check your email inbox for this invitation.
            Follow the link in that email to accept the invite and set up your account.
          </p>
          <p>
            The link in the email will look something like this:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="font-semibold">Example Email Content:</p>
            <p>You have been invited to create a user on {{ .SiteURL }}. Follow this link to accept the invite:</p>
            <p><a href="#" className="text-primary hover:underline">Accept the invite ({{ .ConfirmationURL }})</a></p>
            <p className="text-sm mt-2">
              (Note: Placeholders like "{{ .SiteURL }}" and "{{ .ConfirmationURL }}" will be replaced with specific details in the actual email.)
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
