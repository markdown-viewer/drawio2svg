import type { ShapeRegistry } from '../../shape-registry.ts';
import { Pid2instCompFuncHandler } from './comp-func.ts';
import { Pid2instDiscInstHandler } from './disc-inst.ts';
import { Pid2instIndicatorHandler } from './indicator.ts';
import { Pid2instLogicHandler } from './logic.ts';
import { Pid2instProgLogContHandler } from './prog-log-cont.ts';
import { Pid2instSharedContHandler } from './shared-cont.ts';

export const registerPid2instHandlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.pid2inst.compFunc', Pid2instCompFuncHandler);
  registry.register('mxgraph.pid2inst.discInst', Pid2instDiscInstHandler);
  registry.register('mxgraph.pid2inst.indicator', Pid2instIndicatorHandler);
  registry.register('mxgraph.pid2inst.logic', Pid2instLogicHandler);
  registry.register('mxgraph.pid2inst.progLogCont', Pid2instProgLogContHandler);
  registry.register('mxgraph.pid2inst.sharedCont', Pid2instSharedContHandler);
};
