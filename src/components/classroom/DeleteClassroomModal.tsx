'use client';

import { X, AlertTriangle } from 'lucide-react';

interface DeleteClassroomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    classroomTitle: string;
    isLoading: boolean;
}

export function DeleteClassroomModal({
    isOpen,
    onClose,
    onConfirm,
    classroomTitle,
    isLoading,
}: DeleteClassroomModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white p-6 shadow-2xl rounded-lg border border-gray-100">
                <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-red-100 p-2">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Delete Classroom</h2>
                            <p className="text-sm text-gray-500">This action cannot be undone.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-8">
                    <p className="text-gray-600">
                        Are you sure you want to delete <span className="font-semibold text-gray-900">"{classroomTitle}"</span>?
                        All lines and progress within this classroom will be permanently removed.
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete Classroom'}
                    </button>
                </div>
            </div>
        </div>
    );
}
