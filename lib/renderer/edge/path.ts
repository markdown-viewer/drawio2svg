import type { Point } from '../../edge-router.ts';
import { buildEdgePath } from './path-builder.ts';

export interface EdgePathParams {
  points: Point[];
  curved: boolean;
  edgeRounded: boolean;
  isOrthogonalEdge: boolean;
  edgeStyle: string;
  isLoop: boolean;
}

export function getEdgePathD(params: EdgePathParams): string {
  const { points, curved, edgeRounded, isOrthogonalEdge, edgeStyle, isLoop } = params;
  return buildEdgePath(points, curved, edgeRounded, isOrthogonalEdge, edgeStyle, isLoop);
}
