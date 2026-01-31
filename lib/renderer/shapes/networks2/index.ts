import type { ShapeRegistry } from '../../shape-registry.ts';
import { Networks2IconHandler } from './icon.ts';

export const registerNetworks2Handlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.networks2.icon', Networks2IconHandler);
};
