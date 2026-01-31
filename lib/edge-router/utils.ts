import type { CellState, Point } from './types.ts';

export function contains(state: CellState, x: number, y: number): boolean {
  return x >= state.x && x <= state.x + state.width &&
         y >= state.y && y <= state.y + state.height;
}

export function getRoutingCenterX(state: CellState): number {
  return state.x + state.width / 2;
}

export function getRoutingCenterY(state: CellState): number {
  return state.y + state.height / 2;
}

/**
 * Calculate the intersection point of two lines.
 * Line 1: (x1, y1) to (x2, y2)
 * Line 2: (x3, y3) to (x4, y4)
 */
export function lineIntersection(
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number
): Point | null {
  const d = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  if (d === 0) {
    return null; // parallel lines
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / d;

  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1)
  };
}