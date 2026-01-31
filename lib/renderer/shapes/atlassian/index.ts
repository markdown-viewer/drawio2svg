import type { ShapeRegistry } from '../../shape-registry.ts';
import { AtlassianIssueHandler } from './issue.ts';

export function registerAtlassianHandlers(registry: ShapeRegistry): void {
  registry.register('mxgraph.atlassian.issue', AtlassianIssueHandler);
}