import type { ShapeRegistry } from '../../shape-registry.ts';
import { ArchimateApplicationHandler } from './application.ts';
import { ArchimateBusinessHandler } from './business.ts';
import { ArchimateBusinessObjectHandler } from './business-object.ts';
import { ArchimateGapHandler } from './gap.ts';
import { ArchimateLocationHandler } from './location.ts';
import { ArchimateMotivHandler } from './motiv.ts';
import { ArchimateProductHandler } from './product.ts';
import { ArchimateRepresentationHandler } from './representation.ts';
import { ArchimateTechHandler } from './tech.ts';

export const registerArchimateHandlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.archimate.application', ArchimateApplicationHandler);
  registry.register('mxgraph.archimate.business', ArchimateBusinessHandler);
  registry.register('mxgraph.archimate.businessObject', ArchimateBusinessObjectHandler);
  registry.register('mxgraph.archimate.gap', ArchimateGapHandler);
  registry.register('mxgraph.archimate.location', ArchimateLocationHandler);
  registry.register('mxgraph.archimate.motiv', ArchimateMotivHandler);
  registry.register('mxgraph.archimate.product', ArchimateProductHandler);
  registry.register('mxgraph.archimate.representation', ArchimateRepresentationHandler);
  registry.register('mxgraph.archimate.tech', ArchimateTechHandler);
};
