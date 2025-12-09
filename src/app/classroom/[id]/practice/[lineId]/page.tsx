import { getLine } from '@/app/actions/line';
import { notFound } from 'next/navigation';
import { PracticeClient } from '@/components/practice/PracticeClient';

export default async function PracticePage({ 
  params 
}: { 
  params: Promise<{ id: string; lineId: string }> 
}) {
  const { id, lineId } = await params;
  
  const line = await getLine(lineId);

  if (!line) {
    notFound();
  }

  return (
    <PracticeClient
      classroomId={id}
      lineId={lineId}
      lineTitle={line.title}
      linePgn={line.pgn || ''}
    />
  );
}
