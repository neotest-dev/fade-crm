'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      // Not signed in — go to the public client portal
      router.push('/reservar');
      return;
    }

    const role = (user.publicMetadata as { role?: string })?.role;
    if (role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/reservar');
    }
  }, [user, isLoaded, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="spinner" />
    </div>
  );
}
