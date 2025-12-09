'use client';

import { HelpCircle, SkipForward, RefreshCw } from 'lucide-react';

interface PracticeControlsProps {
  feedback: 'correct' | 'incorrect' | 'neutral';
  onHint: () => void;
  onSkip: () => void;
  onRetry: () => void;
}

export function PracticeControls({
  feedback,
  onHint,
  onSkip,
  onRetry,
}: PracticeControlsProps) {
  return (
    <div className="flex flex-col gap-4 border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-center">
        {feedback === 'correct' && (
          <div className="text-lg font-bold text-green-600">Correct! Great move.</div>
        )}
        {feedback === 'incorrect' && (
          <div className="text-lg font-bold text-red-600">Incorrect. Try again.</div>
        )}
        {feedback === 'neutral' && (
          <div className="text-lg font-medium text-gray-600">Your turn to play.</div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onHint}
          className="flex items-center gap-2 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
        >
          <HelpCircle className="h-4 w-4" />
          Hint
        </button>
        <button
          onClick={onSkip}
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </button>
        {feedback === 'incorrect' && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
