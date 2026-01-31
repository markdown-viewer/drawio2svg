import type { MxGeometry } from '../../parser.ts';
import type { Point } from '../../edge-router.ts';

export interface EdgeLabelPosition {
  x: number;
  y: number;
}

export function computeEdgeLabelPosition(
  geometry: MxGeometry | null | undefined,
  labelPoints: Point[]
): EdgeLabelPosition {
  const isRelative = geometry?.relative !== false;
  const offsetX = geometry?.offset?.x || 0;
  const offsetY = geometry?.offset?.y || 0;

  if (!isRelative) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const pt of labelPoints) {
      minX = Math.min(minX, pt.x);
      minY = Math.min(minY, pt.y);
      maxX = Math.max(maxX, pt.x);
      maxY = Math.max(maxY, pt.y);
    }
    const x = (minX + maxX) / 2 + offsetX;
    const y = (minY + maxY) / 2 + offsetY;
    return { x, y };
  }

  let totalLength = 0;
  const segmentLengths: number[] = [];
  for (let i = 0; i < labelPoints.length - 1; i++) {
    const dx = labelPoints[i + 1].x - labelPoints[i].x;
    const dy = labelPoints[i + 1].y - labelPoints[i].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    segmentLengths.push(len);
    totalLength += len;
  }

  const geoX = isRelative ? (geometry?.x || 0) : 0;
  const geoY = isRelative ? (geometry?.y || 0) : 0;

  const gx = geoX / 2;
  const dist = Math.round((gx + 0.5) * totalLength);

  let length = 0;
  let index = 1;
  let segment = segmentLengths[0] || 0;
  while (dist >= Math.round(length + segment) && index < labelPoints.length - 1) {
    length += segment;
    segment = segmentLengths[index] || 0;
    index += 1;
  }

  const factor = segment === 0 ? 0 : (dist - length) / segment;
  const p0 = labelPoints[index - 1] || labelPoints[0];
  const pe = labelPoints[index] || p0;

  const dx = pe.x - p0.x;
  const dy = pe.y - p0.y;

  const nx = segment === 0 ? 0 : dy / segment;
  const ny = segment === 0 ? 0 : dx / segment;

  let x = p0.x + dx * factor + (nx * geoY + offsetX);
  let y = p0.y + dy * factor - (ny * geoY - offsetY);

  return { x, y };
}
