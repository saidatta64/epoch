'use client';

import { useState } from 'react';
import { Globe, Lock } from 'lucide-react';
import { updateClassroomVisibility } from '@/app/actions/classroom';
import { useRouter } from 'next/navigation';

interface VisibilityToggleProps {
    classroomId: string;
    initialVisibility: 'public' | 'private';
    isOwner: boolean;
}

export function VisibilityToggle({ classroomId, initialVisibility, isOwner }: VisibilityToggleProps) {
    const [visibility, setVisibility] = useState(initialVisibility);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    if (!isOwner) {
        return (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                {visibility === 'public' ? (
                    <>
                        <Globe className="h-4 w-4" />
                        <span>Public</span>
                    </>
                ) : (
                    <>
                        <Lock className="h-4 w-4" />
                        <span>Private</span>
                    </>
                )}
            </div>
        );
    }

    const toggleVisibility = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const newVisibility = visibility === 'public' ? 'private' : 'public';
        const result = await updateClassroomVisibility(classroomId, newVisibility);

        if (result.success) {
            setVisibility(newVisibility);
            router.refresh();
        } else {
            console.error('Failed to update visibility');
        }
        setIsLoading(false);
    };

    return (
        <button
            onClick={toggleVisibility}
            disabled={isLoading}
            className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${visibility === 'public'
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
        >
            {visibility === 'public' ? (
                <>
                    <Globe className="h-4 w-4" />
                    <span>Public</span>
                </>
            ) : (
                <>
                    <Lock className="h-4 w-4" />
                    <span>Private</span>
                </>
            )}
        </button>
    );
}
