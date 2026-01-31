import type { MxStyle } from '../../parser.ts';
import type { CellState, Point } from '../../edge-router.ts';

// Type for perimeter function lookup
export type GetPerimeterFn = (shape: string | undefined) => ((bounds: CellState, next: Point, orthogonal: boolean, direction?: string) => Point) | null;

export interface FloatingEndpointParams {
  absolutePoints: Array<Point | null>;
  sourceState: CellState | null;
  targetState: CellState | null;
  isOrthogonalEdge: boolean;
  style: MxStyle;
  sourceIsEdgeChildLabel: boolean;
  targetIsEdgeChildLabel: boolean;
  getPerimeterPoint: (state: CellState, next: Point, orthogonal: boolean, getPerimeterFn?: GetPerimeterFn) => Point;
  getPerimeterFn?: GetPerimeterFn;
}

export function resolveFloatingEndpoints(params: FloatingEndpointParams): Array<Point | null> {
  const {
    absolutePoints,
    sourceState,
    targetState,
    isOrthogonalEdge,
    style,
    sourceIsEdgeChildLabel,
    targetIsEdgeChildLabel,
    getPerimeterPoint,
    getPerimeterFn,
  } = params;

  const getNextPoint = (opposite: CellState | null, source: boolean): Point | null => {
    const pts = absolutePoints;
    if (pts != null && pts.length >= 2) {
      const count = pts.length;
      const idx = source ? Math.min(1, count - 1) : Math.max(0, count - 2);
      const pt = pts[idx];
      if (pt != null) return pt;
    }
    if (opposite != null) {
      return { x: opposite.x + opposite.width / 2, y: opposite.y + opposite.height / 2 };
    }
    return null;
  };

  if (absolutePoints[absolutePoints.length - 1] == null && targetState != null) {
    const next = getNextPoint(sourceState, false);
    if (next != null) {
      const edgePerimeterSpacingRaw = parseFloat(style.perimeterSpacing as string);
      const edgePerimeterSpacing = Number.isFinite(edgePerimeterSpacingRaw) ? edgePerimeterSpacingRaw : 0;
      const targetSpacingRaw = parseFloat(style.targetPerimeterSpacing as string);
      const targetSpacing = Number.isFinite(targetSpacingRaw) ? targetSpacingRaw : 0;
      const targetCellSpacing = Number.isFinite(targetState.perimeterSpacing as number)
        ? (targetState.perimeterSpacing as number)
        : 0;
      const totalTargetSpacing = edgePerimeterSpacing + targetSpacing + targetCellSpacing;
      const targetPerimeterState = (!targetIsEdgeChildLabel && totalTargetSpacing !== 0)
        ? {
          ...targetState,
          x: targetState.x - totalTargetSpacing,
          y: targetState.y - totalTargetSpacing,
          width: targetState.width + totalTargetSpacing * 2,
          height: targetState.height + totalTargetSpacing * 2
        }
        : targetState;
      const targetPoint = getPerimeterPoint(targetPerimeterState, next, isOrthogonalEdge, getPerimeterFn);
      absolutePoints[absolutePoints.length - 1] = targetPoint;
    }
  }

  if (absolutePoints[0] == null && sourceState != null) {
    const next = getNextPoint(targetState, true);
    if (next != null) {
      const edgePerimeterSpacingRaw = parseFloat(style.perimeterSpacing as string);
      const edgePerimeterSpacing = Number.isFinite(edgePerimeterSpacingRaw) ? edgePerimeterSpacingRaw : 0;
      const sourceSpacingRaw = parseFloat(style.sourcePerimeterSpacing as string);
      const sourceSpacing = Number.isFinite(sourceSpacingRaw) ? sourceSpacingRaw : 0;
      const sourceCellSpacing = Number.isFinite(sourceState.perimeterSpacing as number)
        ? (sourceState.perimeterSpacing as number)
        : 0;
      const totalSourceSpacing = edgePerimeterSpacing + sourceSpacing + sourceCellSpacing;
      const sourcePerimeterState = (!sourceIsEdgeChildLabel && totalSourceSpacing !== 0)
        ? {
          ...sourceState,
          x: sourceState.x - totalSourceSpacing,
          y: sourceState.y - totalSourceSpacing,
          width: sourceState.width + totalSourceSpacing * 2,
          height: sourceState.height + totalSourceSpacing * 2
        }
        : sourceState;
      const sourcePoint = getPerimeterPoint(sourcePerimeterState, next, isOrthogonalEdge, getPerimeterFn);
      absolutePoints[0] = sourcePoint;
    }
  }

  return absolutePoints;
}
