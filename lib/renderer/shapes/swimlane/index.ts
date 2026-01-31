import type { ShapeRegistry } from '../../shape-registry.ts';
import { SwimlaneHandler } from './swimlane.ts';

export function registerSwimlaneHandlers(registry: ShapeRegistry): void {
  registry.register('swimlane', SwimlaneHandler);
}
