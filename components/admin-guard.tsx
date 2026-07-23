'use client';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard — Wraps admin-only pages.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  return <>{children}</>;
}

