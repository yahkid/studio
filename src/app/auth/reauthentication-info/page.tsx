
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirm Reauthentication | HSCM Connect',
  description: 'Information about confirming reauthentication, e.g., with a one-time code.',
};

export default function ReauthenticationInfoPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-card p-8 rounded-lg shadow-xl border">
        <h1 className="font-headline text-3xl text-foreground mb-6 text-center">
          Confirm Reauthentication
        </h1>
        <div className="font-body text-muted-foreground space-y-4">
          <p>
            For certain sensitive actions, we may require you to reauthenticate your account.
            You might receive an email or see a prompt asking for a confirmation code.
          </p>
          <p>
            If you are asked to enter a code, it might look like this:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="font-semibold">Example Prompt:</p>
            <p>Enter the code: {{ .Token }}</p>
            <p className="text-sm mt-2">
              (Note: "{{ .Token }}" is a placeholder that will be replaced with your unique code in the actual prompt or email.)
            </p>
          </div>
          <p>
            Please enter this code where prompted to complete the action.
            If you didn't initiate this action, please contact support immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
