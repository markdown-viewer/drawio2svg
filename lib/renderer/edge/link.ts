import type { Point } from '../../edge-router.ts';

type LinkCommand = {
  cmd: 'M' | 'L' | 'Q';
  points: Array<{ u: number; v: number }>;
};

const ISOMETRIC_LINK_TEMPLATE: LinkCommand[] = [
  { cmd: 'M', points: [{ u: 0.0159, v: -0.545389 }] },
  { cmd: 'L', points: [{ u: 0.4516, v: 0.524307 }] },
  { cmd: 'L', points: [{ u: 0.4405, v: 0.145743 }] },
  { cmd: 'L', points: [{ u: 0.4295, v: -0.231905 }] },
  { cmd: 'Q', points: [{ u: 0.3742, v: -2.121058 }, { u: 0.5804, v: -1.615084 }] },
  { cmd: 'L', points: [{ u: 1.0159, v: -0.545389 }] },
  { cmd: 'M', points: [{ u: 0.9841, v: 0.545389 }] },
  { cmd: 'L', points: [{ u: 0.5484, v: -0.524307 }] },
  { cmd: 'L', points: [{ u: 0.5595, v: -0.145743 }] },
  { cmd: 'Q', points: [{ u: 0.5595, v: -0.145743 }, { u: 0.5595, v: -0.145743 }] },
  { cmd: 'L', points: [{ u: 0.5705, v: 0.231905 }] },
  { cmd: 'Q', points: [{ u: 0.6258, v: 2.121058 }, { u: 0.4196, v: 1.615084 }] },
  { cmd: 'L', points: [{ u: -0.0159, v: 0.545389 }] },
  { cmd: 'M', points: [{ u: 0.9841, v: 0.545389 }] },
];

export function buildIsometricLinkPath(startPoint: Point, endPoint: Point, linkWidth: number): string {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const len = Math.hypot(dx, dy);
  if (len <= 0) {
    return `M ${startPoint.x} ${startPoint.y}`;
  }

  const ux = dx / len;
  const uy = dy / len;
  const vx = -uy;
  const vy = ux;
  const width = Number.isFinite(linkWidth) ? linkWidth : 4;

  const format = (value: number): string => String(Number(value.toFixed(2)));
  const toPoint = (u: number, v: number): string => {
    const x = startPoint.x + ux * (u * len) + vx * (v * width);
    const y = startPoint.y + uy * (u * len) + vy * (v * width);
    return `${format(x)} ${format(y)}`;
  };

  return ISOMETRIC_LINK_TEMPLATE
    .map((segment) => {
      const coords = segment.points.map((pt) => toPoint(pt.u, pt.v)).join(' ');
      return `${segment.cmd} ${coords}`;
    })
    .join(' ');
}

type OffsetPoint = { x: number; y: number };

const round2 = (value: number): number => Number(value.toFixed(2));

const formatPoint = (point: OffsetPoint): string => `${round2(point.x)} ${round2(point.y)}`;

const lineIntersection = (
  a1: OffsetPoint,
  a2: OffsetPoint,
  b1: OffsetPoint,
  b2: OffsetPoint
): OffsetPoint | null => {
  const denom = (a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x);
  if (Math.abs(denom) < 1e-6) return null;
  const det1 = a1.x * a2.y - a1.y * a2.x;
  const det2 = b1.x * b2.y - b1.y * b2.x;
  const x = (det1 * (b1.x - b2.x) - (a1.x - a2.x) * det2) / denom;
  const y = (det1 * (b1.y - b2.y) - (a1.y - a2.y) * det2) / denom;
  return { x, y };
};

const offsetPolyline = (points: Point[], offset: number, normalSign: number): OffsetPoint[] => {
  if (points.length === 0) return [];
  if (points.length === 1) return [{ x: points[0].x, y: points[0].y }];

  const normals: OffsetPoint[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const dist = Math.hypot(dx, dy);
    if (dist > 0) {
      normals[i] = { x: (-dy / dist) * normalSign, y: (dx / dist) * normalSign };
    } else {
      normals[i] = { x: 0, y: 0 };
    }
  }

  const offsetPoints: OffsetPoint[] = [];
  offsetPoints.push({
    x: points[0].x + normals[0].x * offset,
    y: points[0].y + normals[0].y * offset,
  });

  for (let i = 1; i < points.length - 1; i++) {
    const prevNormal = normals[i - 1];
    const nextNormal = normals[i];
    const a1 = { x: points[i - 1].x + prevNormal.x * offset, y: points[i - 1].y + prevNormal.y * offset };
    const a2 = { x: points[i].x + prevNormal.x * offset, y: points[i].y + prevNormal.y * offset };
    const b1 = { x: points[i].x + nextNormal.x * offset, y: points[i].y + nextNormal.y * offset };
    const b2 = { x: points[i + 1].x + nextNormal.x * offset, y: points[i + 1].y + nextNormal.y * offset };
    const intersection = lineIntersection(a1, a2, b1, b2);
    if (intersection) {
      offsetPoints.push(intersection);
    } else {
      offsetPoints.push({ x: points[i].x + nextNormal.x * offset, y: points[i].y + nextNormal.y * offset });
    }
  }

  const lastNormal = normals[normals.length - 1];
  offsetPoints.push({
    x: points[points.length - 1].x + lastNormal.x * offset,
    y: points[points.length - 1].y + lastNormal.y * offset,
  });

  return offsetPoints;
};

export function buildPolylineLinkPath(points: Point[], linkWidth: number, normalSign: number): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${formatPoint(points[0])}`;

  const offset = Math.abs(linkWidth) / 2;
  const left = offsetPolyline(points, offset, normalSign);
  const right = offsetPolyline(points, -offset, normalSign);

  let pathD = `M ${formatPoint(right[0])}`;
  for (let i = 1; i < right.length; i++) {
    pathD += ` L ${formatPoint(right[i])}`;
  }

  const leftEnd = left[left.length - 1];
  pathD += ` M ${formatPoint(leftEnd)}`;
  for (let i = left.length - 2; i >= 0; i--) {
    pathD += ` L ${formatPoint(left[i])}`;
  }
  pathD += ` M ${formatPoint(leftEnd)}`;

  return pathD;
}
