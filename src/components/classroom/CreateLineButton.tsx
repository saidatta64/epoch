'use client';

import { Plus } from 'lucide-react';
import { createLine } from '@/app/actions/line';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { CreateLineModal } from './CreateLineModal';

export function CreateLineButton({ classroomId }: { classroomId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleCreate(title: string) {
    setIsLoading(true);
    try {
      const result = await createLine(classroomId, title);
      if (result.success && result.lineId) {
        toast.success('Line created successfully');
        setIsModalOpen(false); // Close modal on success
        router.push(`/classroom/${classroomId}/line/${result.lineId}`);
      } else {
        toast.error(result.error || 'Failed to create line');
      }
    } catch (error) {
      console.error('Error creating line:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false); // Always reset loading state
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isLoading}
        className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        <Plus className="-ml-0.5 mr-2 h-4 w-4" />
        Record New Line
      </button>

      <CreateLineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isLoading}
      />
    </>
  );
}
