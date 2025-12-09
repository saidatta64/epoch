'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma'; // Assuming this is where prisma client is exported
import { revalidatePath } from 'next/cache';
import { Classroom } from '@/types/chess';

export async function initializeUserDefaults(userId: string) {
  // Default classrooms are no longer created automatically
  return;
}

export async function createClassroom(data: {
  title: string;
  description: string;
  tags: string;
  visibility: 'public' | 'private';
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const tagsArray = data.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag !== '');

  try {
    const classroom = await prisma.classroom.create({
      data: {
        title: data.title,
        description: data.description,
        tags: tagsArray,
        visibility: data.visibility,
        userId,
      },
    });

    revalidatePath('/classrooms');
    revalidatePath('/'); // Revalidate public dashboard
    return { success: true, classroom };
  } catch (error) {
    console.error('Error creating classroom:', error);
    return { success: false, error: 'Failed to create classroom' };
  }
}

export async function getPublicClassrooms(): Promise<Classroom[]> {
  try {
    console.log('[getPublicClassrooms] Fetching public classrooms...');
    const classrooms = await prisma.classroom.findMany({
      where: {
        visibility: 'public',
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { lines: true },
        },
        user: {
          select: {
            name: true,
            image: true,
            chessComUsername: true,
          } as any
        }
      },
    });

    console.log(`[getPublicClassrooms] Fetched ${classrooms.length} public classrooms`);

    return (classrooms as any).map((c: any) => ({
      ...c,
      description: c.description || '',
      lines: [],
      memberCount: 1,
      lineCount: c._count.lines,
      isPrivate: false,
      updatedAt: c.updatedAt.toISOString(),
      user: c.user,
    }));
  } catch (error) {
    console.error('[getPublicClassrooms] Error fetching public classrooms:', error);
    return [];
  }
}

export async function getUserClassrooms(): Promise<Classroom[]> {
  const { userId } = await auth();
  console.log('[getUserClassrooms] Auth check:', { userId });

  if (!userId) {
    console.log('[getUserClassrooms] No userId, returning empty array');
    return [];
  }

  try {
    const classrooms = await prisma.classroom.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { lines: true },
        },
        user: {
          select: {
            name: true,
            image: true,
            chessComUsername: true,
          } as any
        }
      },
    });

    console.log(`[getUserClassrooms] Fetched ${classrooms.length} classrooms for user ${userId}`);
    
    const mapped = (classrooms as any).map((c: any) => ({
      ...c,
      description: c.description || '',
      lines: [], // Don't load lines for dashboard
      memberCount: 1, // Placeholder
      lineCount: c._count.lines,
      isPrivate: c.visibility === 'private',
      updatedAt: c.updatedAt.toISOString(),
      user: c.user,
    }));
    
    console.log('[getUserClassrooms] Mapped classrooms:', mapped.length);
    return mapped;
  } catch (error) {
    console.error('[getUserClassrooms] Error fetching classrooms:', error);
    return [];
  }
}

export async function getClassroom(id: string) {
  const { userId } = await auth();
  console.log('getClassroom called for id:', id, 'userId:', userId);

  if (!userId) {
    console.log('getClassroom: No userId');
    return null;
  }

  try {
    const classroom = await prisma.classroom.findUnique({
      where: {
        id,
      },
      include: {
        lines: true,
      },
    });
    console.log('getClassroom result:', classroom ? 'Found' : 'Not Found');

    if (!classroom) {
      return null;
    }

    // Check visibility/access (basic check for now: owner or public)
    if (classroom.visibility === 'private' && classroom.userId !== userId) {
      console.log('getClassroom: Access denied. Owner:', classroom.userId, 'Requestor:', userId);
      return null;
    }

    return classroom;
  } catch (error) {
    console.error('Error fetching classroom:', error);
    return null;
  }
}

export async function deleteClassroom(classroomId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    // Verify ownership
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
    });

    if (!classroom) {
      return { success: false, error: 'Classroom not found' };
    }

    if (classroom.userId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Delete the classroom
    await prisma.classroom.delete({
      where: { id: classroomId },
    });

    revalidatePath('/classrooms');
    return { success: true };
  } catch (error) {
    console.error('Error deleting classroom:', error);
    return { success: false, error: 'Failed to delete classroom' };
  }
}

export async function updateClassroomVisibility(id: string, visibility: 'public' | 'private') {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const classroom = await prisma.classroom.findUnique({
      where: { id },
    });

    if (!classroom) {
      return { success: false, error: 'Classroom not found' };
    }

    if (classroom.userId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.classroom.update({
      where: { id },
      data: { visibility },
    });

    revalidatePath(`/classroom/${id}`);
    revalidatePath('/classrooms');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating classroom visibility:', error);
    return { success: false, error: 'Failed to update visibility' };
  }
}
