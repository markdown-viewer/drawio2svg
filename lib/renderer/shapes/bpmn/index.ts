import type { ShapeRegistry } from '../../shape-registry.ts';
import { BpmnShapeHandler } from './shape.ts';
import { BpmnTaskHandler } from './task.ts';
import { BpmnConversationHandler } from './conversation.ts';
import { BpmnConversation2Handler } from './conversation2.ts';
import { BpmnSendMarkerHandler } from './send-marker.ts';
import { BpmnSwimlaneHandler } from './swimlane.ts';
import { BpmnDataHandler, BpmnData2Handler } from './data.ts';
import { BpmnTask2Handler } from './task2.ts';

export function registerBpmnHandlers(registry: ShapeRegistry): void {
  registry.register('mxgraph.bpmn.shape', BpmnShapeHandler);
  registry.register('mxgraph.bpmn.event', BpmnShapeHandler);
  registry.register('mxgraph.bpmn.gateway2', BpmnShapeHandler);
  registry.register('mxgraph.bpmn.task', BpmnTaskHandler);
  registry.register('mxgraph.bpmn.task2', BpmnTask2Handler);
  registry.register('mxgraph.bpmn.data', BpmnDataHandler);
  registry.register('mxgraph.bpmn.data2', BpmnData2Handler);
  registry.register('mxgraph.bpmn.conversation', BpmnConversationHandler);
  registry.register('mxgraph.bpmn.conversation2', BpmnConversation2Handler);
  registry.register('mxgraph.bpmn.sendMarker', BpmnSendMarkerHandler);
  registry.register('mxgraph.bpmn.swimlane', BpmnSwimlaneHandler);
}
