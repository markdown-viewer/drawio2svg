import type { ShapeRegistry } from '../../shape-registry.ts';
import { Pid2miscColumnHandler } from './column.ts';
import { Pid2miscConveyorHandler } from './conveyor.ts';
import { Pid2miscFanHandler } from './fan.ts';

export function registerPid2MiscHandlers(registry: ShapeRegistry): void {
  registry.register('mxgraph.pid2misc.column', Pid2miscColumnHandler);
  registry.register('mxgraph.pid2misc.conveyor', Pid2miscConveyorHandler);
  registry.register('mxgraph.pid2misc.fan', Pid2miscFanHandler);
}
