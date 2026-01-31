import type { ShapeRegistry } from '../../shape-registry.ts';
import { IbmBoxHandler } from './box.ts';

export const registerIbmHandlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.ibm.box', IbmBoxHandler);
};
