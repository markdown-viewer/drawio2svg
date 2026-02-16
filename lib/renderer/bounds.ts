import type { MxStyle } from '../parser.ts';
import { measureTextBoundsAtPosition } from './text/bounds.ts';
import { measureMultilineText, measureTextLayout, DEFAULT_FONT_FAMILY } from '@markdown-viewer/text-measure';

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function initBounds(): Bounds {
  return { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
}

export function updateBounds(bounds: Bounds, x: number, y: number): void {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return;
  }
  bounds.minX = Math.min(bounds.minX, x);
  bounds.minY = Math.min(bounds.minY, y);
  bounds.maxX = Math.max(bounds.maxX, x);
  bounds.maxY = Math.max(bounds.maxY, y);
}

export function finalizeBounds(bounds: Bounds): Bounds {
  if (bounds.minX === Infinity) {
    return { minX: 0, minY: 0, maxX: 100, maxY: 100 };
  }
  return {
    minX: bounds.minX,
    minY: bounds.minY,
    maxX: bounds.maxX,
    maxY: bounds.maxY
  };
}

export function extendBoundsForShadow(
  bounds: Bounds,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeWidth: number
): void {
  // Shadow offset is typically 4-5px to the right and bottom
  const strokePad = Math.max(0, strokeWidth) / 2;
  updateBounds(bounds, x - 4 - strokePad, y - 4);
  updateBounds(bounds, x + width + 6 + strokePad, y + height + 8);
}

/**
 * Extend bounds for internal labels that overflow the shape bounds.
 * This matches the platform's mxText.boundingBox behavior where text bounds
 * are included in graphBounds even when the text is centered inside a shape.
 */
export function extendBoundsForInternalLabelOverflow(
  bounds: Bounds,
  style: MxStyle,
  x: number,
  y: number,
  width: number,
  height: number,
  labelValue: string
): void {
  if (!labelValue) return;

  // Skip vertical labels (horizontal=0) since text is rotated
  const horizontal = style.horizontal as string | number | undefined;
  if (horizontal === '0' || horizontal === 0) return;

  // Skip if label is positioned externally
  const labelPosition = style.labelPosition as string | undefined;
  const verticalLabelPosition = style.verticalLabelPosition as string | undefined;
  if (labelPosition === 'left' || labelPosition === 'right') return;
  if (verticalLabelPosition === 'top' || verticalLabelPosition === 'bottom') return;

  // Only process centered internal labels
  const fontSize = parseFloat(style.fontSize as string) || 12;
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const fontStyleRaw = parseInt(style.fontStyle as string) || 0;
  const fontWeight = (fontStyleRaw & 1) !== 0 ? 'bold' : 'normal';
  const fontStyle = (fontStyleRaw & 2) !== 0 ? 'italic' : 'normal';
  
  const decodedLabelValue = (labelValue || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

  const isHtml = style.html === '1' || style.html === true;
  const whiteSpace = style.whiteSpace as string | undefined;
  const overflow = style.overflow as string | undefined;
  
  // If overflow is hidden, text is clipped to shape bounds
  if (overflow === 'hidden' || overflow === 'fill') return;

  // When wrap is enabled, measure with container width to get actual wrapped dimensions
  // Otherwise measure without wrapping
  let labelWidth: number;
  let labelHeight: number;
  
  if (whiteSpace === 'wrap' && overflow !== 'visible') {
    // Measure text with wrapping at container width
    const layoutResult = measureTextLayout(
      decodedLabelValue,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      width, // container width for wrapping
      isHtml
    );
    labelWidth = layoutResult.width;
    labelHeight = layoutResult.height;
  } else {
    // Measure without wrapping
    const result = measureMultilineText(
      decodedLabelValue,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      1.2,
      isHtml
    );
    labelWidth = result.width;
    labelHeight = result.height;
  }

  // Extend horizontal bounds if label width exceeds shape width
  if (labelWidth > width) {
    const align = (style.align as string | undefined) || 'center';
    const shapeCenterX = x + width / 2;
    
    let labelLeft: number;
    let labelRight: number;
    
    if (align === 'left') {
      labelLeft = x;
      labelRight = x + labelWidth;
    } else if (align === 'right') {
      labelLeft = x + width - labelWidth;
      labelRight = x + width;
    } else {
      // center alignment
      labelLeft = shapeCenterX - labelWidth / 2;
      labelRight = shapeCenterX + labelWidth / 2;
    }

    updateBounds(bounds, labelLeft, y);
    updateBounds(bounds, labelRight, y + height);
  }

  // Extend vertical bounds if label height exceeds shape height
  if (labelHeight > height) {
    const valign = (style.verticalAlign as string | undefined) || 'middle';

    if (valign === 'middle') {
      // Middle-aligned: text centered, may overflow both above and below
      const extra = (labelHeight - height) / 2;
      updateBounds(bounds, x, y - extra);
      updateBounds(bounds, x + width, y + height + extra);
    } else if (valign === 'top') {
      // Top-aligned: text starts at y + offset, may overflow below
      const textBottom = y + 7 + labelHeight;
      if (textBottom > y + height) {
        updateBounds(bounds, x + width, textBottom);
      }
    } else if (valign === 'bottom') {
      // Bottom-aligned: text ends near bottom, may overflow above
      const textTop = y + height - 3 - labelHeight;
      if (textTop < y) {
        updateBounds(bounds, x, textTop);
      }
    }
  }
}

export function extendBoundsForExternalLabels(
  bounds: Bounds,
  style: MxStyle,
  shapeType: string | undefined,
  x: number,
  y: number,
  width: number,
  height: number,
  hasLabel: boolean,
  labelValue: string
): void {
  if (!hasLabel) {
    return;
  }
  const verticalLabelPosition = (style.verticalLabelPosition as string | undefined) ??
    (shapeType === 'image' ? 'bottom' : undefined);

  const fontSize = parseFloat(style.fontSize as string) || 12;
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const fontStyleRaw = parseInt(style.fontStyle as string) || 0;
  const fontWeight = (fontStyleRaw & 1) !== 0 ? 'bold' : 'normal';
  const fontStyle = (fontStyleRaw & 2) !== 0 ? 'italic' : 'normal';
  const decodedLabelValue = (labelValue || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

  // Pass label value directly - DOM will render HTML correctly
  const isHtml = style.html === '1' || style.html === true;
  const { width: labelWidth, height: labelHeight } = measureMultilineText(
    decodedLabelValue,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    1.2,
    isHtml
  );
  const whiteSpaceWrap = style.whiteSpace === 'wrap';
  const labelPosition = style.labelPosition as string | undefined;
  const hasHorizontalExternal = labelPosition === 'left' || labelPosition === 'right';
  const hasVerticalExternal = verticalLabelPosition === 'top' || verticalLabelPosition === 'bottom';
  const needsFixedWidthPad = whiteSpaceWrap && hasHorizontalExternal && (verticalLabelPosition === 'top' || verticalLabelPosition === 'bottom');
  let labelWidthForBounds = labelWidth;
  if (needsFixedWidthPad) {
    labelWidthForBounds = width + 2;
  }
  const maxLineWidth = Math.max(1, width - 2);

  // Use precise DOM measurement for wrapped text height
  let effectiveLabelHeight: number;
  if (whiteSpaceWrap && labelWidth > maxLineWidth + 1) {
    const wrappedLayout = measureTextLayout(
      decodedLabelValue,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      maxLineWidth,
      isHtml
    );
    effectiveLabelHeight = wrappedLayout.height;
  } else {
    effectiveLabelHeight = labelHeight;
  }

  if (hasVerticalExternal) {
    const align = (style.align as string | undefined) || 'center';
    const expandHorizontally = labelPosition === 'left' || labelPosition === 'right';
    const rawLabelBackgroundColor = (style.labelBackgroundColor as string) || '';
    const hasLabelBackground = rawLabelBackgroundColor !== '' && rawLabelBackgroundColor !== 'none';
    const shouldExpandLabelWidth = labelWidth > width && (hasLabelBackground || shapeType === 'umlActor');
    let labelLeft = x + width / 2 - labelWidthForBounds / 2;
    if (align === 'left') labelLeft = x;
    else if (align === 'right') labelLeft = x + width - labelWidthForBounds;
    const labelRight = labelLeft + labelWidthForBounds;
    const spacingTop = parseFloat(style.spacingTop as string) || 0;
    const spacingBottom = parseFloat(style.spacingBottom as string) || 0;
    let labelY = verticalLabelPosition === 'bottom'
      ? y + height + 7 + effectiveLabelHeight
      : y - 3 - effectiveLabelHeight + 1;
    if (hasHorizontalExternal) {
      if (verticalLabelPosition === 'bottom') {
        labelY += spacingTop;
      } else {
        labelY -= spacingBottom;
      }
    }
    if (expandHorizontally || shouldExpandLabelWidth) {
      updateBounds(bounds, labelLeft, labelY);
      updateBounds(bounds, labelRight, labelY);
    } else {
      updateBounds(bounds, x + width / 2, labelY);
    }
  }

  if (shapeType === 'image' && (verticalLabelPosition === 'top' || verticalLabelPosition === 'bottom')) {
    const align = (style.align as string | undefined) || 'center';
    let labelLeft = x + width / 2 - labelWidth / 2;
    if (align === 'left') labelLeft = x;
    else if (align === 'right') labelLeft = x + width - labelWidth;
    const labelRight = labelLeft + labelWidth;
    if (labelWidth > width) {
      updateBounds(bounds, labelLeft, y);
      updateBounds(bounds, labelRight, y);
    }
  }

  const isHorizontal = style.horizontal !== 0 && style.horizontal !== '0' && style.horizontal !== false;
  const labelWidthForPadding = isHorizontal ? labelWidthForBounds : labelHeight * 2;
  const leftPadAdjust = isHorizontal ? 2 : 1;
  const rightPadAdjust = isHorizontal ? 3 : 2;
  let leftPadding = Math.round(labelWidthForPadding) + leftPadAdjust;
  let rightPadding = Math.round(labelWidthForPadding) + rightPadAdjust;
  const spacingLeft = parseFloat(style.spacingLeft as string) || 0;
  const spacingRight = parseFloat(style.spacingRight as string) || 0;

  if (hasVerticalExternal) {
    if (verticalLabelPosition === 'top') {
      leftPadding = Math.max(0, Math.round(labelHeight - 4)) + 1;
      rightPadding = Math.round(labelHeight + 4);
    } else if (verticalLabelPosition === 'bottom') {
      const pad = Math.round(effectiveLabelHeight + fontSize + 2);
      leftPadding = pad;
      rightPadding = pad;
    }

    const paddingAdjust = 3;
    leftPadding = Math.max(0, leftPadding - paddingAdjust);
    rightPadding = Math.max(0, rightPadding - paddingAdjust);
  }

  // Restore original labelPosition bounds update
  if (style.labelPosition === 'left') {
    const spacingRightPad = needsFixedWidthPad ? Math.max(0, spacingRight) : spacingRight;
    const extraPad = needsFixedWidthPad && spacingRight < 0 ? 4 : 0;
    // Use +1 instead of +2 to better match draw.io's bounds calculation
    const widthPad = Math.round(labelWidth) + 1 + spacingRightPad + extraPad;
    const pad = needsFixedWidthPad
      ? Math.max(0, widthPad)
      : Math.max(0, leftPadding + spacingRight);
    updateBounds(bounds, x - pad, y);
  } else if (style.labelPosition === 'right') {
    const spacingLeftPad = needsFixedWidthPad ? Math.max(0, spacingLeft) : spacingLeft;
    const extraPad = needsFixedWidthPad && spacingLeft < 0 ? 4 : 0;
    // Use +1 instead of +2 to better match draw.io's bounds calculation
    const widthPad = Math.round(labelWidth) + 1 + spacingLeftPad + extraPad;
    const pad = needsFixedWidthPad
      ? Math.max(0, widthPad)
      : Math.max(0, rightPadding + spacingLeft);
    updateBounds(bounds, x + width + pad, y);
  }
}

export function updateBoundsForEdge(
  bounds: Bounds,
  boundPoints: { x: number; y: number }[],
  style: MxStyle
): void {
  let edgeMinX = Infinity, edgeMinY = Infinity;
  let edgeMaxX = -Infinity, edgeMaxY = -Infinity;

  const isCurved = style.curved === '1' || style.curved === true;
  if (isCurved && boundPoints.length >= 2) {
    const evalQuad = (p0: number, p1: number, p2: number, t: number): number => {
      const t2 = t * t;
      const mt = 1 - t;
      const mt2 = mt * mt;
      return mt2 * p0 + 2 * mt * t * p1 + t2 * p2;
    };

    const updateQuadBounds = (
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number }
    ): void => {
      const xs: number[] = [p0.x, p2.x];
      const ys: number[] = [p0.y, p2.y];

      const denomX = p0.x - 2 * p1.x + p2.x;
      if (denomX !== 0) {
        const tx = (p0.x - p1.x) / denomX;
        if (tx > 0 && tx < 1) {
          xs.push(evalQuad(p0.x, p1.x, p2.x, tx));
        }
      }

      const denomY = p0.y - 2 * p1.y + p2.y;
      if (denomY !== 0) {
        const ty = (p0.y - p1.y) / denomY;
        if (ty > 0 && ty < 1) {
          ys.push(evalQuad(p0.y, p1.y, p2.y, ty));
        }
      }

      edgeMinX = Math.min(edgeMinX, ...xs);
      edgeMaxX = Math.max(edgeMaxX, ...xs);
      edgeMinY = Math.min(edgeMinY, ...ys);
      edgeMaxY = Math.max(edgeMaxY, ...ys);
    };

    if (boundPoints.length === 2) {
      updateQuadBounds(boundPoints[0], boundPoints[0], boundPoints[1]);
    } else if (boundPoints.length === 3) {
      updateQuadBounds(boundPoints[0], boundPoints[1], boundPoints[2]);
    } else {
      let current = boundPoints[0];
      for (let i = 1; i < boundPoints.length - 1; i++) {
        const control = boundPoints[i];
        const next = boundPoints[i + 1];
        const mid = { x: (control.x + next.x) / 2, y: (control.y + next.y) / 2 };
        updateQuadBounds(current, control, mid);
        current = mid;
      }
      updateQuadBounds(current, boundPoints[boundPoints.length - 2], boundPoints[boundPoints.length - 1]);
    }
  } else {
    for (const pt of boundPoints) {
      edgeMinX = Math.min(edgeMinX, pt.x);
      edgeMinY = Math.min(edgeMinY, pt.y);
      edgeMaxX = Math.max(edgeMaxX, pt.x);
      edgeMaxY = Math.max(edgeMaxY, pt.y);
    }
  }

  const DEFAULT_MARKERSIZE = 6;
  const isCurvedForMargin = isCurved;
  const hasOnlyEndpoints = boundPoints.length <= 2;
  const hasStartArrow = style.startArrow && style.startArrow !== 'none';
  const hasEndArrow = style.endArrow !== undefined ? (style.endArrow !== 'none') : true;
  const arrowCount = (hasStartArrow ? 1 : 0) + (hasEndArrow ? 1 : 0);

  const strokeWidth = parseFloat(style.strokeWidth as string) || 1;

  // mxArrow-based edge shapes: use mxArrow.augmentBoundingBox grow
  // grow = strokeWidth/2 (mxShape) + (max(arrowWidth=30, endSize=30)/2 + strokeWidth) (mxArrow)
  const MXARROW_EDGE_SHAPES = new Set([
    'mxgraph.lean_mapping.electronic_info_flow_edge',
    'mxgraph.lean_mapping.manual_info_flow_edge',
    'mxgraph.networks.comm_link_edge'
  ]);
  const shapeName = style.shape as string | undefined;
  if (shapeName && MXARROW_EDGE_SHAPES.has(shapeName)) {
    const arrowWidth = 30; // mxConstants.ARROW_WIDTH default
    const endSize = 30;    // mxConstants.ARROW_SIZE default
    const mxArrowGrow = Math.max(arrowWidth, endSize) / 2 + strokeWidth;
    const mxShapeGrow = strokeWidth / 2;
    const totalGrow = mxShapeGrow + mxArrowGrow;
    if (edgeMinX !== Infinity) {
      // draw.io's updateBoundsFromPoints creates each point as mxRectangle(x, y, scale, scale)
      // where scale=1, so maxX = max(pts.x) + 1, maxY = max(pts.y) + 1
      updateBounds(bounds, edgeMinX - totalGrow, edgeMinY - totalGrow);
      updateBounds(bounds, edgeMaxX + 1 + totalGrow, edgeMaxY + 1 + totalGrow);
    }
    return;
  }

  const isOpenArrow = (arrow: unknown): boolean => {
    const value = typeof arrow === 'string' ? arrow : '';
    return value === 'open' || value === 'openThin' || value === 'openFilled';
  };
  const hasOpenArrow = isOpenArrow(style.startArrow) || isOpenArrow(style.endArrow);
  let markerSize = 0;
  if (hasStartArrow) markerSize = Math.max(markerSize, parseFloat(style.startSize as string) || DEFAULT_MARKERSIZE);
  if (hasEndArrow) markerSize = Math.max(markerSize, parseFloat(style.endSize as string) || DEFAULT_MARKERSIZE);
  const arrowMargin = strokeWidth / 2 + (markerSize > 0 ? markerSize + 2 + (arrowCount === 2 ? 1 : 0) : 0);
  const edgeShift = arrowCount === 1 ? 1 : 0;
  const useArrowMargin = !(isCurvedForMargin && (hasOnlyEndpoints || hasOpenArrow));
  let marginX = useArrowMargin ? arrowMargin : 0;
  let marginY = useArrowMargin ? arrowMargin : 0;
  let shiftX = useArrowMargin ? edgeShift : 0;
  let shiftY = useArrowMargin ? edgeShift : 0;

  if (!useArrowMargin) {
    const curvedMarginY = Math.ceil(strokeWidth / 2 + (markerSize > 0 ? markerSize / 2 : 0));
    marginY = curvedMarginY;
  }

  if (edgeMinX !== Infinity) {
    updateBounds(bounds, edgeMinX - marginX + shiftX, edgeMinY - marginY + shiftY);
    updateBounds(bounds, edgeMaxX + marginX + shiftX, edgeMaxY + marginY + shiftY);
  }
}

export function updateBoundsForRotatedRect(
  bounds: Bounds,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number,
  strokeMargin: number
): void {
  if (rotation !== 0) {
    const expandedX = x - strokeMargin;
    const expandedY = y - strokeMargin;
    const expandedW = width + strokeMargin * 2;
    const expandedH = height + strokeMargin * 2;
    const cx = expandedX + expandedW / 2;
    const cy = expandedY + expandedH / 2;
    const rad = rotation * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const corners = [
      [expandedX, expandedY],
      [expandedX + expandedW, expandedY],
      [expandedX + expandedW, expandedY + expandedH],
      [expandedX, expandedY + expandedH]
    ];
    for (const [px, py] of corners) {
      const dx = px - cx;
      const dy = py - cy;
      updateBounds(bounds, cx + dx * cos - dy * sin, cy + dx * sin + dy * cos);
    }
  } else {
    updateBounds(bounds, x - strokeMargin, y - strokeMargin);
    updateBounds(bounds, x + width + strokeMargin, y + height + strokeMargin);
  }
}

export function updateBoundsForCenterHtmlLabel(
  bounds: Bounds,
  value: string,
  style: MxStyle,
  x: number,
  y: number,
  defaultFontSize: number
): void {
  const labelX = Math.round(x);
  const labelY = Math.round(y);
  const textBounds = measureTextBoundsAtPosition(value, style, labelX, labelY, defaultFontSize);
  updateBounds(bounds, textBounds.minX, textBounds.minY);
  updateBounds(bounds, textBounds.maxX, textBounds.maxY);
}

export function updateBoundsForOverflowHiddenText(
  bounds: Bounds,
  x: number,
  y: number,
  height: number,
  style: MxStyle
): void {
  // Text bounds extend 3 pixels beyond shape bounds in height
  // text.y = shape.y + 7, text.height = shape.height - 4
  // So text.maxY = shape.y + shape.height + 3
  const htmlLabel = (style.html as string | undefined) === '1';
  const spacingTop = parseFloat(style.spacingTop as string) || 0;
  const applyHtmlPadding = !htmlLabel || spacingTop >= 0;
  const textMaxY = y + height + (applyHtmlPadding ? 3 : 0);
  updateBounds(bounds, x, textMaxY);
  if (spacingTop >= 0) {
    return;
  }

  const spacing = parseFloat(style.spacing as string) || 0;
  const isTextShape = style.text === true || style.text === '1' || style.shape === 'text';
  const whiteSpaceWrap = style.whiteSpace === 'wrap';
  const valign = (style.verticalAlign as string) || (isTextShape ? 'top' : 'middle');

  if (valign !== 'top') {
    return;
  }

  let textTop = y;
  if (whiteSpaceWrap) {
    const baseOffset = isTextShape && style.overflow === 'hidden' && spacing > 0 ? 5 : 7;
    textTop = y + spacing + spacingTop + baseOffset;
  } else {
    const fontSize = parseFloat(style.fontSize as string) || 12;
    textTop = y + spacing + spacingTop + fontSize / 2 + 1;
  }

  if (textTop < y) {
    updateBounds(bounds, x, textTop);
  }
}
