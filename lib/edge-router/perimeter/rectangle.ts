import type { CellState, Point } from '../types.ts';

// ============================================================================
// getRectanglePerimeterPoint - calculate perimeter intersection point
// ============================================================================

export function getRectanglePerimeterPoint(
  bounds: CellState,
  next: Point,
  orthogonal: boolean = false
): Point {
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;
  const dx = next.x - cx;
  const dy = next.y - cy;
  const alpha = Math.atan2(dy, dx);
  const p = { x: 0, y: 0 };
  const pi = Math.PI;
  const pi2 = Math.PI / 2;
  const beta = pi2 - alpha;
  const t = Math.atan2(bounds.height, bounds.width);

  if (alpha < -pi + t || alpha > pi - t) {
    // Left edge
    p.x = bounds.x;
    p.y = cy - bounds.width * Math.tan(alpha) / 2;
  } else if (alpha < -t) {
    // Top edge
    p.y = bounds.y;
    p.x = cx - bounds.height * Math.tan(beta) / 2;
  } else if (alpha < t) {
    // Right edge
    p.x = bounds.x + bounds.width;
    p.y = cy + bounds.width * Math.tan(alpha) / 2;
  } else {
    // Bottom edge
    p.y = bounds.y + bounds.height;
    p.x = cx + bounds.height * Math.tan(beta) / 2;
  }

  if (orthogonal) {
    if (next.x >= bounds.x && next.x <= bounds.x + bounds.width) {
      p.x = next.x;
    } else if (next.y >= bounds.y && next.y <= bounds.y + bounds.height) {
      p.y = next.y;
    }

    if (next.x < bounds.x) {
      p.x = bounds.x;
    } else if (next.x > bounds.x + bounds.width) {
      p.x = bounds.x + bounds.width;
    }

    if (next.y < bounds.y) {
      p.y = bounds.y;
    } else if (next.y > bounds.y + bounds.height) {
      p.y = bounds.y + bounds.height;
    }
  }

  return p;
}