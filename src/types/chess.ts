export type Role = 'owner' | 'student' | 'viewer';

export interface Classroom {
  id: string;
  title: string;
  description: string;
  tags: string[];
  lines: Line[];
  memberCount: number;
  lineCount: number;
  isPrivate: boolean;
  visibility: string;
  createdAt: Date | string;
  updatedAt: string;
  user?: {
    name: string | null;
    image: string | null;
  };
}

export interface Line {
  id: string;
  title: string;
  rootNodeId: string;
  nodes: Record<string, MoveNode>; // Normalized tree storage
  moveCount: number;
  updatedAt: string;
}

export interface MoveNode {
  id: string;
  fen: string;
  san: string; // "e4"
  uci: string; // "e2e4"
  parentId: string | null;
  childrenIds: string[];
  comment?: string;
  variationName?: string; // e.g., "Main Line", "Trap"
  nags?: number[]; // Numeric Annotation Glyphs
}
