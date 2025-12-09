import Link from 'next/link';
import { Users, BookOpen, Lock, Globe } from 'lucide-react';
import { Classroom } from '@/types/chess';

interface ClassroomCardProps {
  classroom: Classroom;
}

export function ClassroomCard({ classroom }: ClassroomCardProps) {
  return (
    <Link
      href={`/classroom/${classroom.id}`}
      className="group flex flex-col overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md hover:ring-1 hover:ring-blue-200"
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {classroom.title}
          </h3>
          {classroom.isPrivate ? (
            <Lock className="h-4 w-4 text-gray-400" />
          ) : (
            <Globe className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <p className="mt-2 flex-1 text-sm text-gray-500 line-clamp-2">{classroom.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {classroom.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-slate-600 px-3 py-1 text-xs font-medium text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <BookOpen className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
          {classroom.lineCount} lines
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
          {classroom.memberCount}
        </div>
      </div>
      {classroom.user && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
          <div className="flex items-center gap-2">
            {classroom.user.image ? (
              <img
                src={classroom.user.image}
                alt={classroom.user.name || 'Creator'}
                className="h-5 w-5 rounded-full object-cover"
              />
            ) : (
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                {(classroom.user.name || 'A').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 font-medium">
                by {classroom.user.name || 'Anonymous'}
              </span>
              {(classroom.user as any).chessComUsername && (
                <div
                  role="button"
                  className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`https://www.chess.com/member/${(classroom.user as any).chessComUsername}`, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <img src="https://www.chess.com/bundles/web/images/favicon.ico" alt="" className="w-3 h-3" />
                  {(classroom.user as any).chessComUsername}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
