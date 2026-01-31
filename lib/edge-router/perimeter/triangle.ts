import type { CellState, Point } from '../types.ts';
import { lineIntersection } from '../utils.ts';

// ============================================================================
// getTrianglePerimeterPoint - calculate perimeter intersection point for triangle
// ============================================================================

/**
 * Calculate the intersection point on a triangle perimeter.
 * Default triangle (direction='east') points to the right:
 * - Top-left corner (x, y)
 * - Right tip (x + width, y + height/2)
 * - Bottom-left corner (x, y + height)
 */
export function getTrianglePerimeterPoint(
  bounds: CellState,
  next: Point,
  orthogonal: boolean = false,
  direction: string = 'east'
): Point {
  const { x, y, width, height } = bounds;
  const cx = x + width / 2;
  const cy = y + height / 2;

  // Define triangle vertices based on direction
  let corner1: Point, tip: Point, corner2: Point;
  const isVertical = direction === 'north' || direction === 'south';

  switch (direction) {
    case 'north':
      corner1 = { x: x, y: y + height };          // bottom-left
      tip = { x: cx, y: y };                       // top (tip)
      corner2 = { x: x + width, y: y + height };  // bottom-right
      break;
    case 'south':
      corner1 = { x: x, y: y };                    // top-left
      tip = { x: cx, y: y + height };              // bottom (tip)
      corner2 = { x: x + width, y: y };           // top-right
      break;
    case 'west':
      corner1 = { x: x + width, y: y };           // top-right
      tip = { x: x, y: cy };                       // left (tip)
      corner2 = { x: x + width, y: y + height };  // bottom-right
      break;
    case 'east':
    default:
      corner1 = { x: x, y: y };                    // top-left
      tip = { x: x + width, y: cy };               // right (tip)
      corner2 = { x: x, y: y + height };          // bottom-left
      break;
  }

  const px = next.x;
  const py = next.y;

  // Calculate angle from center to target
  const dx = px - cx;
  const dy = py - cy;
  const angle = isVertical ? Math.atan2(dx, dy) : Math.atan2(dy, dx);

  // Calculate the angle of the triangle's slanted sides
  const sideAngle = isVertical ? Math.atan2(width, height) : Math.atan2(height, width);

  // Determine if target is on the "base" side or one of the slanted sides
  let onBaseSide: boolean;
  if (direction === 'north' || direction === 'west') {
    onBaseSide = angle > -sideAngle && angle < sideAngle;
  } else {
    onBaseSide = angle < -Math.PI + sideAngle || angle > Math.PI - sideAngle;
  }

  if (onBaseSide) {
    // Target is on the base (flat) side
    if (orthogonal) {
      if (isVertical && px >= corner1.x && px <= corner2.x) {
        return { x: px, y: corner1.y };
      }
      if (!isVertical && py >= corner1.y && py <= corner2.y) {
        return { x: corner1.x, y: py };
      }
    }

    // Calculate intersection with base edge
    if (direction === 'north') {
      return { x: x + width / 2 + height * Math.tan(angle) / 2, y: y + height };
    } else if (direction === 'south') {
      return { x: x + width / 2 - height * Math.tan(angle) / 2, y: y };
    } else if (direction === 'west') {
      return { x: x + width, y: y + height / 2 + width * Math.tan(angle) / 2 };
    } else { // east
      return { x: x, y: y + height / 2 - width * Math.tan(angle) / 2 };
    }
  } else {
    // Target is on one of the slanted sides
    let mx = cx, my = cy;

    if (orthogonal) {
      if (py >= y && py <= y + height) {
        mx = isVertical ? cx : (direction === 'west' ? x + width : x);
        my = py;
      } else if (px >= x && px <= x + width) {
        mx = px;
        my = isVertical ? (direction === 'north' ? y + height : y) : cy;
      }
    }

    // Determine which edge to intersect
    let result: Point | null;
    if (isVertical) {
      if (px <= cx) {
        result = lineIntersection(px, py, mx, my, corner1.x, corner1.y, tip.x, tip.y);
      } else {
        result = lineIntersection(px, py, mx, my, tip.x, tip.y, corner2.x, corner2.y);
      }
    } else {
      if (py <= cy) {
        result = lineIntersection(px, py, mx, my, corner1.x, corner1.y, tip.x, tip.y);
      } else {
        result = lineIntersection(px, py, mx, my, tip.x, tip.y, corner2.x, corner2.y);
      }
    }

    return result || { x: cx, y: cy };
  }
}