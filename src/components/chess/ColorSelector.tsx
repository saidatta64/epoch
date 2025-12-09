'use client';

interface ColorSelectorProps {
  selectedColor: 'white' | 'black';
  onColorChange: (color: 'white' | 'black') => void;
}

export function ColorSelector({ selectedColor, onColorChange }: ColorSelectorProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1">
      <button
        onClick={() => onColorChange('white')}
        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${selectedColor === 'white'
            ? 'bg-gray-900 text-white'
            : 'text-gray-700 hover:bg-gray-100'
          }`}
      >
        <div className="h-4 w-4 rounded-full border-2 border-gray-400 bg-white"></div>
        Play as White
      </button>
      <button
        onClick={() => onColorChange('black')}
        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${selectedColor === 'black'
            ? 'bg-gray-900 text-white'
            : 'text-gray-700 hover:bg-gray-100'
          }`}
      >
        <div className="h-4 w-4 rounded-full border-2 border-gray-400 bg-gray-900"></div>
        Play as Black
      </button>
    </div>
  );
}
