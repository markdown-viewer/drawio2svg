import type { Point } from '../../edge-router.ts';

export interface EdgeAngles {
  startAngle: number;
  endAngle: number;
}

export function getEdgeAngles(points: Point[]): EdgeAngles {
  const startAngle = Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x);
  const endAngle = Math.atan2(
    points[points.length - 1].y - points[points.length - 2].y,
    points[points.length - 1].x - points[points.length - 2].x
  );

  return { startAngle, endAngle };
}
