'use client';

import { Chessboard } from 'react-chessboard';

import { useSettings } from '@/context/SettingsContext';

interface ChessBoardProps {
  fen: string;
  onMove?: (from: string, to: string) => boolean;
  orientation?: 'white' | 'black';
  isDraggable?: boolean;
}

const BOARD_THEMES = {
  brown: { dark: '#B58863', light: '#F0D9B5' },
  green: { dark: '#769656', light: '#EEEED2' },
  blue: { dark: '#8CA2AD', light: '#DEE3E6' },
};

export function ChessBoard({
  fen,
  onMove,
  orientation = 'white',
  isDraggable = true,
}: ChessBoardProps) {
  const { settings } = useSettings();
  const theme = BOARD_THEMES[settings.boardTheme as keyof typeof BOARD_THEMES] || BOARD_THEMES.brown;

  function onDrop(sourceSquare: string, targetSquare: string) {
    console.log('ChessBoard onDrop', sourceSquare, targetSquare);
    if (onMove) {
      return onMove(sourceSquare, targetSquare);
    }
    return false;
  }

  return (
    <div className="h-full w-full max-w-[600px] overflow-hidden shadow-sm">
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation={orientation}
        arePiecesDraggable={isDraggable}
        customDarkSquareStyle={{ backgroundColor: theme.dark }}
        customLightSquareStyle={{ backgroundColor: theme.light }}
        showBoardNotation={settings.showNotation}
        animationDuration={200}
      />
    </div>
  );
}
