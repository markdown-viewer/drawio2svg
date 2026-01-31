import type { MxStyle } from '../../parser.ts';

export interface EdgeArrowConfig {
  startArrow: string | undefined;
  endArrow: string | undefined;
  startFill: boolean;
  endFill: boolean;
  startSize: number;
  endSize: number;
  sourceBuffer: number;
  targetBuffer: number;
}

export function getEdgeArrowConfig(style: MxStyle): EdgeArrowConfig {
  const shapeName = style.shape as string | undefined;
  const isLeanMappingInfoFlow = shapeName === 'mxgraph.lean_mapping.electronic_info_flow_edge';
  const isLeanMappingManualFlow = shapeName === 'mxgraph.lean_mapping.manual_info_flow_edge';
  const isLinkEdge = shapeName === 'link';
  const startArrow = style.startArrow as string | undefined;
  let endArrow = style.endArrow !== undefined ? (style.endArrow as string) : 'classic';
  if (isLinkEdge) {
    endArrow = 'none';
  }
  if (isLeanMappingInfoFlow || isLeanMappingManualFlow) {
    endArrow = 'openFilled';
  }
  const startFill = style.startFill !== 0 && style.startFill !== '0' && style.startFill !== false;
  const endFill = isLeanMappingInfoFlow || isLeanMappingManualFlow || (style.endFill !== 0 && style.endFill !== '0' && style.endFill !== false);
  const startSize = parseFloat(style.startSize as string) || 6;
  let endSize = parseFloat(style.endSize as string) || 6;
  if (isLeanMappingInfoFlow) {
    endSize = 8;
  }
  if (isLeanMappingManualFlow) {
    endSize = 8;
  }

  const orthBufferSize = 10;
  const getJettySize = (isSource: boolean): number => {
    const raw = (isSource ? style.sourceJettySize : style.targetJettySize) ?? style.jettySize;
    if (raw === 'auto') {
      const arrowType = isSource ? startArrow : endArrow;
      if (arrowType && arrowType !== 'none') {
        const size = isSource ? startSize : endSize;
        return Math.max(2, Math.ceil((size + orthBufferSize) / orthBufferSize)) * orthBufferSize;
      }
      return 2 * orthBufferSize;
    }
    const parsed = parseFloat(raw as string);
    return Number.isFinite(parsed) ? parsed : orthBufferSize;
  };

  const sourceBuffer = getJettySize(true);
  const targetBuffer = getJettySize(false);

  return {
    startArrow,
    endArrow,
    startFill,
    endFill,
    startSize,
    endSize,
    sourceBuffer,
    targetBuffer,
  };
}
