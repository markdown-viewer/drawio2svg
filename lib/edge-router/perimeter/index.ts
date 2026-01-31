import type { CellState, Point } from '../types.ts';
import { getBackbonePerimeterPoint } from './backbone.ts';
import { getRectanglePerimeterPoint } from './rectangle.ts';
import { getHexagonPerimeterPoint } from './hexagon.ts';
import { getEllipsePerimeterPoint } from './ellipse.ts';
import { getRhombusPerimeterPoint } from './rhombus.ts';

export { getRectanglePerimeterPoint } from './rectangle.ts';
export { getRhombusPerimeterPoint } from './rhombus.ts';
export { getEllipsePerimeterPoint } from './ellipse.ts';
export { getTrianglePerimeterPoint } from './triangle.ts';
export { getHexagonPerimeterPoint } from './hexagon.ts';

// Type for perimeter function
export type PerimeterFn = (bounds: CellState, next: Point, orthogonal: boolean, direction?: string) => Point;

// Type for perimeter function lookup
export type GetPerimeterFn = (shape: string | undefined) => PerimeterFn | null;

/**
 * Get the perimeter intersection point based on the shape type.
 * Uses handler-provided perimeter functions when available.
 */
export function getPerimeterPoint(
  bounds: CellState,
  next: Point,
  orthogonal: boolean = false,
  getPerimeterFn?: GetPerimeterFn
): Point {
  const shape = bounds.shape?.toLowerCase();
  const rotation = bounds.rotation || 0;
  const perimeter = bounds.perimeter?.toLowerCase();
  const direction = (bounds.direction as string | undefined)?.toLowerCase();
  const useOrthogonal = orthogonal || perimeter === 'orthogonalperimeter';
  const effectiveOrthogonal = rotation !== 0 ? false : useOrthogonal;

  const applyPerimeter = (pt: Point): Point => {
    if (perimeter === 'ellipseperimeter') {
      return getEllipsePerimeterPoint(bounds, pt, effectiveOrthogonal);
    }
    // Special perimeter styles take precedence
    if (perimeter === 'centerperimeter') {
      return {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height / 2
      };
    }
    if (perimeter === 'lifelineperimeter') {
      const cx = bounds.x + bounds.width / 2;
      const y = Math.max(bounds.y, Math.min(bounds.y + bounds.height, pt.y));
      return { x: cx, y };
    }
    if (perimeter === 'backboneperimeter') {
      return getBackbonePerimeterPoint(bounds, pt);
    }

    // Query handler for perimeter function
    const perimeterFn = getPerimeterFn?.(shape);
    if (perimeterFn) {
      return perimeterFn(bounds, pt, effectiveOrthogonal, direction);
    }

    // Use ellipse perimeter for ellipse shapes
    if (shape === 'ellipse') {
      return getEllipsePerimeterPoint(bounds, pt, effectiveOrthogonal);
    }

    // Default to rectangle perimeter
    return getRectanglePerimeterPoint(bounds, pt, effectiveOrthogonal);
  };

  if (rotation !== 0 && !(useOrthogonal && shape === 'image')) {
    const cx = bounds.x + bounds.width / 2;
    const cy = bounds.y + bounds.height / 2;
    const rad = rotation * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const dx = next.x - cx;
    const dy = next.y - cy;
    const rotatedNext = {
      x: cx + dx * cos + dy * sin,
      y: cy - dx * sin + dy * cos
    };
    const rotatedPoint = applyPerimeter(rotatedNext);
    const pdx = rotatedPoint.x - cx;
    const pdy = rotatedPoint.y - cy;
    return {
      x: cx + pdx * cos - pdy * sin,
      y: cy + pdx * sin + pdy * cos
    };
  }

  if (perimeter === 'hexagonperimeter') {
    return getHexagonPerimeterPoint(bounds, next, effectiveOrthogonal);
  }

  return applyPerimeter(next);
}