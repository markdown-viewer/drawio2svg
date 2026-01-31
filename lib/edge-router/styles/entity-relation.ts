import type { CellState, Point } from '../types.ts';
import { getRoutingCenterY } from '../utils/index.ts';

// ============================================================================
// EntityRelation - for ER diagrams
// ============================================================================

export function EntityRelation(
  source: CellState | null,
  target: CellState | null,
  points: Point[],
  result: Point[],
  p0: Point | null,
  pe: Point | null,
  segment: number = 30
): void {
  void points;
  let isSourceLeft = false;

  if (source != null) {
    if (source.geometryRelative && source.geometryRelativeX != null) {
      isSourceLeft = source.geometryRelativeX <= 0.5;
    } else if (target != null) {
      isSourceLeft = ((pe != null) ? pe.x : target.x + target.width) < ((p0 != null) ? p0.x : source.x);
    }
  }

  let actualSource = source;
  if (p0 != null) {
    actualSource = { x: p0.x, y: p0.y, width: 0, height: 0 };
  } else if (source == null) {
    return;
  }

  let isTargetLeft = true;

  if (target != null) {
    if (target.geometryRelative && target.geometryRelativeX != null) {
      isTargetLeft = target.geometryRelativeX <= 0.5;
    } else if (source != null) {
      isTargetLeft = ((p0 != null) ? p0.x : source.x + source.width) < ((pe != null) ? pe.x : target.x);
    }
  }

  let actualTarget = target;
  if (pe != null) {
    actualTarget = { x: pe.x, y: pe.y, width: 0, height: 0 };
  }

  if (actualSource != null && actualTarget != null) {
    const x0 = isSourceLeft ? actualSource.x : actualSource.x + actualSource.width;
    const y0 = getRoutingCenterY(actualSource);

    const xe = isTargetLeft ? actualTarget.x : actualTarget.x + actualTarget.width;
    const ye = getRoutingCenterY(actualTarget);

    const seg = segment;

    let dx = isSourceLeft ? -seg : seg;
    const dep = { x: x0 + dx, y: y0 };

    dx = isTargetLeft ? -seg : seg;
    const arr = { x: xe + dx, y: ye };

    // Adds intermediate points if both go out on same side
    if (isSourceLeft == isTargetLeft) {
      const x = isSourceLeft ?
        Math.min(x0, xe) - segment :
        Math.max(x0, xe) + segment;

      result.push({ x, y: y0 });
      result.push({ x, y: ye });
    } else if ((dep.x < arr.x) == isSourceLeft) {
      const midY = y0 + (ye - y0) / 2;
      result.push(dep);
      result.push({ x: dep.x, y: midY });
      result.push({ x: arr.x, y: midY });
      result.push(arr);
    } else {
      result.push(dep);
      result.push(arr);
    }
  }
}