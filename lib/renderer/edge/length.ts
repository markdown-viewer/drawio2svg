import type { Point } from '../../edge-router.ts';

// Minimum edge length threshold (in pixels) below which edges are considered too short to render
const MIN_EDGE_LENGTH_THRESHOLD = 1;

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
  // Skip edges that are too short to be visually meaningful
  return getEdgeLength(points) < MIN_EDGE_LENGTH_THRESHOLD;
}
