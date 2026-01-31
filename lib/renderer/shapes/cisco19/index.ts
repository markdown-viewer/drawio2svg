import type { ShapeRegistry } from '../../shape-registry.ts';
import { Cisco19RectHandler } from './rect.ts';

export const registerCisco19Handlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.cisco19.rect', Cisco19RectHandler);
};
