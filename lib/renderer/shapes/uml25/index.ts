import type { ShapeRegistry } from '../../shape-registry.ts';
import { Uml25ActionHandler } from './action.ts';
import { Uml25ActionParamsHandler } from './action-params.ts';
import { Uml25BehaviorActionHandler } from './behavior-action.ts';
import { Uml25InputPinHandler } from './input-pin.ts';

export const registerUml25Handlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.uml25.action', Uml25ActionHandler);
  registry.register('mxgraph.uml25.actionParams', Uml25ActionParamsHandler);
  registry.register('mxgraph.uml25.behaviorAction', Uml25BehaviorActionHandler);
  registry.register('mxgraph.uml25.inputPin', Uml25InputPinHandler);
};
