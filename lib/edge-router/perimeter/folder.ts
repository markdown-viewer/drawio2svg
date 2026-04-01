import type { CellState, Point } from '../types.ts';

// ============================================================================
// getFolderPerimeterPoint - calculate perimeter intersection for folder shape
// ============================================================================

/**
 * Calculate the intersection point on a folder shape perimeter.
 * The folder has an L-shaped top: a tab region and a body region.
 *
 *   tabLeft ─────── tabRight
 *   │  tab area   │
 *   │             ├─────────── bodyRight
 *   │  bodyTop    │  body                │
 *   │                                    │
 *   bodyLeft ──────────────── bodyRight
 */
export function getFolderPerimeterPoint(
  bounds: CellState,
  next: Point,
  orthogonal: boolean = false
): Point {
  const { x, y, width, height } = bounds;
  const tw = Math.min(bounds.tabWidth ?? 60, width);
  const th = Math.min(bounds.tabHeight ?? 20, height);
  const tp = bounds.tabPosition ?? 'right';

  const bodyTop = y + th;

  // Tab x-range
  const tabLeft = tp === 'left' ? x : x + width - tw;
  const tabRight = tp === 'left' ? x + tw : x + width;

  const cx = x + width / 2;
  const cy = y + height / 2;
  const px = next.x;
  const py = next.y;

  if (orthogonal) {
    // From above
    if (py <= cy) {
      if (px >= x && px <= x + width) {
        if (px >= tabLeft && px <= tabRight) {
          return { x: px, y };         // Hit tab top
        }
        return { x: px, y: bodyTop };  // Hit body top
      }
    }
    // From below
    if (py > cy && px >= x && px <= x + width) {
      return { x: px, y: y + height };
    }
    // From left
    if (px < cx && py >= y && py <= y + height) {
      return { x, y: py };
    }
    // From right
    if (px >= cx && py >= y && py <= y + height) {
      return { x: x + width, y: py };
    }
  }

  // Non-orthogonal: ray from center through next, intersect with L-shaped polygon
  // Build polygon vertices (clockwise)
  let vertices: Point[];
  if (tp === 'left') {
    vertices = [
      { x, y },                        // Tab top-left
      { x: tabRight, y },              // Tab top-right
      { x: tabRight, y: bodyTop },     // Inner corner
      { x: x + width, y: bodyTop },    // Body top-right
      { x: x + width, y: y + height }, // Body bottom-right
      { x, y: y + height },            // Body bottom-left
    ];
  } else {
    vertices = [
      { x, y: bodyTop },               // Body top-left
      { x: tabLeft, y: bodyTop },      // Inner corner (left of tab)
      { x: tabLeft, y },               // Tab top-left
      { x: x + width, y },            // Tab top-right
      { x: x + width, y: y + height }, // Body bottom-right
      { x, y: y + height },            // Body bottom-left
    ];
  }

  // Find closest intersection of ray from center through next with polygon edges
  const n = vertices.length;
  let bestDist = Infinity;
  let bestPoint: Point = { x: px, y: py };

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const v1 = vertices[i];
    const v2 = vertices[j];

    // Use ray-segment intersection
    const pt = raySegmentIntersection(cx, cy, px, py, v1.x, v1.y, v2.x, v2.y);
    if (pt) {
      const dx = pt.x - cx;
      const dy = pt.y - cy;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        bestPoint = pt;
      }
    }
  }

  return bestPoint;
}

/**
 * Find intersection of a ray from (rx, ry) through (tx, ty) with segment (sx1, sy1)-(sx2, sy2).
 * Returns null if no valid intersection.
 */
function raySegmentIntersection(
  rx: number, ry: number,
  tx: number, ty: number,
  sx1: number, sy1: number,
  sx2: number, sy2: number
): Point | null {
  const rdx = tx - rx;
  const rdy = ty - ry;
  const sdx = sx2 - sx1;
  const sdy = sy2 - sy1;

  const denom = rdx * sdy - rdy * sdx;
  if (Math.abs(denom) < 1e-10) return null; // Parallel

  const t = ((sx1 - rx) * sdy - (sy1 - ry) * sdx) / denom;
  const u = ((sx1 - rx) * rdy - (sy1 - ry) * rdx) / denom;

  // t > 0: intersection is outward from center
  // 0 <= u <= 1: intersection is on the segment
  if (t > 1e-10 && u >= -1e-10 && u <= 1 + 1e-10) {
    return {
      x: rx + t * rdx,
      y: ry + t * rdy
    };
  }

  return null;
}
