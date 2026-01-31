import type { ShapeRegistry } from '../../shape-registry.ts';
import { DfdArchiveHandler } from './archive.ts';
import { DfdCheck2Handler } from './check2.ts';
import { DfdDataStoreIDHandler } from './data-store-id.ts';
import { DfdExternalEntityHandler } from './external-entity.ts';
import { DfdLoopHandler } from './loop.ts';
import { DfdStartHandler } from './start.ts';

export const registerDfdHandlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.dfd.archive', DfdArchiveHandler);
  registry.register('mxgraph.dfd.check2', DfdCheck2Handler);
  registry.register('mxgraph.dfd.dataStoreID', DfdDataStoreIDHandler);
  registry.register('mxgraph.dfd.externalEntity', DfdExternalEntityHandler);
  registry.register('mxgraph.dfd.loop', DfdLoopHandler);
  registry.register('mxgraph.dfd.start', DfdStartHandler);
};
