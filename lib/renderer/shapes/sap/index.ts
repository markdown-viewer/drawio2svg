import type { ShapeRegistry } from '../../shape-registry.ts';
import { SapIconHandler } from './icon.ts';

export const registerSapHandlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.sap.icon', SapIconHandler);
};
