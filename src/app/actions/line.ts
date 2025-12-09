'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { Prisma } from '@prisma/client';

export async function createLine(classroomId: string, title: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const line = await prisma.line.create({
      data: {
        title,
        pgn: '',
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Start position
        userId,
        classrooms: {
          connect: { id: classroomId },
        },
      },
    });

    revalidatePath(`/classroom/${classroomId}`);
    return { success: true, lineId: line.id };
  } catch (error) {
    console.error('Error creating line:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[];
        if (target && target.includes('title')) {
          return { success: false, error: 'A line with this title already exists' };
        }
        if (target && target.includes('pgn')) {
          return { success: false, error: 'This exact line (PGN) already exists' };
        }
        return { success: false, error: 'This line already exists' };
      }
    }

    return { success: false, error: 'Failed to create line' };
  }
}

export async function updateLine(lineId: string, data: { title?: string; pgn?: string; fen?: string }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const line = await prisma.line.update({
      where: {
        id: lineId,
        userId, // Ensure ownership
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    revalidatePath('/dashboard');
    // We might want to revalidate the specific line page or classroom page too, but dashboard is safe default
    return { success: true, line };
  } catch (error) {
    console.error('Error updating line:', error);
    return { success: false, error: 'Failed to update line' };
  }
}

export async function getLine(lineId: string) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const line = await prisma.line.findUnique({
      where: {
        id: lineId,
      },
    });

    // Check if line exists and user has access
    if (!line) {
      return null;
    }

    // For now, allow access if line exists (we can add ownership/classroom checks later)
    return line;
  } catch (error) {
    console.error('Error fetching line:', error);
    return null;
  }
}
