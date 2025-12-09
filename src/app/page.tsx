import { auth } from '@clerk/nextjs/server';

import { getUserClassrooms, getPublicClassrooms } from '@/app/actions/classroom';
import { syncUser } from './auth-actions';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingContent } from '@/components/landing/LandingContent';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export default async function HomePage() {
  const { userId } = await auth();

  // Show landing page for unauthenticated users
  if (!userId) {
    return (
      <main className="min-h-screen bg-gray-50">
        <LandingHeader />
        <LandingHero />
        <LandingContent />
        <LandingFooter />
      </main>
    );
  }

  // Ensure the Clerk user is synced to our database
  await syncUser();

  // Fetch user and public classrooms on the server
  const [userClassrooms, publicClassrooms] = await Promise.all([
    getUserClassrooms(),
    getPublicClassrooms(),
  ]);

  // Render the dashboard as a client component with initial data
  return (
    <DashboardClient
      initialUserClassrooms={userClassrooms}
      initialPublicClassrooms={publicClassrooms}
    />
  );
}


