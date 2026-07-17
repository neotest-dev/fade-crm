'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <p className="text-[#888888]">Redirigiendo...</p>
    </div>
  );
}
