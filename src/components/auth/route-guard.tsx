// src/components/auth/route-guard.tsx
"use client";

import { useAuth } from '@/lib/hooks/use-auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function RouteGuard({ 
  children,
  requireAuth = true 
}: { 
  children: React.ReactNode;
  requireAuth?: boolean;
}) {
  const { user, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized || loading) return;

    if (requireAuth && !user) {
      router.push('/auth?mode=login');
      return;
    }

    if (!requireAuth && user) {
      router.push('/inbox');
      return;
    }
  }, [user, loading, initialized, requireAuth, router]);

  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (requireAuth && !user) return null;
  if (!requireAuth && user) return null;

  return <>{children}</>;
}