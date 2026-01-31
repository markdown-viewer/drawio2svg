import type { CellState, Point } from '../types.ts';

export function getBackbonePerimeterPoint(bounds: CellState, next: Point): Point {
  const strokeWidth = bounds.strokeWidth ?? 1;
  let sw = strokeWidth / 2 - 1;
  if (bounds.backboneSize != null) {
    sw += bounds.backboneSize / 2 - 1;
  }

  const x = bounds.x;
  const y = bounds.y;
  const w = bounds.width;
  const h = bounds.height;
  const cx = x + w / 2;
  const cy = y + h / 2;

  const direction = bounds.direction;
  if (direction === 'north' || direction === 'south') {
    if (next.x < cx) {
      sw += 1;
      sw *= -1;
    }
    return {
      x: cx + sw,
      y: Math.min(y + h, Math.max(y, next.y))
    };
  }

  if (next.y < cy) {
    sw += 1;
    sw *= -1;
  }
  return {
    x: Math.min(x + w, Math.max(x, next.x)),
    y: cy + sw
  };
}