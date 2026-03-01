import type { Point } from '../../edge-router.ts';
import type { SvgBuilder } from '../../svg/index.ts';

/**
 * Middle shape types placed at the midpoint of an edge.
 * Maps to PlantUML socket/ball notation:
 *   ball       = -0-    (circle only)
 *   ballSocket = -0)-   (circle + right arc)
 *   socketBall = -(0-   (left arc + circle)
 *   socket     = -(0)-  (left arc + circle + right arc)
 */
export type MiddleShapeType = 'ball' | 'ballSocket' | 'socketBall' | 'socket';

export interface MiddleShapeContext {
  builder: SvgBuilder;
  getCurrentGroup: () => Element | null;
}

export interface MiddleShapeResult {
  elements: Element[];
  boundPoints: Point[];
}

/**
 * Find the midpoint along a polyline, returning the point and the direction angle.
 */
function findMidpoint(points: Point[]): { point: Point; angle: number } {
  if (points.length < 2) {
    return { point: points[0] || { x: 0, y: 0 }, angle: 0 };
  }

  let totalLength = 0;
  const segLengths: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const len = Math.hypot(dx, dy);
    segLengths.push(len);
    totalLength += len;
  }

  const halfDist = totalLength / 2;
  let accumulated = 0;
  for (let i = 0; i < segLengths.length; i++) {
    const segLen = segLengths[i];
    if (accumulated + segLen >= halfDist || i === segLengths.length - 1) {
      const t = segLen > 0 ? (halfDist - accumulated) / segLen : 0;
      const p0 = points[i];
      const p1 = points[i + 1];
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      return {
        point: { x: p0.x + dx * t, y: p0.y + dy * t },
        angle: Math.atan2(dy, dx),
      };
    }
    accumulated += segLen;
  }

  // Fallback
  const mid = Math.floor(points.length / 2);
  return { point: { ...points[mid] }, angle: 0 };
}

// Base radii at strokeWidth=1; matches oval arrow: (size + strokeWidth * 2) / 2 where size=6
const BASE_BALL_RADIUS = 3;
const BASE_ARC_RADIUS = 7;

/**
 * Render a middle shape (ball/socket) at the midpoint of an edge.
 */
export function renderMiddleShape(
  ctx: MiddleShapeContext,
  normalizedPoints: Point[],
  shapeType: MiddleShapeType,
  strokeColor: string,
  strokeWidth: number = 1,
): MiddleShapeResult {
  const { builder } = ctx;
  const group = ctx.getCurrentGroup();
  if (!group) return { elements: [], boundPoints: [] };

  // Scale dimensions with strokeWidth — ball uses same formula as oval arrow: base + strokeWidth
  const BALL_RADIUS = BASE_BALL_RADIUS + strokeWidth;
  const ARC_RADIUS = BASE_ARC_RADIUS + strokeWidth * 2;

  const { point: center, angle } = findMidpoint(normalizedPoints);
  const cx = Number(center.x.toFixed(2));
  const cy = Number(center.y.toFixed(2));
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  // Perpendicular direction (rotate 90 degrees)
  const perpX = -sin;
  const perpY = cos;

  const elements: Element[] = [];
  const boundPoints: Point[] = [];

  // For full socket '(0)', draw a white background circle to erase the line beneath
  if (shapeType === 'socket') {
    const eraseCircle = builder.createEllipse(cx, cy, ARC_RADIUS, ARC_RADIUS);
    eraseCircle.setAttribute('fill', '#FFFFFF');
    eraseCircle.setAttribute('stroke', '#FFFFFF');
    eraseCircle.setAttribute('stroke-width', String(strokeWidth));
    group.appendChild(eraseCircle);
    elements.push(eraseCircle);
  }

  // Draw socket arcs
  const hasLeftArc = shapeType === 'socketBall' || shapeType === 'socket';
  const hasRightArc = shapeType === 'ballSocket' || shapeType === 'socket';

  if (hasRightArc) {
    // Arc on the "right" side (in the direction of the edge)
    // Half-circle arc perpendicular to the edge direction
    const halfArc = ARC_RADIUS * Math.SQRT1_2;
    const arcStart = {
      x: cx + cos * halfArc + perpX * halfArc,
      y: cy + sin * halfArc + perpY * halfArc,
    };
    const arcEnd = {
      x: cx + cos * halfArc - perpX * halfArc,
      y: cy + sin * halfArc - perpY * halfArc,
    };
    const d = `M ${arcStart.x.toFixed(2)} ${arcStart.y.toFixed(2)} `
      + `A ${ARC_RADIUS},${ARC_RADIUS} 0 0 0 ${arcEnd.x.toFixed(2)} ${arcEnd.y.toFixed(2)}`;
    const arc = builder.createPath(d);
    arc.setAttribute('fill', 'none');
    arc.setAttribute('stroke', strokeColor);
    arc.setAttribute('stroke-width', String(strokeWidth));
    group.appendChild(arc);
    elements.push(arc);
    boundPoints.push(arcStart, arcEnd, {
      x: cx + cos * ARC_RADIUS,
      y: cy + sin * ARC_RADIUS,
    });
  }

  if (hasLeftArc) {
    // Arc on the "left" side (opposite to the edge direction)
    const halfArc = ARC_RADIUS * Math.SQRT1_2;
    const arcStart = {
      x: cx - cos * halfArc - perpX * halfArc,
      y: cy - sin * halfArc - perpY * halfArc,
    };
    const arcEnd = {
      x: cx - cos * halfArc + perpX * halfArc,
      y: cy - sin * halfArc + perpY * halfArc,
    };
    const d = `M ${arcStart.x.toFixed(2)} ${arcStart.y.toFixed(2)} `
      + `A ${ARC_RADIUS},${ARC_RADIUS} 0 0 0 ${arcEnd.x.toFixed(2)} ${arcEnd.y.toFixed(2)}`;
    const arc = builder.createPath(d);
    arc.setAttribute('fill', 'none');
    arc.setAttribute('stroke', strokeColor);
    arc.setAttribute('stroke-width', String(strokeWidth));
    group.appendChild(arc);
    elements.push(arc);
    boundPoints.push(arcStart, arcEnd, {
      x: cx - cos * ARC_RADIUS,
      y: cy - sin * ARC_RADIUS,
    });
  }

  // Draw the ball (circle) — always present
  const ball = builder.createEllipse(cx, cy, BALL_RADIUS, BALL_RADIUS);
  ball.setAttribute('fill', '#FFFFFF');
  ball.setAttribute('stroke', strokeColor);
  ball.setAttribute('stroke-width', String(strokeWidth));
  ball.setAttribute('stroke-miterlimit', '10');
  ball.setAttribute('pointer-events', 'all');
  group.appendChild(ball);
  elements.push(ball);

  // Bound points for the ball
  boundPoints.push(
    { x: cx - BALL_RADIUS, y: cy - BALL_RADIUS },
    { x: cx + BALL_RADIUS, y: cy + BALL_RADIUS },
  );

  return { elements, boundPoints };
}
