import type { ShapeRegistry } from '../../shape-registry.ts';
import { ErAnchorHandler } from './anchor.ts';
import { ErAttributeHandler } from './attribute.ts';
import { ErChensHandler } from './chens.ts';
import { ErCloudHandler } from './cloud.ts';
import { ErEntityHandler } from './entity.ts';
import { ErHasHandler } from './has.ts';
import { ErHierarchyHandler } from './hierarchy.ts';
import { ErIeHandler } from './ie.ts';
import { ErNoteHandler } from './note.ts';
import { ErRrectHandler } from './rrect.ts';
import { ErBachmansHandler } from './bachmans.ts';
import { ErEntityExtHandler } from './entity-ext.ts';

export const registerErHandlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.er.anchor', ErAnchorHandler);
  registry.register('mxgraph.er.attribute', ErAttributeHandler);
  registry.register('mxgraph.er.chens', ErChensHandler);
  registry.register('mxgraph.er.cloud', ErCloudHandler);
  registry.register('mxgraph.er.entity', ErEntityHandler);
  registry.register('mxgraph.er.has', ErHasHandler);
  registry.register('mxgraph.er.hierarchy', ErHierarchyHandler);
  registry.register('mxgraph.er.ie', ErIeHandler);
  registry.register('mxgraph.er.note', ErNoteHandler);
  registry.register('mxgraph.er.rrect', ErRrectHandler);
  registry.register('mxgraph.er.bachmans', ErBachmansHandler);
  registry.register('mxgraph.er.entityExt', ErEntityExtHandler);
};
