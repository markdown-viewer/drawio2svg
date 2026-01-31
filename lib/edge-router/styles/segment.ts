import type { CellState, Point } from '../types.ts';
import { contains, getRoutingCenterX, getRoutingCenterY } from '../utils/index.ts';

// ============================================================================
// SegmentConnector - orthogonal edge style with control points
// ============================================================================

export function SegmentConnector(
  source: CellState | null,
  target: CellState | null,
  controlHints: Point[],
  result: Point[],
  p0: Point | null,
  pe: Point | null
): void {
  // Note: In the platform, this function operates on scaled coordinates.
  // We operate on unscaled coordinates since scale=1 in our renderer.
  const tol = 1;

  // Adds translated unscaled points for precise collision checks
  const tempPoints: Point[] = [];

  function addPoint(pt: Point): void {
    tempPoints.push(pt);
  }

  // Whether the first segment outgoing from the source end is horizontal
  let lastPushed: Point | null = (result.length > 0) ? result[0] : null;
  let horizontal = true;
  let hint: Point | null = null;

  // Adds waypoints only if outside of tolerance
  function pushPoint(pt: Point): void {
    pt.x = Math.round(pt.x * 10) / 10;
    pt.y = Math.round(pt.y * 10) / 10;

    if (lastPushed == null || Math.abs(lastPushed.x - pt.x) >= tol || Math.abs(lastPushed.y - pt.y) >= 1) {
      result.push(pt);
      lastPushed = pt;
    }
  }

  // pts[0] = p0, pts[lastInx] = pe
  // Adds the first point
  let pt: Point | null = p0;

  if (pt == null && source != null) {
    pt = { x: getRoutingCenterX(source), y: getRoutingCenterY(source) };
  } else if (pt != null) {
    pt = { x: pt.x, y: pt.y }; // clone
  }

  // Adds the waypoints
  if (controlHints != null && controlHints.length > 0) {
    // In the platform, hints are transformed. We assume they're already transformed.
    const hints: Point[] = [];

    for (let i = 0; i < controlHints.length; i++) {
      const tmp = controlHints[i];
      if (tmp != null) {
        hints.push({ x: tmp.x, y: tmp.y });
      }
    }

    if (hints.length == 0) {
      return;
    }

    // Aligns source and target hint to fixed points
    if (pt != null && hints[0] != null) {
      if (Math.abs(hints[0].x - pt.x) < tol) {
        hints[0].x = pt.x;
      }

      if (Math.abs(hints[0].y - pt.y) < tol) {
        hints[0].y = pt.y;
      }
    }

    if (pe != null && hints[hints.length - 1] != null) {
      if (Math.abs(hints[hints.length - 1].x - pe.x) < tol) {
        hints[hints.length - 1].x = pe.x;
      }

      if (Math.abs(hints[hints.length - 1].y - pe.y) < tol) {
        hints[hints.length - 1].y = pe.y;
      }
    }

    hint = hints[0];

    let currentTerm: CellState | null = source;
    let currentPt: Point | null = p0;
    let hozChan = false;
    let vertChan = false;
    let currentHint = hint;

    if (currentPt != null) {
      currentTerm = null;
    }

    // Check for alignment with fixed points and with channels
    // at source and target segments only
    for (let i = 0; i < 2; i++) {
      const fixedVertAlign = currentPt != null && currentPt.x == currentHint.x;
      const fixedHozAlign = currentPt != null && currentPt.y == currentHint.y;

      const inHozChan = currentTerm != null && (currentHint.y >= currentTerm.y &&
          currentHint.y <= currentTerm.y + currentTerm.height);
      const inVertChan = currentTerm != null && (currentHint.x >= currentTerm.x &&
          currentHint.x <= currentTerm.x + currentTerm.width);

      hozChan = fixedHozAlign || (currentPt == null && inHozChan);
      vertChan = fixedVertAlign || (currentPt == null && inVertChan);

      // If the current hint falls in both the hor and vert channels in the case
      // of a floating port, or if the hint is exactly co-incident with a
      // fixed point, ignore the source and try to work out the orientation
      // from the target end
      if (i == 0 && ((hozChan && vertChan) || (fixedVertAlign && fixedHozAlign))) {
        // Continue to next iteration
      } else {
        if (currentPt != null && (!fixedHozAlign && !fixedVertAlign) && (inHozChan || inVertChan)) {
          horizontal = inHozChan ? false : true;
          break;
        }

        if (vertChan || hozChan) {
          horizontal = hozChan;

          if (i == 1) {
            // Work back from target end
            horizontal = hints.length % 2 == 0 ? hozChan : vertChan;
          }

          break;
        }
      }

      currentTerm = target;
      currentPt = pe;

      if (currentPt != null) {
        currentTerm = null;
      }

      currentHint = hints[hints.length - 1];

      if (fixedVertAlign && fixedHozAlign) {
        hints.splice(0, 1);
      }
    }

    if (horizontal && ((p0 != null && p0.y != hint.y) ||
      (p0 == null && source != null &&
      (hint.y < source.y || hint.y > source.y + source.height)))) {
      addPoint({ x: pt!.x, y: hint.y });
    } else if (!horizontal && ((p0 != null && p0.x != hint.x) ||
        (p0 == null && source != null &&
        (hint.x < source.x || hint.x > source.x + source.width)))) {
      addPoint({ x: hint.x, y: pt!.y });
    }

    if (horizontal) {
      pt!.y = hint.y;
    } else {
      pt!.x = hint.x;
    }

    for (let i = 0; i < hints.length; i++) {
      horizontal = !horizontal;
      hint = hints[i];

      if (horizontal) {
        pt!.y = hint.y;
      } else {
        pt!.x = hint.x;
      }

      addPoint({ x: pt!.x, y: pt!.y });
    }
  } else {
    hint = pt;
    // FIXME: First click in connect preview toggles orientation
    horizontal = true;
  }

  // Adds the last point
  pt = pe;

  if (pt == null && target != null) {
    pt = { x: getRoutingCenterX(target), y: getRoutingCenterY(target) };
  }

  if (pt != null) {
    if (hint != null) {
      if (horizontal && ((pe != null && pe.y != hint.y) ||
        (pe == null && target != null &&
        (hint.y < target.y || hint.y > target.y + target.height)))) {
        addPoint({ x: pt.x, y: hint.y });
      } else if (!horizontal && ((pe != null && pe.x != hint.x) ||
          (pe == null && target != null &&
          (hint.x < target.x || hint.x > target.x + target.width)))) {
        addPoint({ x: hint.x, y: pt.y });
      }
    }
  }

  // Removes bends inside the source terminal
  if (p0 == null && source != null) {
    while (tempPoints.length > 0 && tempPoints[0] != null &&
      contains(source, tempPoints[0].x, tempPoints[0].y)) {
      tempPoints.splice(0, 1);
    }
  }

  // Removes bends inside the target terminal
  if (pe == null && target != null) {
    while (tempPoints.length > 0 && tempPoints[tempPoints.length - 1] != null &&
      contains(target, tempPoints[tempPoints.length - 1].x, tempPoints[tempPoints.length - 1].y)) {
      tempPoints.splice(tempPoints.length - 1, 1);
    }
  }

  // Scales and smoothens edges
  for (let i = 0; i < tempPoints.length; i++) {
    pushPoint(tempPoints[i]);
  }

  // Removes last point if inside tolerance with end point
  if (pe != null && result[result.length - 1] != null &&
    Math.abs(pe.x - result[result.length - 1].x) <= tol &&
    Math.abs(pe.y - result[result.length - 1].y) <= tol) {
    result.splice(result.length - 1, 1);

    // Lines up second last point in result with end point
    if (result[result.length - 1] != null) {
      if (Math.abs(result[result.length - 1].x - pe.x) < tol) {
        result[result.length - 1].x = pe.x;
      }

      if (Math.abs(result[result.length - 1].y - pe.y) < tol) {
        result[result.length - 1].y = pe.y;
      }
    }
  }
}