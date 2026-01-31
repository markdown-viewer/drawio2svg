import type { ShapeRegistry } from '../../shape-registry.ts';
import { NetworksBusHandler } from './bus.ts';
import { NetworksCommLinkEdgeHandler } from './comm-link-edge.ts';

export function registerNetworksHandlers(registry: ShapeRegistry): void {
  registry.register('mxgraph.networks.bus', NetworksBusHandler);
  registry.register('mxgraph.networks.comm_link_edge', NetworksCommLinkEdgeHandler);
}
