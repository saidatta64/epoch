'use client';

import { useState } from 'react';
import { Plus, BookOpen, Lock, Globe, Calendar, Trash2 } from 'lucide-react';
import { CreateClassroomModal } from '@/components/classroom/CreateClassroomModal';
import { DeleteClassroomModal } from '@/components/classroom/DeleteClassroomModal';
import Link from 'next/link';
import { deleteClassroom } from '@/app/actions/classroom';
import { toast } from 'sonner';

import { Classroom } from '@/types/chess';

interface ClassroomsClientProps {
  classrooms: Classroom[];
}

export function ClassroomsClient({ classrooms }: ClassroomsClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; classroomId: string | null; title: string }>({
    isOpen: false,
    classroomId: null,
    title: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent, classroom: Classroom) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModalState({ isOpen: true, classroomId: classroom.id, title: classroom.title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.classroomId) return;

    setIsDeleting(true);
    try {
      const result = await deleteClassroom(deleteModalState.classroomId);
      if (result.success) {
        toast.success('Classroom deleted successfully');
        setDeleteModalState({ isOpen: false, classroomId: null, title: '' });
      } else {
        toast.error(result.error || 'Failed to delete classroom');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Classrooms</h1>
            <p className="mt-2 text-gray-600">Manage your chess repertoires and training materials</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="cursor-pointer flex items-center gap-2 bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 rounded-lg"
          >
            <Plus className="h-5 w-5" />
            Create Classroom
          </button>
        </div>

        {classrooms.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-white p-12 text-center rounded-xl">
            <div className="mb-4 bg-blue-50 p-4 rounded-full">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No classrooms yet</h3>
            <p className="mt-1 text-gray-500">Create your first classroom to start organizing your lines.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-6 cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              Create new classroom &rarr;
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classrooms.map((classroom) => (
              <Link
                key={classroom.id}
                href={`/classroom/${classroom.id}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-200"
              >
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={(e) => handleDeleteClick(e, classroom)}
                    className="rounded-lg bg-white/90 p-2 text-gray-400 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete classroom"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${classroom.visibility === 'public'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      <div className="flex items-center gap-1">
                        {classroom.visibility === 'public' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        {classroom.visibility.charAt(0).toUpperCase() + classroom.visibility.slice(1)}
                      </div>
                    </div>
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {classroom.title}
                  </h3>

                  <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                    {classroom.description || 'No description provided.'}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {classroom.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-100 bg-gray-50 px-6 py-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(classroom.createdAt).toLocaleDateString()}
                    </div>
                    {/* Placeholder for line count if we had it */}
                    {/* <span>{classroom._count?.lines || 0} lines</span> */}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <CreateClassroomModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

        <DeleteClassroomModal
          isOpen={deleteModalState.isOpen}
          onClose={() => setDeleteModalState({ ...deleteModalState, isOpen: false })}
          onConfirm={handleConfirmDelete}
          classroomTitle={deleteModalState.title}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
