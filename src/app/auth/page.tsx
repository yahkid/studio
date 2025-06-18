
"use client";

import { AuthForm } from '@/components/forms/auth-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

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
    router.replace(`/auth?mode=${newMode}`, { scroll: false }); // Update URL without full navigation
  };

  if (!mounted) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><div>Loading auth form...</div></div>; 
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
    <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><div>Loading page...</div></div>}>
      <AuthPageContent />
    </Suspense>
  );
}
