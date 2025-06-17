
"use client";

import { AuthForm } from '@/components/forms/auth-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const message = searchParams.get('message');

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  const handleSwitchMode = () => {
    const newMode = mode === 'login' ? 'signup' : 'login';
    setMode(newMode);
    router.replace(`/auth?mode=${newMode}`, { scroll: false }); // Update URL without full navigation
  };

  return (
    <div className="py-12">
      <AuthForm
        mode={mode}
        onSwitchMode={handleSwitchMode}
        initialMessage={message}
      />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
