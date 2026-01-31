import type { ShapeRegistry } from '../../shape-registry.ts';
import { RackGeneralContainerHandler } from './container.ts';
import { RackGeneralHorCableDuctHandler } from './hor-cable-duct.ts';
import { RackGeneralNeatPatchHandler } from './neat-patch.ts';

export function registerRackGeneralHandlers(registry: ShapeRegistry): void {
  registry.register('mxgraph.rackGeneral.container', RackGeneralContainerHandler);
  registry.register('mxgraph.rackGeneral.horCableDuct', RackGeneralHorCableDuctHandler);
  registry.register('mxgraph.rackGeneral.neatPatch', RackGeneralNeatPatchHandler);
}
