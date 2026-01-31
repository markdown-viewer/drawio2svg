import type { MxCell } from '../parser.ts';

export interface Point {
  x: number;
  y: number;
}

export function isEdgeChildLabel(cell: MxCell, cellMap: Map<string, MxCell>): boolean {
  return Boolean(
    cell.parent && cell.parent !== '0' && cell.parent !== '1' &&
    cellMap.get(cell.parent)?.edge && cell.geometry?.relative
  );
}

/**
 * Get absolute position of a cell (considering parent hierarchy)
 */
export function getAbsolutePosition(
  cell: MxCell,
  cellMap: Map<string, MxCell>,
  edgePathPoints: Map<string, Point[]>
): { x: number; y: number } {
  const geo = cell.geometry;
  if (!geo) return { x: 0, y: 0 };

  let x = geo.x;
  let y = geo.y;

  // If cell has a parent that's not root (id 0 or 1), add parent offset
  if (cell.parent && cell.parent !== '0' && cell.parent !== '1') {
    const parent = cellMap.get(cell.parent);

    // Handle edge child labels (parent is edge with relative geometry)
    if (parent?.edge && geo.relative) {
      const edgePoints = edgePathPoints.get(cell.parent);
      if (edgePoints && edgePoints.length >= 2) {
        // Calculate position along edge path
        // geo.x is relative position: -1 = start, 0 = middle, 1 = end
        // Formula: dist = (geo.x / 2 + 0.5) * edgeLength
        const relativePos = (geo.x / 2 + 0.5); // Convert -1..1 to 0..1

        // Calculate total edge length and find point at relative position
        let totalLength = 0;
        const segments: { start: Point; end: Point; length: number }[] = [];

        for (let i = 0; i < edgePoints.length - 1; i++) {
          const p1 = edgePoints[i];
          const p2 = edgePoints[i + 1];
          const segLength = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
          segments.push({ start: p1, end: p2, length: segLength });
          totalLength += segLength;
        }

        // Find point at relative position (match mxGraphView.getPoint rounding)
        const dist = Math.round(relativePos * totalLength);
        let length = 0;
        let index = 0;
        let segment = segments[0].length;

        while (dist >= Math.round(length + segment) && index < segments.length - 1) {
          length += segment;
          index += 1;
          segment = segments[index].length;
        }

        const factor = segment === 0 ? 0 : (dist - length) / segment;
        const segmentStart = segments[index].start;
        const segmentEnd = segments[index].end;
        const dx = segmentEnd.x - segmentStart.x;
        const dy = segmentEnd.y - segmentStart.y;
        const pointOnEdge = {
          x: segmentStart.x + dx * factor,
          y: segmentStart.y + dy * factor
        };
        const segmentLength = segment;

        // Apply orthogonal offset like mxGraphView.getPoint
        const offset = geo.offset || { x: 0, y: 0 };
        const gy = geo.y || 0;
        const nx = segmentLength === 0 ? 0 : dy / segmentLength;
        const ny = segmentLength === 0 ? 0 : dx / segmentLength;
        x = pointOnEdge.x + (nx * gy + offset.x);
        y = pointOnEdge.y - (ny * gy - offset.y);

        return { x, y };
      }
    }

    if (parent?.geometry && parent.vertex) {
      // Relative geometry inside parent vertex (e.g., icons inside shapes)
      if (geo.relative) {
        const parentPos = getAbsolutePosition(parent, cellMap, edgePathPoints);
        const offset = geo.offset || { x: 0, y: 0 };
        x = parentPos.x + (geo.x || 0) * parent.geometry.width + offset.x;
        y = parentPos.y + (geo.y || 0) * parent.geometry.height + offset.y;
        return { x, y };
      }
      const parentPos = getAbsolutePosition(parent, cellMap, edgePathPoints);
      x += parentPos.x;
      y += parentPos.y;
    }
  }

  return { x, y };
}
