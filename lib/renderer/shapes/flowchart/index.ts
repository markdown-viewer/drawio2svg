import type { ShapeRegistry } from '../../shape-registry.ts';
import { CardHandler } from './card.ts';
import { FlowchartDecisionHandler } from './decision.ts';
import { DelayHandler } from './delay.ts';
import { DocumentHandler } from './document.ts';
import { ManualInputHandler } from './manual-input.ts';
import { ProcessHandler } from './process.ts';
import { StepHandler } from './step.ts';
import { TapeHandler } from './tape.ts';
import { FlowchartDocument2Handler } from './document2.ts';
import { EllipseHandler } from '../core/ellipse.ts';

export function registerFlowchartHandlers(registry: ShapeRegistry): void {
  registry.register('card', CardHandler);
  registry.register('mxgraph.flowchart.decision', FlowchartDecisionHandler);
  registry.register('mxgraph.flowchart.on-page_reference', EllipseHandler);
  registry.register('delay', DelayHandler);
  registry.register('document', DocumentHandler);
  registry.register('manualInput', ManualInputHandler);
  registry.register('process', ProcessHandler);
  registry.register('step', StepHandler);
  registry.register('tape', TapeHandler);
  registry.register('mxgraph.flowchart.document2', FlowchartDocument2Handler);
}
