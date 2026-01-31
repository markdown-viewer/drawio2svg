import type { Point } from '../../edge-router.ts';

/**
 * Build edge path string from points
 * Matches mxPolyline.paintEdgeShape + mxPolyline.paintCurvedLine from the platform
 */
export function buildEdgePath(
  allPoints: Point[],
  curved: boolean,
  edgeRounded: boolean,
  isOrthogonalEdge: boolean,
  edgeStyle: string,
  isLoop: boolean = false
): string {
  if (curved) {
    if (allPoints.length === 2) {
      const p0 = allPoints[0];
      const p1 = allPoints[1];
      return `M ${p0.x} ${p0.y} Q ${p0.x} ${p0.y} ${p1.x} ${p1.y}`;
    }

    if (allPoints.length > 2) {
    const n = allPoints.length;
    let pathD = `M ${allPoints[0].x} ${allPoints[0].y}`;

    for (let i = 1; i < n - 2; i++) {
      const p0 = allPoints[i];
      const p1 = allPoints[i + 1];
      const ix = (p0.x + p1.x) / 2;
      const iy = (p0.y + p1.y) / 2;
      pathD += ` Q ${p0.x} ${p0.y} ${ix} ${iy}`;
    }

    const p0 = allPoints[n - 2];
    const p1 = allPoints[n - 1];
    pathD += ` Q ${p0.x} ${p0.y} ${p1.x} ${p1.y}`;

    return pathD;
    }
    }

  const isAxisAligned = (points: Point[]): boolean => {
    const tol = 1e-6;
    for (let i = 1; i < points.length; i++) {
      const dx = Math.abs(points[i].x - points[i - 1].x);
      const dy = Math.abs(points[i].y - points[i - 1].y);
      if (dx > tol && dy > tol) return false;
    }
    return true;
  };

  if (edgeRounded && allPoints.length > 2 && (isOrthogonalEdge || edgeStyle === 'entityRelationEdgeStyle' || isLoop || isAxisAligned(allPoints))) {
    return buildRoundedOrthogonalPath(allPoints);
  }

  let pathD = `M ${allPoints[0].x} ${allPoints[0].y}`;
  for (let i = 1; i < allPoints.length; i++) {
    pathD += ` L ${allPoints[i].x} ${allPoints[i].y}`;
  }
  return pathD;
}

/**
 * Build rounded orthogonal path with bezier corners
 * Matches mxShape.addPoints from the platform
 */
export function buildRoundedOrthogonalPath(allPoints: Point[]): string {
  const arcSize = 10; // LINE_ARCSIZE / 2
  const pts = allPoints;
  const round2 = (value: number): number => Number(value.toFixed(2));

  if (pts.length === 0) return '';

  let pathD = `M ${round2(pts[0].x)} ${round2(pts[0].y)}`;
  let pt = pts[0];
  let i = 1;

  while (i < pts.length - 1) {
    const tmp = pts[i];
    const dx = pt.x - tmp.x;
    const dy = pt.y - tmp.y;

    if (dx !== 0 || dy !== 0) {
      let next = pts[i + 1];
      let nextIdx = i + 1;
      while (nextIdx < pts.length - 1 &&
             Math.round(next.x - tmp.x) === 0 &&
             Math.round(next.y - tmp.y) === 0) {
        nextIdx++;
        next = pts[nextIdx];
        i++;
      }

      const dx2 = next.x - tmp.x;
      const dy2 = next.y - tmp.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nx1 = dx * Math.min(arcSize, dist / 2) / dist;
      const ny1 = dy * Math.min(arcSize, dist / 2) / dist;

      const x1 = round2(tmp.x + nx1);
      const y1 = round2(tmp.y + ny1);
      pathD += ` L ${x1} ${y1}`;

      const dist2 = Math.max(1, Math.sqrt(dx2 * dx2 + dy2 * dy2));
      const nx2 = dx2 * Math.min(arcSize, dist2 / 2) / dist2;
      const ny2 = dy2 * Math.min(arcSize, dist2 / 2) / dist2;

      const x2 = round2(tmp.x + nx2);
      const y2 = round2(tmp.y + ny2);

      pathD += ` Q ${round2(tmp.x)} ${round2(tmp.y)} ${x2} ${y2}`;
      pt = { x: x2, y: y2 };
    } else {
      pathD += ` L ${round2(tmp.x)} ${round2(tmp.y)}`;
      pt = tmp;
    }

    i++;
  }

  const pe = pts[pts.length - 1];
  pathD += ` L ${round2(pe.x)} ${round2(pe.y)}`;

  return pathD;
}
