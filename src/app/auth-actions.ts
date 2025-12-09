'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUser() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const email = user.emailAddresses[0]?.emailAddress;
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Anonymous';
    const image = user.imageUrl;
    
    if (!email) {
      return { success: false, error: "No email found" };
    }

    // Upsert user: create if not exists, update if exists
    await prisma.user.upsert({
      where: { id: userId },
      update: { 
        email,
        name,
        image
      },
      create: {
        id: userId,
        email,
        name,
        image
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to sync user:", error);
    return { success: false, error: "Database error" };
  }
}
