import { Chess } from 'chess.js';
import { MoveNode } from '@/types/chess';

export function parsePgnToMoveTree(pgn: string): {
  nodes: Record<string, MoveNode>;
  rootNodeId: string;
} {
  const nodes: Record<string, MoveNode> = {};
  const rootNodeId = 'root';
  
  // Create root node
  nodes[rootNodeId] = {
    id: rootNodeId,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    san: '',
    uci: '',
    parentId: null,
    childrenIds: [],
  };

  if (!pgn || pgn.trim() === '') {
    return { nodes, rootNodeId };
  }

  const game = new Chess();
  let currentParentId = rootNodeId;
  let moveCounter = 0;

  // Clean the PGN - remove move numbers, result markers, and extra whitespace
  const cleanPgn = pgn
    .replace(/\d+\./g, '') // Remove move numbers like "1."
    .replace(/\*/g, '') // Remove result marker
    .trim()
    .split(/\s+/) // Split by whitespace
    .filter(move => move.length > 0);

  for (const san of cleanPgn) {
    try {
      const move = game.move(san);
      if (move) {
        moveCounter++;
        const nodeId = `m${moveCounter}`;
        
        const newNode: MoveNode = {
          id: nodeId,
          fen: game.fen(),
          san: move.san,
          uci: move.from + move.to + (move.promotion || ''),
          parentId: currentParentId,
          childrenIds: [],
        };

        nodes[nodeId] = newNode;
        nodes[currentParentId].childrenIds.push(nodeId);
        currentParentId = nodeId;
      }
    } catch (error) {
      console.error(`Failed to parse move: ${san}`, error);
      // Continue with next move
    }
  }

  return { nodes, rootNodeId };
}
