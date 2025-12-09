'use client';

import { Circle, Save, GitBranch } from 'lucide-react';

interface RecorderControlsProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  onAddVariation: () => void;
  onSave: () => void;
}

export function RecorderControls({
  isRecording,
  onToggleRecording,
  onAddVariation,
  onSave,
}: RecorderControlsProps) {
  return (
    <div className="flex items-center gap-4 border border-gray-200 bg-white p-4 shadow-sm">
      <button
        onClick={onToggleRecording}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${isRecording
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        <Circle className={`h-4 w-4 ${isRecording ? 'fill-current' : ''}`} />
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <button
        onClick={onAddVariation}
        className="flex items-center gap-2 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
      >
        <GitBranch className="h-4 w-4" />
        Add Variation
      </button>

      <div className="ml-auto">
        <button
          onClick={onSave}
          className="flex items-center gap-2 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Save className="h-4 w-4" />
          Save Line
        </button>
      </div>
    </div>
  );
}
