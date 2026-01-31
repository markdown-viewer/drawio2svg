import type { MxCell } from '../../parser.ts';
import type { Point } from '../../edge-router.ts';

export interface EdgeOriginContext {
  getAbsolutePosition: (cell: MxCell, cellMap: Map<string, MxCell>) => { x: number; y: number };
}

export function getEdgeOrigin(
  ctx: EdgeOriginContext,
  cell: MxCell,
  cellMap: Map<string, MxCell>,
  offsetX: number,
  offsetY: number
): Point {
  let edgeOriginX = offsetX;
  let edgeOriginY = offsetY;

  if (cell.parent && cell.parent !== '0' && cell.parent !== '1') {
    const parentCell = cellMap.get(cell.parent);
    if (parentCell) {
      const parentPos = ctx.getAbsolutePosition(parentCell, cellMap);
      edgeOriginX += parentPos.x;
      edgeOriginY += parentPos.y;
    }
  }

  return { x: edgeOriginX, y: edgeOriginY };
}
