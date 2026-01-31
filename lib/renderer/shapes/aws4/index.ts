import type { ShapeRegistry } from '../../shape-registry.ts';
import { Aws4GroupHandler } from './group.ts';
import { Aws4GroupCenterHandler } from './group-center.ts';
import { Aws4ProductIconHandler } from './product-icon.ts';
import { Aws4ResourceIconHandler } from './resource-icon.ts';
import { Aws4Group2Handler } from './group2.ts';

export function registerAws4Handlers(registry: ShapeRegistry): void {
  registry.register('mxgraph.aws4.group', Aws4GroupHandler);
  registry.register('mxgraph.aws4.groupCenter', Aws4GroupCenterHandler);
  registry.register('mxgraph.aws4.productIcon', Aws4ProductIconHandler);
  registry.register('mxgraph.aws4.resourceIcon', Aws4ResourceIconHandler);
  registry.register('mxgraph.aws4.group2', Aws4Group2Handler);
}
