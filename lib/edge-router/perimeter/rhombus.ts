import type { CellState, Point } from '../types.ts';
import { lineIntersection } from '../utils.ts';

// ============================================================================
// getRhombusPerimeterPoint - calculate perimeter intersection point for rhombus (diamond)
// ============================================================================

/**
 * Calculate the intersection point on a rhombus (diamond) perimeter.
 * The rhombus has vertices at the midpoints of the bounding rectangle edges.
 */
export function getRhombusPerimeterPoint(
  bounds: CellState,
  next: Point,
  orthogonal: boolean = false
): Point {
  const { x, y, width, height } = bounds;
  const cx = x + width / 2;  // center x
  const cy = y + height / 2; // center y
  const px = next.x;         // target point x
  const py = next.y;         // target point y

  // If target is exactly at center vertically
  if (cx === px) {
    return cy > py
      ? { x: cx, y: y }           // top vertex
      : { x: cx, y: y + height }; // bottom vertex
  }

  // If target is exactly at center horizontally
  if (cy === py) {
    return cx > px
      ? { x: x, y: cy }           // left vertex
      : { x: x + width, y: cy };  // right vertex
  }

  // Calculate adjusted start point for orthogonal mode
  let mx = cx;
  let my = cy;

  if (orthogonal) {
    if (px >= x && px <= x + width) {
      mx = px;
    } else if (py >= y && py <= y + height) {
      my = py;
    }
  }

  // Determine which edge to intersect based on quadrant
  // The rhombus has 4 edges:
  // - top-right: from top(cx, y) to right(x+width, cy)
  // - bottom-right: from right(x+width, cy) to bottom(cx, y+height)
  // - bottom-left: from bottom(cx, y+height) to left(x, cy)
  // - top-left: from left(x, cy) to top(cx, y)

  let result: Point | null;
  if (px < cx) {
    // Target is to the left of center
    if (py < cy) {
      // Top-left quadrant: intersect with top-left edge
      result = lineIntersection(px, py, mx, my, cx, y, x, cy);
    } else {
      // Bottom-left quadrant: intersect with bottom-left edge
      result = lineIntersection(px, py, mx, my, cx, y + height, x, cy);
    }
  } else {
    // Target is to the right of center
    if (py < cy) {
      // Top-right quadrant: intersect with top-right edge
      result = lineIntersection(px, py, mx, my, cx, y, x + width, cy);
    } else {
      // Bottom-right quadrant: intersect with bottom-right edge
      result = lineIntersection(px, py, mx, my, cx, y + height, x + width, cy);
    }
  }

  return result || { x: cx, y: cy };
}