import type { MxCell, MxGeometry, MxStyle } from '../../parser.ts';
import type { Point } from '../../edge-router.ts';
import { computeEdgeLabelPosition } from './label-position.ts';

export interface EdgeLabelRenderContext {
  renderEdgeLabel: (value: string, x: number, y: number, style: MxStyle) => void;
}

export interface EdgeLabelRenderParams {
  cell: MxCell;
  geometry: MxGeometry | null | undefined;
  style: MxStyle;
  originalStartPoint: Point;
  originalEndPoint: Point;
  linePoints: Point[];
}

export interface EdgeLabelRenderResult {
  labelPosition?: Point;
}

export function renderEdgeLabelIfAny(
  ctx: EdgeLabelRenderContext,
  params: EdgeLabelRenderParams
): EdgeLabelRenderResult {
  const { cell, geometry, style, originalStartPoint, originalEndPoint, linePoints } = params;

  if (!cell.value) {
    return {};
  }

  const labelPoints = [originalStartPoint, ...linePoints.slice(1, -1), originalEndPoint];
  const { x, y } = computeEdgeLabelPosition(geometry || null, labelPoints);

  ctx.renderEdgeLabel(cell.value, x, y, style);

  return { labelPosition: { x, y } };
}
