'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard — Wraps admin-only pages.
 * Redirects non-admin authenticated users to /reservar.
 * Unauthenticated users are already handled by middleware.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/reservar');
      return;
    }
    const role = (user.publicMetadata as { role?: string })?.role;
    if (role !== 'admin') {
      router.push('/reservar');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  const role = (user?.publicMetadata as { role?: string })?.role;
  if (!user || role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return <>{children}</>;
}
