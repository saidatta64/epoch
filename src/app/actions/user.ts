'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: { chessComUsername?: string }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Validate Chess.com username if provided
  if (data.chessComUsername) {
    try {
      const response = await fetch(`https://api.chess.com/pub/player/${data.chessComUsername}`);
      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'Chess.com username not found' };
        }
        return { success: false, error: 'Failed to verify Chess.com username' };
      }

      const profile = await response.json();
      const verificationCode = `EPOCH-${userId.slice(-8)}`;
      
      // Check if the verification code is present in the location
      if (!profile.location || !profile.location.includes(verificationCode)) {
        return { 
          success: false, 
          error: `Verification failed. Please add "${verificationCode}" to your Chess.com location.` 
        };
      }

    } catch (error) {
      console.error('Error verifying Chess.com username:', error);
      return { success: false, error: 'Failed to verify Chess.com username' };
    }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        chessComUsername: data.chessComUsername,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function getUserProfile(): Promise<{ chessComUsername: string | null; verificationCode: string } | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        chessComUsername: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    }) as { chessComUsername: string | null } | null;
    
    return {
      chessComUsername: user?.chessComUsername || null,
      verificationCode: `EPOCH-${userId.slice(-8)}`
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}
