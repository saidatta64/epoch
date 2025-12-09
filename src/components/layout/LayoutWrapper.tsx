'use client';

import { useAuth } from '@clerk/nextjs';
import { Sidebar } from '@/components/layout/Sidebar';
import { usePathname } from 'next/navigation';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();

  // Show landing page layout (no sidebar) for unauthenticated users on home page
  const showLandingLayout = !isSignedIn && pathname === '/';

  if (showLandingLayout) {
    return <>{children}</>;
  }

  // Show dashboard layout with sidebar for authenticated users
  return (
    <div className="flex h-full bg-white transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
