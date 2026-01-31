import type { MxStyle } from '../../parser.ts';

export interface EdgeStyleConfig {
  strokeColor: string;
  strokeWidth: number;
  dashed: boolean;
  dashPattern?: string;
  curved: boolean;
  edgeRounded: boolean;
  shapeName?: string;
  isCommLinkEdge: boolean;
  fillColor: string;
}


export function getEdgeStyleConfig(
  style: MxStyle,
  normalizeColor: (value: string) => string
): EdgeStyleConfig {
  const rawStrokeColor = style.strokeColor as string | undefined;
  const resolvedStrokeColor = (rawStrokeColor === 'default' || rawStrokeColor === 'inherit')
    ? '#000000'
    : (rawStrokeColor || '#000000');
  const strokeColor = normalizeColor(resolvedStrokeColor);
  const strokeWidth = parseFloat(style.strokeWidth as string) || 1;
  const dashed = style.dashed === '1' || style.dashed === true;
  const dashPattern = style.dashPattern as string | undefined;
  const curved = style.curved === '1' || style.curved === true;
  const edgeRounded = style.rounded !== 0 && style.rounded !== '0' && style.rounded !== false;
  const shapeName = style.shape as string | undefined;
  const isCommLinkEdge = shapeName === 'mxgraph.networks.comm_link_edge';
  const fillColor = normalizeColor((style.fillColor as string) || 'none');

  return {
    strokeColor,
    strokeWidth,
    dashed,
    dashPattern,
    curved,
    edgeRounded,
    shapeName,
    isCommLinkEdge,
    fillColor,
  };
}
