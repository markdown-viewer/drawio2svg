import type { CellState, Point } from './types.ts';
import {
  EntityRelation,
  Loop,
  ElbowConnector,
  SegmentConnector,
  OrthConnector
} from './styles/index.ts';

// ============================================================================
// routeEdge - main entry point for edge routing
// ============================================================================

export function routeEdge(
  edgeStyle: string | undefined,
  elbow: string | undefined,
  source: CellState | null,
  target: CellState | null,
  p0: Point | null,
  pe: Point | null,
  hints: Point[],
  segment: number | undefined,
  isLoop: boolean = false,
  loopEnabled: boolean = false,
  orthogonalLoop: boolean = false,
  loopDirection: string = 'west',
  sourceBuffer?: number,
  targetBuffer?: number
): Point[] {
  void orthogonalLoop;
  const result: Point[] = [];

  const getCenter = (state: CellState | null): Point | null => {
    if (!state) return null;
    return { x: state.x + state.width / 2, y: state.y + state.height / 2 };
  };

  const isometricConnector = (
    src: CellState | null,
    tgt: CellState | null,
    start: Point | null,
    end: Point | null,
    points: Point[],
    useHorizontalElbow: boolean
  ): void => {
    let p0 = start;
    let pe = end;
    const pt = points && points.length > 0 ? points[0] : null;

    if (!p0) p0 = getCenter(src);
    if (!pe) pe = getCenter(tgt);

    if (!p0 || !pe) return;

    const isoHVector = { x: Math.cos(-Math.PI / 6), y: Math.sin(-Math.PI / 6) };
    const isoVVector = { x: Math.cos(-5 * Math.PI / 6), y: Math.sin(-5 * Math.PI / 6) };

    const a1 = isoHVector.x;
    const a2 = isoHVector.y;
    const b1 = isoVVector.x;
    const b2 = isoVVector.y;

    let last = { x: p0.x, y: p0.y };

    const isoLineTo = (x: number, y: number, ignoreFirst: boolean) => {
      const c1 = x - last.x;
      const c2 = y - last.y;
      const h = (b2 * c1 - b1 * c2) / (a1 * b2 - a2 * b1);
      const v = (a2 * c1 - a1 * c2) / (a2 * b1 - a1 * b2);

      if (useHorizontalElbow) {
        if (ignoreFirst) {
          last = { x: last.x + a1 * h, y: last.y + a2 * h };
          result.push(last);
        }
        last = { x: last.x + b1 * v, y: last.y + b2 * v };
        result.push(last);
      } else {
        if (ignoreFirst) {
          last = { x: last.x + b1 * v, y: last.y + b2 * v };
          result.push(last);
        }
        last = { x: last.x + a1 * h, y: last.y + a2 * h };
        result.push(last);
      }
    };

    const control = pt ?? { x: p0.x + (pe.x - p0.x) / 2, y: p0.y + (pe.y - p0.y) / 2 };
    isoLineTo(control.x, control.y, true);
    isoLineTo(pe.x, pe.y, false);
  };

  // Handle loop edges (self-referencing edges)
  // Use Loop routing when loop=1 (explicit) or orthogonalLoop is not set (default behavior).
  // When orthogonalLoop=1 without loop=1, suppress the edge (return empty).
  if (isLoop && source != null && (!hints || hints.length === 0)) {
    if (loopEnabled || !orthogonalLoop) {
      Loop(source, target, hints, result, p0, pe, 10, loopDirection);
    }
    return result;
  }
  
  switch (edgeStyle) {
    case 'orthogonalEdgeStyle':
      OrthConnector(source, target, hints, result, p0, pe, sourceBuffer, targetBuffer);
      break;
      
    case 'segmentEdgeStyle':
      SegmentConnector(source, target, hints, result, p0, pe);
      break;
      
    case 'entityRelationEdgeStyle':
      EntityRelation(source, target, hints, result, p0, pe, segment);
      break;
      
    case 'elbowEdgeStyle':
      ElbowConnector(source, target, hints, result, p0, pe, elbow === 'vertical');
      break;
      
    case 'isometricEdgeStyle':
      isometricConnector(source, target, p0, pe, hints || [], elbow !== 'vertical');
      break;
      
    default:
      // No routing style - direct line (use hints if provided)
      if (hints && hints.length > 0) {
        return hints;
      }
      break;
  }
  
  return result;
}
