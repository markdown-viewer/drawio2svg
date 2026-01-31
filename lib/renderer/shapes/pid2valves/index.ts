import type { ShapeRegistry } from '../../shape-registry.ts';
import { Pid2valvesValveHandler } from './valve.ts';
import { Pid2valvesAutoRecircValveHandler } from './auto-recirc-valve.ts';
import { Pid2valvesBlockBleedValveHandler } from './block-bleed-valve.ts';

export function registerPid2ValvesHandlers(registry: ShapeRegistry): void {
  registry.register('mxgraph.pid2valves.valve', Pid2valvesValveHandler);
  registry.register('mxgraph.pid2valves.autoRecircValve', Pid2valvesAutoRecircValveHandler);
  registry.register('mxgraph.pid2valves.blockBleedValve', Pid2valvesBlockBleedValveHandler);
}
