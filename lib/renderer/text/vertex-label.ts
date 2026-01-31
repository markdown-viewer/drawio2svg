import type { MxCell, MxStyle } from '../../parser.ts';
import type { LabelOverrides } from '../shape-registry.ts';

export interface VertexLabelContext {
  renderLabel: (value: string, x: number, y: number, width: number, height: number, style: MxStyle) => void;
  renderSwimlaneLabel: (
    value: string,
    x: number,
    y: number,
    width: number,
    height: number,
    startSize: number,
    horizontal: boolean,
    style: MxStyle
  ) => void;
}

export interface VertexLabelParams {
  cell: MxCell;
  shape?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: MxStyle;
  // Label overrides from shape handler (e.g., defaultStartSize for swimlane)
  labelOverrides?: LabelOverrides | null;
}

// Fallback default startSize when no handler provides one
// Matches the platform's default-style2 theme for swimlane
const FALLBACK_DEFAULT_START_SIZE = 23;

export function renderVertexLabel(ctx: VertexLabelContext, params: VertexLabelParams): void {
  const { cell, shape, x, y, width, height, style, labelOverrides } = params;

  if (!cell.value) return;

  if (shape === 'swimlane' || shape === 'table' || shape === 'tableRow' || shape === 'mxgraph.bpmn.swimlane') {
    const startSizeVal = parseFloat(style.startSize as string);
    // Use defaultStartSize from handler if provided, otherwise use fallback
    // This allows each shape handler to specify its own default (e.g., BPMN uses 40, regular swimlane uses 23)
    const defaultStartSize = labelOverrides?.defaultStartSize ?? FALLBACK_DEFAULT_START_SIZE;
    const startSize = isNaN(startSizeVal) ? defaultStartSize : startSizeVal;
    const horizontal = style.horizontal !== 0 && style.horizontal !== '0' && style.horizontal !== false;

    if (startSize > 0) {
      ctx.renderSwimlaneLabel(cell.value, x, y, width, height, startSize, horizontal, style);
    } else {
      ctx.renderLabel(cell.value, x, y, width, height, style);
    }
    return;
  }

  if (shape === 'umlLifeline') {
    const sizeVal = parseFloat(style.size as string);
    const size = isNaN(sizeVal) ? 40 : sizeVal;
    const labelHeight = Math.min(height, size);
    ctx.renderLabel(cell.value, x, y, width, labelHeight, style);
    return;
  }

  if (shape === 'umlFrame') {
    const corner = 10;
    const tabWidth = Math.min(width, Math.max(corner, parseFloat(style.width as string) || 60));
    const tabDepth = Math.min(height, Math.max(corner * 1.5, parseFloat(style.height as string) || 30));
    ctx.renderLabel(cell.value, x, y, tabWidth, tabDepth, style);
    return;
  }

  if (shape === 'label' && style.image) {
    const imageAlign = (style.imageAlign as string) || 'left';
    const imageValign = (style.imageVerticalAlign as string) || 'middle';
    const parsedImageWidth = parseFloat(style.imageWidth as string);
    const parsedImageHeight = parseFloat(style.imageHeight as string);
    const imageWidth = Number.isFinite(parsedImageWidth) ? parsedImageWidth : 42;
    const imageHeight = Number.isFinite(parsedImageHeight) ? parsedImageHeight : 42;
    const spacingRaw = parseFloat(style.spacing as string);
    const imageSpacing = Number.isFinite(spacingRaw) ? spacingRaw : 2;
    const totalSpacing = imageSpacing + 5;

    let labelX = x;
    let labelY = y;
    let labelWidth = width;
    let labelHeight = height;
    const imageSpace = imageWidth + totalSpacing + 5;

    if (imageAlign === 'left') {
      labelX = x + imageSpace;
      labelWidth = width - imageSpace;
    } else if (imageAlign === 'right') {
      labelWidth = width - imageSpace;
    }

    if (imageValign === 'top') {
      labelY = y + imageHeight + totalSpacing;
      labelHeight = height - imageHeight - totalSpacing;
    } else if (imageValign === 'bottom') {
      labelHeight = height - imageHeight - totalSpacing;
    }

    ctx.renderLabel(cell.value, labelX, labelY, labelWidth, labelHeight, style);
    return;
  }

  if (shape === 'image' && !style.verticalLabelPosition) {
    const imageStyle = { ...style, verticalLabelPosition: 'bottom' };
    ctx.renderLabel(cell.value, x, y, width, height, imageStyle);
    return;
  }

  ctx.renderLabel(cell.value, x, y, width, height, style);
}
