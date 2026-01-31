/**
 * Label bounds calculation
 *
 * This module replicates standard label positioning logic:
 * - getLabelBounds
 * - rotateLabelBounds
 * - updateVertexLabelOffset
 * - isPaintBoundsInverted
 * - getSpacing
 * - getAlignmentAsPoint
 */

// Use a minimal style type to avoid circular dependencies
type StyleValue = string | number | boolean | null | undefined;
interface StyleMap {
  [key: string]: StyleValue;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface LabelBoundsInput {
  // Cell geometry (state.x, state.y, state.width, state.height)
  cellX: number;
  cellY: number;
  cellWidth: number;
  cellHeight: number;

  // Style properties
  style: StyleMap;

  // Text properties
  align: string; // 'left' | 'center' | 'right'
  valign: string; // 'top' | 'middle' | 'bottom'
  spacingLeft: number;
  spacingRight: number;
  spacingTop: number;
  spacingBottom: number;

  // Whether this is an edge (vs vertex)
  isEdge?: boolean;

  // Shape's custom getLabelBounds function (optional)
  shapeLabelBounds?: (bounds: Rectangle) => Rectangle;

  // Scale (default 1)
  scale?: number;
}

/**
 * Get alignment as point for numeric computations.
 * X is -0.5 for center, -1 for right and 0 for left alignment.
 * Y is -0.5 for middle, -1 for bottom and 0 for top alignment.
 */
export function getAlignmentAsPoint(align: string, valign: string): Point {
  let dx = -0.5;
  let dy = -0.5;

  // Horizontal alignment
  if (align === 'left') {
    dx = 0;
  } else if (align === 'right') {
    dx = -1;
  }

  // Vertical alignment
  if (valign === 'top') {
    dy = 0;
  } else if (valign === 'bottom') {
    dy = -1;
  }

  return { x: dx, y: dy };
}

/**
 * Port of mxText.getSpacing
 * Returns the spacing offset based on alignment.
 */
export function getSpacing(
  align: string,
  valign: string,
  spacingLeft: number,
  spacingRight: number,
  spacingTop: number,
  spacingBottom: number,
  margin?: Point
): Point {
  let dx = 0;
  let dy = 0;

  // Horizontal spacing
  if ((margin != null && margin.x === -0.5) || (margin == null && align === 'center')) {
    dx = (spacingLeft - spacingRight) / 2;
  } else if ((margin != null && margin.x === -1) || (margin == null && align === 'right')) {
    dx = -spacingRight;
  } else {
    dx = spacingLeft;
  }

  // Vertical spacing
  if (valign === 'middle') {
    dy = (spacingTop - spacingBottom) / 2;
  } else if (valign === 'bottom') {
    dy = -spacingBottom;
  } else {
    dy = spacingTop;
  }

  return { x: dx, y: dy };
}

/**
 * Port of mxText.isPaintBoundsInverted
 * Returns true if bounds should be inverted (swapped width/height).
 * This happens when horizontal=false and the cell is a vertex.
 */
export function isPaintBoundsInverted(style: StyleMap, isVertex: boolean): boolean {
  const horizontal = style.horizontal;
  const isHorizontal = horizontal !== 0 && horizontal !== '0' && horizontal !== false;
  return !isHorizontal && isVertex;
}

/**
 * Port of mxGraphView.updateVertexLabelOffset
 * Calculates the absolute offset for vertex labels based on labelPosition styles.
 */
export function getVertexLabelOffset(
  style: StyleMap,
  cellWidth: number,
  cellHeight: number,
  scale: number = 1
): Point {
  const offset: Point = { x: 0, y: 0 };

  const labelPosition = (style.labelPosition as string) || 'center';
  const verticalLabelPosition = (style.verticalLabelPosition as string) || 'middle';
  const labelWidth = style.labelWidth != null ? parseFloat(String(style.labelWidth)) * scale : null;

  // Horizontal offset
  if (labelPosition === 'left') {
    if (labelWidth != null) {
      offset.x -= labelWidth;
    } else {
      offset.x -= cellWidth;
    }
  } else if (labelPosition === 'right') {
    offset.x += cellWidth;
  } else if (labelPosition === 'center' && labelWidth != null) {
    // Aligns text block with given width inside the vertex width
    const align = (style.align as string) || 'center';
    let dx = 0;

    if (align === 'center') {
      dx = 0.5;
    } else if (align === 'right') {
      dx = 1;
    }

    if (dx !== 0) {
      offset.x -= (labelWidth - cellWidth) * dx;
    }
  }

  // Vertical offset
  if (verticalLabelPosition === 'top') {
    offset.y -= cellHeight;
  } else if (verticalLabelPosition === 'bottom') {
    offset.y += cellHeight;
  }

  return offset;
}

/**
 * Port of mxCellRenderer.rotateLabelBounds
 * Applies alignment and spacing offsets to label bounds.
 */
export function rotateLabelBounds(
  bounds: Rectangle,
  style: StyleMap,
  align: string,
  valign: string,
  spacingLeft: number,
  spacingRight: number,
  spacingTop: number,
  spacingBottom: number,
  scale: number = 1
): void {
  const margin = getAlignmentAsPoint(align, valign);

  // Apply margin offset
  bounds.y -= margin.y * bounds.height;
  bounds.x -= margin.x * bounds.width;

  const overflow = style.overflow as string;
  const blockSpacing = style.blockSpacing === '1' || style.blockSpacing === 1;

  // Apply spacing (unless overflow is fill/width or block without blockSpacing)
  if (overflow !== 'fill' && overflow !== 'width' && (overflow !== 'block' || blockSpacing)) {
    const spacing = getSpacing(align, valign, spacingLeft, spacingRight, spacingTop, spacingBottom, margin);
    bounds.x += spacing.x * scale;
    bounds.y += spacing.y * scale;

    const labelPosition = (style.labelPosition as string) || 'center';
    const verticalLabelPosition = (style.verticalLabelPosition as string) || 'middle';
    const labelWidth = style.labelWidth != null ? parseFloat(String(style.labelWidth)) * scale : null;

    // Reduce width by spacing when label is centered and no explicit labelWidth
    if (labelPosition === 'center' && labelWidth == null) {
      bounds.width = Math.max(0, bounds.width - (spacingLeft * scale + spacingRight * scale));
    }

    // Reduce height by spacing when label is vertically middle
    if (verticalLabelPosition === 'middle') {
      bounds.height = Math.max(0, bounds.height - (spacingTop * scale + spacingBottom * scale));
    }
  }
}

/**
 * Port of mxCellRenderer.getLabelBounds
 * Main entry point - calculates the complete label bounds.
 */
export function getLabelBounds(input: LabelBoundsInput): Rectangle {
  const {
    cellX,
    cellY,
    cellWidth,
    cellHeight,
    style,
    align,
    valign,
    spacingLeft,
    spacingRight,
    spacingTop,
    spacingBottom,
    isEdge = false,
    shapeLabelBounds,
    scale = 1,
  } = input;

  // Get absolute offset from label position styles
  const absoluteOffset = isEdge ? { x: 0, y: 0 } : getVertexLabelOffset(style, cellWidth, cellHeight, scale);

  // Initialize bounds with absolute offset
  const bounds: Rectangle = {
    x: absoluteOffset.x,
    y: absoluteOffset.y,
    width: 0,
    height: 0,
  };

  if (isEdge) {
    // Edge label handling
    const margin = getAlignmentAsPoint(align, valign);
    const spacing = getSpacing(align, valign, spacingLeft, spacingRight, spacingTop, spacingBottom, margin);
    bounds.x += spacing.x * scale;
    bounds.y += spacing.y * scale;
    bounds.width = Math.max(0, cellWidth * scale);
    bounds.height = Math.max(0, cellHeight * scale);
  } else {
    // Vertex label handling
    const inverted = isPaintBoundsInverted(style, true);

    // Invert label position offset if bounds inverted
    if (inverted) {
      const tmp = bounds.x;
      bounds.x = bounds.y;
      bounds.y = tmp;
    }

    // Add cell position
    bounds.x += cellX;
    bounds.y += cellY;

    // Set dimensions (minimum of 1 fixes alignment bug in HTML labels)
    bounds.width = Math.max(1, cellWidth);
    bounds.height = Math.max(1, cellHeight);

    // Swap dimensions if bounds inverted
    if (inverted) {
      // Rotates around center of state
      const t = (cellWidth - cellHeight) / 2;
      bounds.x += t;
      bounds.y -= t;
      const tmp = bounds.width;
      bounds.width = bounds.height;
      bounds.height = tmp;
    }

    // Shape can modify its label bounds (only for centered labels)
    const labelPosition = (style.labelPosition as string) || 'center';
    const verticalLabelPosition = (style.verticalLabelPosition as string) || 'middle';

    if (shapeLabelBounds && labelPosition === 'center' && verticalLabelPosition === 'middle') {
      const modified = shapeLabelBounds(bounds);
      bounds.x = modified.x;
      bounds.y = modified.y;
      bounds.width = modified.width;
      bounds.height = modified.height;
    }

    // Label width style overrides actual label width
    const labelWidth = style.labelWidth != null ? parseFloat(String(style.labelWidth)) * scale : null;
    if (labelWidth != null) {
      bounds.width = labelWidth;
    }

    // Apply rotation and alignment
    rotateLabelBounds(bounds, style, align, valign, spacingLeft, spacingRight, spacingTop, spacingBottom, scale);
  }

  return bounds;
}

/**
 * Simplified version that returns the key positioning values needed for CSS.
 * This transforms the the platform bounds into CSS-compatible values.
 */
export function getLabelCSSPosition(input: LabelBoundsInput): {
  marginLeft: number;
  paddingTop: number;
  labelWidth: number;
  labelHeight: number;
} {
  const bounds = getLabelBounds(input);

  // The bounds.x represents the left edge position
  // The bounds.y represents the top edge position
  // For CSS, we use margin-left and padding-top to position the label container

  return {
    marginLeft: Math.round(bounds.x),
    paddingTop: Math.round(bounds.y),
    labelWidth: Math.round(bounds.width),
    labelHeight: Math.round(bounds.height),
  };
}
