'use client';

import { useState, useEffect, useCallback, useTransition, use } from 'react';
import { updateLine } from '@/app/actions/line';
import { Chess } from 'chess.js';
import dynamic from 'next/dynamic';
import { MoveTree } from '@/components/chess/MoveTree';
import { RecorderControls } from '@/components/chess/RecorderControls';
import { MoveNode } from '@/types/chess';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const ChessBoard = dynamic(() => import('@/components/chess/ChessBoard').then(mod => mod.ChessBoard), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse" />,
});

// Mock initial data
const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function LinePage({ params }: { params: Promise<{ id: string; lineId: string }> }) {
  const { id, lineId } = use(params);
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(INITIAL_FEN);
  const [isRecording, setIsRecording] = useState(false);

  // Tree state
  const [nodes, setNodes] = useState<Record<string, MoveNode>>({
    root: {
      id: 'root',
      fen: INITIAL_FEN,
      san: '',
      uci: '',
      parentId: null,
      childrenIds: [],
    }
  });
  const [currentMoveId, setCurrentMoveId] = useState<string>('root');

  // Handle move
  const onMove = useCallback((source: string, target: string) => {
    console.log('onMove called', { source, target, isRecording });
    if (!isRecording) {
      console.log('Not recording, ignoring move');
      return false;
    }

    try {
      // Check if move is valid in current game state
      const move = game.move({
        from: source,
        to: target,
        promotion: 'q', // always promote to queen for simplicity
      });

      if (move) {
        console.log('Move valid', move.san);
        setFen(game.fen());

        // Check if this move already exists as a child of current node
        const currentNode = nodes[currentMoveId];
        const existingChildId = currentNode.childrenIds.find(childId => {
          const childNode = nodes[childId];
          return childNode.san === move.san;
        });

        if (existingChildId) {
          // Move exists, just navigate to it
          setCurrentMoveId(existingChildId);
          return true;
        }

        // Add to tree
        const newNodeId = crypto.randomUUID();
        const newNode: MoveNode = {
          id: newNodeId,
          fen: game.fen(),
          san: move.san,
          uci: move.from + move.to,
          parentId: currentMoveId,
          childrenIds: [],
        };

        setNodes(prev => {
          const parent = prev[currentMoveId];
          return {
            ...prev,
            [currentMoveId]: {
              ...parent,
              childrenIds: [...parent.childrenIds, newNodeId]
            },
            [newNodeId]: newNode
          };
        });

        setCurrentMoveId(newNodeId);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }, [game, isRecording, currentMoveId, nodes]);

  const handleNodeClick = (nodeId: string) => {
    const node = nodes[nodeId];
    if (node) {
      const newGame = new Chess(node.fen);
      setGame(newGame);
      setFen(node.fen);
      setCurrentMoveId(nodeId);
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleAddVariation = () => {
    // Logic to start a new branch from the current position
    // For now, just ensure we are recording
    setIsRecording(true);
    toast.info('Recording variation. Make a different move to branch.');
  };

  const [isSaving, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        // Get PGN and extract just the moves (without headers)
        const fullPgn = game.pgn();
        // Split by newlines and filter out header lines (those starting with [)
        const pgnLines = fullPgn.split('\n');
        const moveLines = pgnLines.filter(line => !line.startsWith('[') && line.trim() !== '');
        const cleanPgn = moveLines.join(' ').trim();

        // We don't overwrite title here unless we add a title input field in this page too.
        // For now, we just update PGN and FEN.
        const result = await updateLine(lineId, { pgn: cleanPgn, fen: game.fen() });

        if (result.success) {
          toast.success('Line saved successfully!');
        } else {
          toast.error('Failed to save line.');
        }
      } catch (error) {
        console.error('Failed to save line:', error);
        toast.error('Failed to save line. Please try again.');
      }
    });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-6 text-gray-900">
      <div className="flex items-center gap-4">
        <Link
          href={`/classroom/${id}`}
          className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recording Line</h1>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex h-full flex-col gap-4">
            <div className="flex-1 border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-center">
              <ChessBoard fen={fen} onMove={onMove} />
            </div>
            <RecorderControls
              isRecording={isRecording}
              onToggleRecording={handleToggleRecording}
              onAddVariation={handleAddVariation}
              onSave={handleSave}
            />
          </div>
        </div>

        <div className="h-full">
          <MoveTree
            nodes={nodes}
            currentMoveId={currentMoveId}
            rootNodeId="root"
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>
    </div>
  );
}
