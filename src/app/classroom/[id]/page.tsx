import Link from 'next/link';
import { ArrowLeft, Play, Edit } from 'lucide-react';
import { CreateLineButton } from '@/components/classroom/CreateLineButton';
import { VisibilityToggle } from '@/components/classroom/VisibilityToggle';
import { getClassroom } from '@/app/actions/classroom';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function ClassroomDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  const classroom = await getClassroom(id);

  if (!classroom) {
    notFound();
  }

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center gap-4 w-full">
        <Link
          href="/"
          className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="flex flex-col">
          {/* Title + Visibility on same row */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{classroom.title}</h1>

            {classroom.userId === userId && (
              <VisibilityToggle
                classroomId={classroom.id}
                initialVisibility={classroom.visibility as "public" | "private"}
                isOwner={true}
              />
            )}
          </div>

          {/* Description below */}
          <p className="text-sm text-gray-500">{classroom.description}</p>
        </div>

        <div className="ml-auto">
          <CreateLineButton classroomId={classroom.id} />
        </div>
      </div>


      <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-sky-800 px-6 py-4">
          <h2 className="text-base font-semibold leading-6 text-white">Recorded Lines</h2>
        </div>
        <ul role="list" className="divide-y divide-gray-200">
          {classroom.lines.map((line: any) => (
            <li key={line.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{line.title}</p>
                <p className="mt-1 truncate text-xs text-gray-500">
                  Last updated {new Date(line.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/classroom/${classroom.id}/practice/${line.id}`}
                  className="inline-flex items-center bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100"
                >
                  <Play className="mr-1.5 h-4 w-4" />
                  Practice
                </Link>
                <Link
                  href={`/classroom/${classroom.id}/line/${line.id}`}
                  className="inline-flex items-center bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="mr-1.5 h-4 w-4" />
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
