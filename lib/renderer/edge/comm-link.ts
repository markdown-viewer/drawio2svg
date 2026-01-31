import type { Point } from '../../edge-router.ts';

export interface CommLinkPathResult {
  path: string;
  boundPoints: Point[];
}

export function buildCommLinkPath(startPoint: Point, endPoint: Point): CommLinkPathResult {
  const e = { x: startPoint.x, y: startPoint.y };
  const b = { x: endPoint.x, y: endPoint.y };
  let dx = b.x - e.x;
  let dy = b.y - e.y;
  e.x += 0.05 * dx;
  e.y += 0.05 * dy;
  b.x -= 0.05 * dx;
  b.y -= 0.05 * dy;
  dx = b.x - e.x;
  dy = b.y - e.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const midX = e.x + 0.5 * dx;
  const midY = e.y + 0.5 * dy;

  const pointA = {
    x: midX + ux * len * 0.1 + uy * len * 0.1,
    y: midY + uy * len * 0.1 - ux * len * 0.1
  };
  const pointB = {
    x: midX + ux * len / 3 * 0.1 - uy * len / 3 * 0.1,
    y: midY + uy * len / 3 * 0.1 + ux * len / 3 * 0.1
  };
  const pointC = {
    x: midX - ux * len / 3 * 0.1 + uy * len / 3 * 0.1,
    y: midY - uy * len / 3 * 0.1 - ux * len / 3 * 0.1
  };
  const pointD = {
    x: midX - ux * len * 0.1 - uy * len * 0.1,
    y: midY - uy * len * 0.1 + ux * len * 0.1
  };

  // Round to 2 decimal places to match the platform output precision
  const round = (n: number) => Math.round(n * 100) / 100;

  const path = `M ${round(e.x)} ${round(e.y)} ` +
    `L ${round(pointA.x)} ${round(pointA.y)} ` +
    `L ${round(pointB.x)} ${round(pointB.y)} ` +
    `L ${round(b.x)} ${round(b.y)} ` +
    `L ${round(pointD.x)} ${round(pointD.y)} ` +
    `L ${round(pointC.x)} ${round(pointC.y)} Z`;

  return {
    path,
    boundPoints: [e, pointA, pointB, b, pointD, pointC]
  };
}
