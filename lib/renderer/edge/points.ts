import type { Point } from '../../edge-router.ts';

export function finalizeAbsolutePoints(absolutePoints: Array<Point | null>): Point[] | null {
  if (absolutePoints[0] == null || absolutePoints[absolutePoints.length - 1] == null) {
    return null;
  }

  return absolutePoints as Point[];
}
