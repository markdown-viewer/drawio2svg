import type { CellState, Point } from '../types.ts';
import { contains, getRoutingCenterX, getRoutingCenterY } from '../utils/index.ts';

// ============================================================================
// Loop - self-reference edges
// ============================================================================

export function Loop(
  source: CellState | null,
  target: CellState | null,
  points: Point[],
  result: Point[],
  p0: Point | null,
  pe: Point | null,
  segment: number = 10,
  direction: string = 'west'
): void {
  void target;
  if (p0 != null && pe != null) {
    if (points != null && points.length > 0) {
      for (let i = 0; i < points.length; i++) {
        result.push({ x: points[i].x, y: points[i].y });
      }
    }
    return;
  }

  if (source != null) {
    let pt: Point | null = (points != null && points.length > 0) ? points[0] : null;

    if (pt != null) {
      if (contains(source, pt.x, pt.y)) {
        pt = null;
      }
    }

    let x = 0;
    let dx = 0;
    let y = 0;
    let dy = 0;

    const seg = segment;
    const dir = direction;

    if (dir == 'north' || dir == 'south') {
      x = getRoutingCenterX(source);
      dx = seg;
    } else {
      y = getRoutingCenterY(source);
      dy = seg;
    }

    if (pt == null || pt.x < source.x || pt.x > source.x + source.width) {
      if (pt != null) {
        x = pt.x;
        dy = Math.max(Math.abs(y - pt.y), dy);
      } else {
        if (dir == 'north') {
          y = source.y - 2 * dx;
        } else if (dir == 'south') {
          y = source.y + source.height + 2 * dx;
        } else if (dir == 'east') {
          x = source.x - 2 * dy;
        } else {
          x = source.x + source.width + 2 * dy;
        }
      }
    } else if (pt != null) {
      x = getRoutingCenterX(source);
      dx = Math.max(Math.abs(x - pt.x), dy);
      y = pt.y;
      dy = 0;
    }

    result.push({ x: x - dx, y: y - dy });
    result.push({ x: x + dx, y: y + dy });
  }
}