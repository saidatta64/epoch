'use server';

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveLine(title: string, pgn: string, fen?: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check if user exists in DB, if not create them (sync with Clerk)
  // Ideally this should be done via webhooks, but for now we can do lazy creation
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    // Fetch user details from Clerk if needed, but for now just create with ID
    // We might need the email, but let's assume we just need the ID for relation
    // Actually, our schema requires email. We can't get email easily from auth() alone without fetching user.
    // For simplicity, let's assume the user is created via webhook or we fetch it.
    // OR, we can update the schema to make email optional or just store the ID.
    // Let's check the schema.
    // Schema: email String @unique.
    // We should probably make email optional or fetch it.
    // For now, let's throw if user not found, assuming a webhook syncs users.
    // BUT, since we don't have webhooks set up, we should probably do a lazy create if possible.
    // We can use `currentUser()` from clerk to get email.
  }
  
  // Let's use currentUser to get email for lazy creation
  if (!user) {
    const { currentUser } = await import('@clerk/nextjs/server');
    const clerkUser = await currentUser();
    
    if (clerkUser) {
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (email) {
        user = await prisma.user.create({
          data: {
            id: userId,
            email: email,
          }
        });
      }
    }
  }

  if (!user) {
    throw new Error("User not found and could not be created");
  }

  const line = await prisma.line.create({
    data: {
      title,
      pgn,
      fen,
      userId,
    },
  });

  revalidatePath('/dashboard'); // Or wherever we list lines
  return line;
}

export async function getLines() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const lines = await prisma.line.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return lines;
}
