import type { MxStyle } from '../../parser.ts';
import { routeEdge, type CellState, type Point } from '../../edge-router.ts';

export interface EdgeRoutingParams {
  style: MxStyle;
  edgeStyle?: string;
  elbowType?: string;
  sourceState: CellState | null;
  targetState: CellState | null;
  p0: Point | null;
  pe: Point | null;
  controlHints: Point[];
  isLoop: boolean;
  loopEnabled: boolean;
  orthogonalLoop: boolean;
  loopDirection: string;
  sourceBuffer: number;
  targetBuffer: number;
}

export function getRouterPoints(params: EdgeRoutingParams): Point[] {
  const {
    style,
    edgeStyle,
    elbowType,
    sourceState,
    targetState,
    p0,
    pe,
    controlHints,
    isLoop,
    loopEnabled,
    orthogonalLoop,
    loopDirection,
    sourceBuffer,
    targetBuffer,
  } = params;

  const segmentValue = parseFloat(style.segment as string);
  const segment = Number.isFinite(segmentValue) ? segmentValue : 30;

  return routeEdge(
    edgeStyle,
    elbowType,
    sourceState,
    targetState,
    p0,
    pe,
    controlHints,
    segment,
    isLoop,
    loopEnabled,
    orthogonalLoop,
    loopDirection,
    sourceBuffer,
    targetBuffer
  );
}
