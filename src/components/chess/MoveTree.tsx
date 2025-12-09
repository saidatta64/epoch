'use client';

import React from 'react';
import { MoveNode } from '../../types/chess';
import { clsx } from 'clsx';

interface MoveTreeProps {
  nodes: Record<string, MoveNode>;
  currentMoveId: string | null;
  rootNodeId: string;
  onNodeClick: (nodeId: string) => void;
}

interface MoveElement {
  type: 'move' | 'variation-start' | 'variation-end';
  nodeId?: string;
  moveNumber?: number;
  isWhite?: boolean;
}

export function MoveTree({ nodes, currentMoveId, rootNodeId, onNodeClick }: MoveTreeProps) {
  // Build the main line from root to current position
  const buildMainLine = (): string[] => {
    const path: string[] = [];
    let nodeId = currentMoveId;

    while (nodeId && nodeId !== rootNodeId) {
      const node = nodes[nodeId];
      if (!node) break;
      path.unshift(nodeId);
      nodeId = node.parentId;
    }

    return path;
  };

  // Render moves in linear notation with variations
  const renderMoveList = () => {
    const rootNode = nodes[rootNodeId];
    if (!rootNode || rootNode.childrenIds.length === 0) {
      return <p className="text-sm text-gray-500 italic">No moves recorded yet.</p>;
    }

    const mainLine = buildMainLine();
    const elements: React.JSX.Element[] = [];
    let moveNumber = 1;
    let isWhiteTurn = true;

    const renderLine = (nodeIds: string[], isVariation = false, depth = 0) => {
      nodeIds.forEach((nodeId, index) => {
        const node = nodes[nodeId];
        if (!node) return;

        const isCurrent = nodeId === currentMoveId;
        const isInMainLine = mainLine.includes(nodeId);

        // Add move number for white's moves or at start of variation
        if (isWhiteTurn || (isVariation && index === 0)) {
          elements.push(
            <span key={`num-${nodeId}`} className="text-gray-500 text-sm font-normal mr-1">
              {moveNumber}.{!isWhiteTurn ? '..' : ''}
            </span>
          );
        }

        // Render the move
        elements.push(
          <button
            key={nodeId}
            onClick={() => onNodeClick(nodeId)}
            className={clsx(
              'text-sm font-medium mr-1.5 px-1.5 py-0.5 rounded transition-colors',
              isCurrent
                ? 'bg-blue-500 text-white'
                : isVariation
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-gray-900 hover:bg-gray-100'
            )}
          >
            {node.san}
          </button>
        );

        // Add comment indicator if present
        if (node.comment) {
          elements.push(
            <span key={`comment-${nodeId}`} className="text-xs text-gray-400 mr-1">
              💬
            </span>
          );
        }

        // Handle variations (siblings)
        if (isInMainLine && !isVariation) {
          const parent = nodes[node.parentId || ''];
          if (parent && parent.childrenIds.length > 1) {
            const siblings = parent.childrenIds.filter(id => id !== nodeId);

            siblings.forEach(siblingId => {
              const variationPath = buildVariationPath(siblingId);

              elements.push(
                <span key={`var-start-${siblingId}`} className="text-gray-500 mx-0.5">(</span>
              );

              renderLine(variationPath, true, depth + 1);

              elements.push(
                <span key={`var-end-${siblingId}`} className="text-gray-500 mx-0.5">)</span>
              );
            });
          }
        }

        // Update move counter
        if (!isWhiteTurn) {
          moveNumber++;
        }
        isWhiteTurn = !isWhiteTurn;
      });
    };

    const buildVariationPath = (startNodeId: string): string[] => {
      const path: string[] = [startNodeId];
      let current = nodes[startNodeId];

      // Follow the first child until we run out or hit a branching point
      while (current && current.childrenIds.length > 0) {
        const nextId = current.childrenIds[0];
        path.push(nextId);
        current = nodes[nextId];

        // Stop if we hit a node with multiple children (another variation point)
        if (current && current.childrenIds.length > 1) break;
      }

      return path;
    };

    renderLine(mainLine);

    return (
      <div className="flex flex-wrap items-center gap-y-2">
        {elements}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Moves</h3>
      <div className="leading-relaxed">
        {renderMoveList()}
      </div>
    </div>
  );
}
