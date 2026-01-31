import type { ShapeRegistry } from '../../shape-registry.ts';
import { CabinetsCabinetHandler } from './cabinet.ts';
import { CabinetsCoverPlateHandler } from './cover-plate.ts';
import { CabinetsDimensionHandler } from './dimension.ts';
import { CabinetsDimensionBottomHandler } from './dimension-bottom.ts';

export const registerCabinetsHandlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.cabinets.cabinet', CabinetsCabinetHandler);
  registry.register('mxgraph.cabinets.coverPlate', CabinetsCoverPlateHandler);
  registry.register('mxgraph.cabinets.dimension', CabinetsDimensionHandler);
  registry.register('mxgraph.cabinets.dimensionBottom', CabinetsDimensionBottomHandler);
};
