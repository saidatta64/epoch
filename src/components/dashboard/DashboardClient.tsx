'use client';

import { useState } from 'react';

import { Classroom } from '@/types/chess';
import { ClassroomCard } from '@/components/dashboard/ClassroomCard';
import { OpeningSearch } from '@/components/dashboard/OpeningSearch';

interface DashboardClientProps {
  initialPublicClassrooms: Classroom[];
  initialUserClassrooms: Classroom[];
}

export function DashboardClient({
  initialPublicClassrooms,
  initialUserClassrooms,
}: DashboardClientProps) {
  const [publicClassrooms] = useState<Classroom[]>(initialPublicClassrooms);
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>(initialPublicClassrooms);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredClassrooms(publicClassrooms);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = publicClassrooms.filter((classroom) => {
      const titleMatch = classroom.title.toLowerCase().includes(lowerQuery);
      const descriptionMatch = classroom.description?.toLowerCase().includes(lowerQuery);
      const tagsMatch = classroom.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
      return titleMatch || descriptionMatch || tagsMatch;
    });
    setFilteredClassrooms(filtered);
  };

  return (
    <div className="space-y-12">
      {/* Public Classrooms Section */}
      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Explore Repertoires</h2>
            <p className="mt-1 text-sm text-gray-500">
              Discover and practice community-created openings
            </p>
          </div>
          <OpeningSearch onSearch={handleSearch} />
        </div>

        {filteredClassrooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No openings found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClassrooms.map((classroom) => (
              <ClassroomCard key={classroom.id} classroom={classroom} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


