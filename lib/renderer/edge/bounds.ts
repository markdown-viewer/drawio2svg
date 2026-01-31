import type { Point } from '../../edge-router.ts';

export interface EdgeRenderResult {
  boundPoints: Point[];
  pathPoints: Point[];
  edgePathPoints?: Point[];
  labelPosition?: Point;
}

export function buildEdgeRenderResult(
  originalStartPoint: Point,
  linePoints: Point[],
  originalEndPoint: Point,
  boundPointsOverride: Point[] | null,
  labelPosition?: Point,
  edgePathPoints?: Point[]
): EdgeRenderResult {
  return {
    boundPoints: boundPointsOverride || [originalStartPoint, ...linePoints.slice(1, -1), originalEndPoint],
    pathPoints: linePoints,
    edgePathPoints,
    labelPosition,
  };
}
