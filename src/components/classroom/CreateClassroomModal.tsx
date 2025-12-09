'use client';

import { useState } from 'react';
import { X, Globe, Lock } from 'lucide-react';
import { createClassroom } from '@/app/actions/classroom';
import { useRouter } from 'next/navigation';

interface CreateClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateClassroomModal({ isOpen, onClose }: CreateClassroomModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('private');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createClassroom({
        title,
        description,
        tags,
        visibility,
      });

      if (result.success) {
        onClose();
        // Reset form
        setTitle('');
        setDescription('');
        setTags('');
        setVisibility('private');
        router.refresh();
      } else {
        alert('Failed to create classroom');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-50 p-8 shadow-2xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create New Classroom</h2>
            <p className="mt-1 text-sm text-slate-600">Set up a new classroom to record and practice opening lines</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Sicilian Defense Repertoire"
              className="w-full border-2 border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this classroom will cover"
              className="h-24 w-full resize-none border-2 border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., Sicilian, Najdorf, 1.e4"
              className="w-full border-2 border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Visibility</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setVisibility('private')}
                className={`flex items-center justify-center gap-2 border-2 px-4 py-3 text-sm font-medium transition-colors ${
                  visibility === 'private'
                    ? 'border-slate-800 bg-slate-800 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Lock className="h-4 w-4" />
                Private
              </button>
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`flex items-center justify-center gap-2 border-2 px-4 py-3 text-sm font-medium transition-colors ${
                  visibility === 'public'
                    ? 'border-slate-800 bg-slate-800 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Globe className="h-4 w-4" />
                Public
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-slate-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-600 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Classroom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
