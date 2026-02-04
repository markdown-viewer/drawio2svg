import type { CellState, Point } from '../types.ts';

// ============================================================================
// getEllipsePerimeterPoint - calculate perimeter intersection point for ellipse
// ============================================================================

/**
 * Calculate the intersection point on an ellipse perimeter.
 * The ellipse equation: (x-cx)²/a² + (y-cy)²/b² = 1
 */
export function getEllipsePerimeterPoint(
  bounds: CellState,
  next: Point,
  orthogonal: boolean = false
): Point {
  const { x, y, width, height } = bounds;
  const a = width / 2;   // semi-major axis (horizontal)
  const b = height / 2;  // semi-minor axis (vertical)
  const cx = x + a;      // center x
  const cy = y + b;      // center y

  const px = next.x;
  const py = next.y;

  // Platform uses parseInt to truncate to integer, treating small differences as zero
  // This ensures that when next is nearly aligned with center, we return center coordinate
  const dx = Math.trunc(px - cx);
  const dy = Math.trunc(py - cy);

  if (dx === 0 && dy !== 0) {
    return { x: cx, y: cy + b * dy / Math.abs(dy) };
  }

  if (dx === 0 && dy === 0) {
    return { x: px, y: py };
  }

  if (orthogonal) {
    if (py >= y && py <= y + height) {
      const ty = py - cy;
      let tx = Math.sqrt(a * a * (1 - (ty * ty) / (b * b))) || 0;
      if (px <= x) {
        tx = -tx;
      }
      return { x: cx + tx, y: py };
    }

    if (px >= x && px <= x + width) {
      const tx = px - cx;
      let ty = Math.sqrt(b * b * (1 - (tx * tx) / (a * a))) || 0;
      if (py <= y) {
        ty = -ty;
      }
      return { x: px, y: cy + ty };
    }
  }

  const d = dy / dx;
  const h = cy - d * cx;
  const e = a * a * d * d + b * b;
  const f = -2 * cx * e;
  const g = a * a * d * d * cx * cx + b * b * cx * cx - a * a * b * b;
  const det = Math.sqrt(f * f - 4 * e * g);

  const xout1 = (-f + det) / (2 * e);
  const xout2 = (-f - det) / (2 * e);
  const yout1 = d * xout1 + h;
  const yout2 = d * xout2 + h;

  const dist1 = Math.sqrt((xout1 - px) ** 2 + (yout1 - py) ** 2);
  const dist2 = Math.sqrt((xout2 - px) ** 2 + (yout2 - py) ** 2);

  const useFirst = dist1 < dist2;
  return { x: useFirst ? xout1 : xout2, y: useFirst ? yout1 : yout2 };
}