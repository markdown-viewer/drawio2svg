export type { CellState, Point } from './types.ts';
export {
  getPerimeterPoint,
  getRectanglePerimeterPoint,
  getRhombusPerimeterPoint,
  getEllipsePerimeterPoint,
  getTrianglePerimeterPoint,
} from './perimeter/index.ts';
export type { PerimeterFn, GetPerimeterFn } from './perimeter/index.ts';
export { routeEdge } from './route-edge.ts';
