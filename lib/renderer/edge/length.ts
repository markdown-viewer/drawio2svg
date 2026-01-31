import type { Point } from '../../edge-router.ts';

export function getEdgeLength(points: Point[]): number {
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    totalLength += Math.hypot(dx, dy);
  }
  return totalLength;
}

export function shouldSkipZeroLengthEdge(points: Point[], hasLabel: boolean): boolean {
  if (hasLabel) return false;
  return getEdgeLength(points) === 0;
}
