import type { CellState, Point } from '../types.ts';
import { contains, getRoutingCenterX, getRoutingCenterY } from '../utils/index.ts';

// ============================================================================
// ElbowConnector - chooses between SideToSide and TopToBottom
// ============================================================================

export function ElbowConnector(
  source: CellState | null,
  target: CellState | null,
  points: Point[],
  result: Point[],
  p0: Point | null,
  pe: Point | null,
  isVertical: boolean = false
): void {
  const pt = (points != null && points.length > 0) ? points[0] : null;

  let vertical = false;
  let horizontal = false;

  if (source != null && target != null) {
    if (pt != null) {
      const left = Math.min(source.x, target.x);
      const right = Math.max(source.x + source.width, target.x + target.width);
      const top = Math.min(source.y, target.y);
      const bottom = Math.max(source.y + source.height, target.y + target.height);

      vertical = pt.y < top || pt.y > bottom;
      horizontal = pt.x < left || pt.x > right;
    } else {
      const left = Math.max(source.x, target.x);
      const right = Math.min(source.x + source.width, target.x + target.width);

      vertical = left == right;

      if (!vertical) {
        const top = Math.max(source.y, target.y);
        const bottom = Math.min(source.y + source.height, target.y + target.height);

        horizontal = top == bottom;
      }
    }
  }

  if (!horizontal && (vertical || isVertical)) {
    TopToBottom(source, target, points, result, p0, pe);
  } else {
    SideToSide(source, target, points, result, p0, pe);
  }
}

// ============================================================================
// SideToSide - horizontal elbow edge
// ============================================================================

export function SideToSide(
  source: CellState | null,
  target: CellState | null,
  points: Point[],
  result: Point[],
  p0: Point | null,
  pe: Point | null
): void {
  const pt = (points != null && points.length > 0) ? points[0] : null;

  // If fixed terminal points exist, use them as source/target
  let actualSource = source;
  let actualTarget = target;

  if (p0 != null) {
    actualSource = { x: p0.x, y: p0.y, width: 0, height: 0 };
  }

  if (pe != null) {
    actualTarget = { x: pe.x, y: pe.y, width: 0, height: 0 };
  }

  if (actualSource != null && actualTarget != null) {
    const l = Math.max(actualSource.x, actualTarget.x);
    const r = Math.min(actualSource.x + actualSource.width, actualTarget.x + actualTarget.width);

    const x = (pt != null) ? pt.x : Math.round(r + (l - r) / 2);

    let y1 = getRoutingCenterY(actualSource);
    let y2 = getRoutingCenterY(actualTarget);

    if (pt != null) {
      // Use tolerance for floating point comparison (0.5px)
      const tol = 0.5;
      if (pt.y >= actualSource.y - tol && pt.y <= actualSource.y + actualSource.height + tol) {
        y1 = pt.y;
      }

      if (pt.y >= actualTarget.y - tol && pt.y <= actualTarget.y + actualTarget.height + tol) {
        y2 = pt.y;
      }
    }

    if (!contains(actualTarget, x, y1) && !contains(actualSource, x, y1)) {
      result.push({ x, y: y1 });
    }

    if (!contains(actualTarget, x, y2) && !contains(actualSource, x, y2)) {
      result.push({ x, y: y2 });
    }

    // Only add fallback if no routing points were added
    if (result.length === 0) {
      if (pt != null) {
        if (!contains(actualTarget, x, pt.y) && !contains(actualSource, x, pt.y)) {
          result.push({ x, y: pt.y });
        }
      } else {
        const t = Math.max(actualSource.y, actualTarget.y);
        const b = Math.min(actualSource.y + actualSource.height, actualTarget.y + actualTarget.height);

        result.push({ x, y: t + (b - t) / 2 });
      }
    }
  }
}

// ============================================================================
// TopToBottom - vertical elbow edge
// ============================================================================

export function TopToBottom(
  source: CellState | null,
  target: CellState | null,
  points: Point[],
  result: Point[],
  p0: Point | null,
  pe: Point | null
): void {
  const pt = (points != null && points.length > 0) ? points[0] : null;

  // If fixed terminal points exist, use them as source/target
  let actualSource = source;
  let actualTarget = target;

  if (p0 != null) {
    actualSource = { x: p0.x, y: p0.y, width: 0, height: 0 };
  }

  if (pe != null) {
    actualTarget = { x: pe.x, y: pe.y, width: 0, height: 0 };
  }

  if (actualSource != null && actualTarget != null) {
    const t = Math.max(actualSource.y, actualTarget.y);
    const b = Math.min(actualSource.y + actualSource.height, actualTarget.y + actualTarget.height);

    // Use tolerance for floating point comparison (0.5px)
    const tol = 0.5;

    let x = getRoutingCenterX(actualSource);

    if (pt != null && pt.x >= actualSource.x - tol && pt.x <= actualSource.x + actualSource.width + tol) {
      x = pt.x;
    }

    const y = (pt != null) ? pt.y : Math.round(b + (t - b) / 2);

    if (!contains(actualTarget, x, y) && !contains(actualSource, x, y)) {
      result.push({ x, y });
    }

    if (pt != null && pt.x >= actualTarget.x - tol && pt.x <= actualTarget.x + actualTarget.width + tol) {
      x = pt.x;
    } else {
      x = getRoutingCenterX(actualTarget);
    }

    if (!contains(actualTarget, x, y) && !contains(actualSource, x, y)) {
      result.push({ x, y });
    }

    // Only add fallback if no routing points were added
    if (result.length === 0) {
      if (pt != null) {
        if (!contains(actualTarget, pt.x, y) && !contains(actualSource, pt.x, y)) {
          result.push({ x: pt.x, y });
        }
      } else {
        const l = Math.max(actualSource.x, actualTarget.x);
        const r = Math.min(actualSource.x + actualSource.width, actualTarget.x + actualTarget.width);

        result.push({ x: l + (r - l) / 2, y });
      }
    }
  }
}