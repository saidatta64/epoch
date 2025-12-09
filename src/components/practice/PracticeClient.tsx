'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '@/components/chess/ChessBoard';
import { PracticeControls } from '@/components/chess/PracticeControls';
import { ColorSelector } from '@/components/chess/ColorSelector';
import { MoveNode } from '@/types/chess';
import { ArrowLeft, Trophy, X, CheckCircle2, XCircle, HelpCircle, RotateCcw, ArrowLeftRight } from 'lucide-react';
import Link from 'next/link';
import { parsePgnToMoveTree } from '@/lib/pgnParser';
import { toast } from 'sonner';

interface PracticeClientProps {
  classroomId: string;
  lineId: string;
  lineTitle: string;
  linePgn: string;
}

export function PracticeClient({ classroomId, lineId, lineTitle, linePgn }: PracticeClientProps) {
  const [userColor, setUserColor] = useState<'white' | 'black'>('white');
  const [game, setGame] = useState<Chess | null>(null);
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [currentMoveId, setCurrentMoveId] = useState('root');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'neutral'>('neutral');
  const [lineNodes, setLineNodes] = useState<Record<string, MoveNode>>({});
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  // Parse PGN on mount
  useEffect(() => {
    const { nodes } = parsePgnToMoveTree(linePgn);
    setLineNodes(nodes);
  }, [linePgn]);

  // Initialize game when user starts practice
  const handleStart = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setCurrentMoveId('root');
    setFeedback('neutral');
    setIsStarted(true);
    setIsCompleted(false);
    setMoveHistory([]);
  };

  // Reset practice
  const handleReset = () => {
    setIsStarted(false);
    setGame(null);
    setFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    setCurrentMoveId('root');
    setFeedback('neutral');
    setIsCompleted(false);
    setMoveHistory([]);
  };

  // Check if line is completed
  const checkCompletion = useCallback((moveId: string) => {
    const currentNode = lineNodes[moveId];
    if (currentNode && currentNode.childrenIds.length === 0 && moveId !== 'root') {
      // No more moves - line is complete!
      setIsCompleted(true);
      toast.success('🎉 Congratulations! You completed the line!', {
        duration: 5000,
      });
    }
  }, [lineNodes]);

  // Effect to play opponent's move if it's their turn
  useEffect(() => {
    if (!game || !isStarted || isCompleted) return;

    const isUserTurn = game.turn() === (userColor === 'white' ? 'w' : 'b');

    if (!isUserTurn) {
      // Opponent's turn (Computer/Recorded Line)
      const currentNode = lineNodes[currentMoveId];
      if (currentNode && currentNode.childrenIds.length > 0) {
        // Pick the main line move (first child)
        const nextNodeId = currentNode.childrenIds[0];
        const nextNode = lineNodes[nextNodeId];

        setTimeout(() => {
          try {
            game.move(nextNode.san);
            setFen(game.fen());
            setCurrentMoveId(nextNodeId);
            setFeedback('neutral');

            // Add to move history
            setMoveHistory(prev => [...prev, nextNode.san]);

            // Check if completed
            checkCompletion(nextNodeId);
          } catch (error) {
            console.error('Failed to play opponent move:', error);
          }
        }, 500); // Delay for realism
      }
    }
  }, [game, currentMoveId, userColor, isStarted, lineNodes, isCompleted, checkCompletion]);

  const onMove = useCallback((source: string, target: string) => {
    if (!game || isCompleted) return false;

    const isUserTurn = game.turn() === (userColor === 'white' ? 'w' : 'b');
    if (!isUserTurn) return false;

    try {
      // Check if move matches recorded line
      const currentNode = lineNodes[currentMoveId];
      const correctNextNodeId = currentNode?.childrenIds[0];
      const correctNextNode = lineNodes[correctNextNodeId];

      if (!correctNextNode) {
        console.log('No more moves recorded');
        return false;
      }

      // Attempt move in a temp game to get SAN
      const tempGame = new Chess(game.fen());
      const move = tempGame.move({ from: source, to: target, promotion: 'q' });

      if (!move) return false;

      if (move.san === correctNextNode.san) {
        // Correct move
        game.move({ from: source, to: target, promotion: 'q' });
        setFen(game.fen());
        setCurrentMoveId(correctNextNodeId);
        setFeedback('correct');

        // Add to move history
        setMoveHistory(prev => [...prev, move.san]);

        // Check if completed
        checkCompletion(correctNextNodeId);

        return true;
      } else {
        // Incorrect move
        setFeedback('incorrect');
        toast.error(`Incorrect! The correct move is ${correctNextNode.san}`, {
          duration: 3000,
        });
        return false; // Don't allow the move on board
      }
    } catch (e) {
      return false;
    }
  }, [game, currentMoveId, userColor, lineNodes, isCompleted, checkCompletion]);

  const handleHint = () => {
    const currentNode = lineNodes[currentMoveId];
    const nextNodeId = currentNode?.childrenIds[0];
    const nextNode = lineNodes[nextNodeId];
    if (nextNode) {
      toast.info(`💡 Hint: Try playing ${nextNode.san}`, {
        duration: 4000,
      });
    } else {
      toast.info('No more moves in this line!');
    }
  };

  const handleSkip = () => {
    if (!game || isCompleted) return;

    // Force play the correct move
    const currentNode = lineNodes[currentMoveId];
    const nextNodeId = currentNode?.childrenIds[0];
    const nextNode = lineNodes[nextNodeId];
    if (nextNode) {
      game.move(nextNode.san);
      setFen(game.fen());
      setCurrentMoveId(nextNodeId);
      setFeedback('neutral');

      // Add to move history
      setMoveHistory(prev => [...prev, nextNode.san]);

      // Check if completed
      checkCompletion(nextNodeId);

      toast.info(`Skipped: ${nextNode.san}`);
    }
  };

  const handleRetry = () => {
    setFeedback('neutral');
  };

  // Format move history for display
  const formatMoveHistory = () => {
    const formatted: string[] = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = moveHistory[i];
      const blackMove = moveHistory[i + 1];
      if (blackMove) {
        formatted.push(`${moveNumber}. ${whiteMove} ${blackMove}`);
      } else {
        formatted.push(`${moveNumber}. ${whiteMove}`);
      }
    }
    return formatted;
  };

  const isCorrect = feedback === 'correct' ? true : feedback === 'incorrect' ? false : null;
  const totalMoves = Math.max(Object.keys(lineNodes).length - 1, 1);
  const progress = Math.min((moveHistory.length / totalMoves) * 100, 100);

  const onDrop = (source: string, target: string) => {
    return onMove(source, target);
  };

  const customDarkSquareStyle = { backgroundColor: '#779954' };
  const customLightSquareStyle = { backgroundColor: '#e9edcc' };

  if (!isStarted) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col gap-6 text-gray-900">
        <div className="flex items-center gap-4">
          <Link
            href={`/classroom/${classroomId}`}
            className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Practice Mode</h1>
            <p className="text-sm text-gray-500">{lineTitle}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">Choose Your Color</h2>
              <p className="mt-2 text-sm text-gray-500">
                Select which side you want to play and practice the line
              </p>
            </div>

            <ColorSelector selectedColor={userColor} onColorChange={setUserColor} />

            <button
              onClick={handleStart}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Start Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-6 text-gray-900">
      {/* Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
            <button
              onClick={() => setIsCompleted(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Congratulations!</h2>
              <p className="mb-6 text-gray-600">
                You've successfully completed the line! 🎉
              </p>
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">Total Moves</p>
                <p className="text-3xl font-bold text-gray-900">{moveHistory.length}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleStart}
                  className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Practice Again
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Change Color
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/classroom/${classroomId}`}
            className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Practice Mode</h1>
            <p className="text-sm text-gray-500">
              {lineTitle} · Playing as {userColor === 'white' ? 'White' : 'Black'}
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Change Color
        </button>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex h-full flex-col gap-4">
            <div className="flex-1 border border-gray-400 bg-white p-4 shadow-sm flex items-center justify-center">
              <ChessBoard
                fen={fen}
                onMove={onMove}
                orientation={userColor}
              />
            </div>
          </div>
        </div>

        <div className="h-full space-y-4">
          <PracticeControls
            feedback={feedback}
            onHint={handleHint}
            onSkip={handleSkip}
            onRetry={handleRetry}
          />

          <div className="border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">Move History</h3>
            {moveHistory.length === 0 ? (
              <p className="text-sm italic text-gray-400">No moves yet</p>
            ) : (
              <div className="max-h-64 space-y-1 overflow-y-auto">
                {formatMoveHistory().map((move, index) => (
                  <div
                    key={index}
                    className="rounded bg-gray-50 px-3 py-1.5 text-sm font-mono text-gray-700"
                  >
                    {move}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Controls */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={handleHint}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <HelpCircle className="h-4 w-4" />
              Hint
            </button>
            <button
              onClick={() => setUserColor(userColor === 'white' ? 'black' : 'white')}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <ArrowLeftRight className="h-4 w-4" />
              Flip
            </button>
          </div>

          {/* Status & Feedback */}
          <div className="space-y-4">
            <div
              className={`flex items-center gap-3 rounded-lg p-4 ${isCorrect === true
                ? 'bg-green-50 text-green-700'
                : isCorrect === false
                  ? 'bg-red-50 text-red-700'
                  : 'bg-blue-50 text-blue-700'
                }`}
            >
              {isCorrect === true ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              ) : isCorrect === false ? (
                <XCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <HelpCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{feedback}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-gray-500">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
