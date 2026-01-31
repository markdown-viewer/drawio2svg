import type { ShapeRegistry } from '../../shape-registry.ts';
import { EipDeadLetterChannelHandler } from './dead-letter-channel.ts';
import { EipMessageChannelHandler } from './message-channel.ts';
import { EipAnchorHandler } from './anchor.ts';
import { EipDataChannelHandler } from './data-channel.ts';
import { EipInvalidMessageChannelHandler } from './invalid-message-channel.ts';
import { EipMessExpHandler } from './mess-exp.ts';
import { EipRetAddrHandler } from './ret-addr.ts';

export function registerEipHandlers(registry: ShapeRegistry): void {
  registry.register('mxgraph.eip.messageChannel', EipMessageChannelHandler);
  registry.register('mxgraph.eip.deadLetterChannel', EipDeadLetterChannelHandler);
  registry.register('mxgraph.eip.anchor', EipAnchorHandler);
  registry.register('mxgraph.eip.dataChannel', EipDataChannelHandler);
  registry.register('mxgraph.eip.invalidMessageChannel', EipInvalidMessageChannelHandler);
  registry.register('mxgraph.eip.messExp', EipMessExpHandler);
  registry.register('mxgraph.eip.retAddr', EipRetAddrHandler);
}
