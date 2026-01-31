import type { ShapeRegistry } from '../../shape-registry.ts';
import { CiscoSafeCompositeIconHandler } from './composite-icon.ts';

export const registerCiscoSafeHandlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.cisco_safe.compositeIcon', CiscoSafeCompositeIconHandler);
};
