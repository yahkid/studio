
"use client";

import { AuthForm } from '@/components/forms/auth-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Loader2 } from 'lucide-react'; // Import the loader

function AuthLoader() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const message = searchParams.get('message');

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSwitchMode = () => {
    const newMode = mode === 'login' ? 'signup' : 'login';
    setMode(newMode);
    router.replace(`/auth?mode=${newMode}`, { scroll: false });
  };

  if (!mounted) {
    return <AuthLoader />;
  }

  return (
    <div className="py-12">
      <AuthForm
        key={mode} // Add key here to re-initialize form on mode change
        mode={mode}
        onSwitchMode={handleSwitchMode}
        initialMessage={message}
      />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthLoader />}>
      <AuthPageContent />
    </Suspense>
  );
}
