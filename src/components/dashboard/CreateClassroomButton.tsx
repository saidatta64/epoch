'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateClassroomModal } from '@/components/classroom/CreateClassroomModal';

export function CreateClassroomButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 transition-colors"
      >
        <Plus className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
        Create Classroom
      </button>

      <CreateClassroomModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
