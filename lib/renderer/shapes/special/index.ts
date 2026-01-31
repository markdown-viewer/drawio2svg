import type { ShapeRegistry } from '../../shape-registry.ts';
import { CubeHandler } from './cube.ts';

export function registerSpecialHandlers(registry: ShapeRegistry): void {
  registry.register('cube', CubeHandler);
}
