import type { ShapeRegistry } from '../../shape-registry.ts';
import { Gcp2DoubleRectHandler } from './double-rect.ts';
import { Gcp2HexIconHandler } from './hex-icon.ts';

export function registerGcp2Handlers(registry: ShapeRegistry): void {
  registry.register('mxgraph.gcp2.doubleRect', Gcp2DoubleRectHandler);
  registry.register('mxgraph.gcp2.hexIcon', Gcp2HexIconHandler);
}
