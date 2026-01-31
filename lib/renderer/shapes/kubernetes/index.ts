import type { ShapeRegistry } from '../../shape-registry.ts';
import { KubernetesIconHandler } from './icon.ts';
import { KubernetesIcon2Handler } from './icon2.ts';

export const registerKubernetesHandlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.kubernetes.icon', KubernetesIconHandler);
  registry.register('mxgraph.kubernetes.icon2', KubernetesIcon2Handler);
};
