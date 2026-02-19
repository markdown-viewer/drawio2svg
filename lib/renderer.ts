/**
 * SVG Renderer
 * 
 * Renders parsed DrawIO diagrams to SVG format.
 * 
 * DOM Refactoring: Builds DOM in parallel with string output.
 * Each render method adds elements to this.currentGroup.
 */

import type { ParsedDrawio, Diagram, MxCell, MxStyle } from './parser.ts';
import { getPerimeterPoint, type Point, type CellState } from './edge-router.ts';
import { SvgBuilder } from './svg/index.ts';
import type { StencilBundle, StencilShape, DrawOp, PathCmd } from './stencil/index.ts';
import { parseInlineStencil } from './stencil/index.ts';
import { decompressContent } from './decompress.ts';
import {
  normalizeColor,
  normalizeColorId,
  getGradientCoords,
  getGradientDirectionKey
} from './renderer/color.ts';
import {
  parseShapeAttrs as parseShapeAttrsHelper,
  applyShapeAttrsToElement as applyShapeAttrsToElementHelper,
  applyShapeAttrsToBuilder as applyShapeAttrsToBuilderHelper
} from './renderer/styles.ts';
import { convertToXhtml as convertToXhtmlHelper, setXhtmlContent as setXhtmlContentHelper } from './renderer/text/xhtml.ts';
import {
  renderLabel as renderLabelHelper,
  renderEdgeLabel as renderEdgeLabelHelper,
  renderSwimlaneLabel as renderSwimlaneLabelHelper,
  type TextRenderContext
} from './renderer/text/labels.ts';
import { getTextMeasureProvider, DEFAULT_FONT_FAMILY, setDefaultFontFamily } from '@markdown-viewer/text-measure';
import { measureTextBoundsAtPosition } from './renderer/text/bounds.ts';
import { measureMultilineTextSize, measureMultilineTextLayout } from './renderer/text/metrics.ts';
import { isEdgeChildLabel, getAbsolutePosition as getAbsolutePositionHelper } from './renderer/geometry.ts';
import { renderVertexLabel } from './renderer/text/vertex-label.ts';
import { renderInlineImage as renderInlineImageHelper } from './renderer/inline-image.ts';
import { createPlaceholderInlineSvg } from './renderer/placeholder-svg.ts';
import { ShapeRegistry, setSystemDefaultFontFamily } from './renderer/shape-registry.ts';
import type { LabelOverrides } from './renderer/shape-registry.ts';
import { registerHandlers } from './renderer/shapes/index.ts';
 
import { normalizeImageUrl, isPlaceholderImageUrl } from './renderer/image-url.ts';

/**
 * Convert SVG arc to cubic bezier curves
 * This matches draw.io's internal conversion for consistent rendering
 */
function arcToCurves(
  x0: number,
  y0: number,
  rx: number,
  ry: number,
  angle: number,
  largeArcFlag: number,
  sweepFlag: number,
  x: number,
  y: number
): number[] | null {
  x -= x0;
  y -= y0;

  if (rx === 0 || ry === 0) {
    return null;
  }

  rx = Math.abs(rx);
  ry = Math.abs(ry);

  let dx = -x / 2;
  let dy = -y / 2;
  let cos = Math.cos((angle * Math.PI) / 180);
  let sin = Math.sin((angle * Math.PI) / 180);
  let x1 = cos * dx + sin * dy;
  let y1 = -sin * dx + cos * dy;

  let x1Sq = x1 * x1;
  let y1Sq = y1 * y1;
  let rxSq = rx * rx;
  let rySq = ry * ry;
  let lamda = x1Sq / rxSq + y1Sq / rySq;
  let sign: number;

  if (lamda > 1) {
    rx *= Math.sqrt(lamda);
    ry *= Math.sqrt(lamda);
    sign = 0;
  } else {
    sign = 1;
    if (largeArcFlag === sweepFlag) {
      sign = -1;
    }
    sign *= Math.sqrt((rxSq * rySq - rxSq * y1Sq - rySq * x1Sq) / (rxSq * y1Sq + rySq * x1Sq));
  }

  let cx1 = (sign * rx * y1) / ry;
  let cy1 = (-sign * ry * x1) / rx;
  let cx = cos * cx1 - sin * cy1 + x / 2;
  let cy = sin * cx1 + cos * cy1 + y / 2;

  let startAngle = Math.atan2((y1 - cy1) / ry, (x1 - cx1) / rx) - Math.atan2(0, 1);
  startAngle = startAngle >= 0 ? startAngle : 2 * Math.PI + startAngle;
  let delta = Math.atan2((-y1 - cy1) / ry, (-x1 - cx1) / rx) - Math.atan2((y1 - cy1) / ry, (x1 - cx1) / rx);
  delta = delta >= 0 ? delta : 2 * Math.PI + delta;

  if (sweepFlag === 0 && delta > 0) {
    delta -= 2 * Math.PI;
  } else if (sweepFlag !== 0 && delta < 0) {
    delta += 2 * Math.PI;
  }

  let segments = Math.ceil(Math.abs((2 * delta) / Math.PI));
  if (segments === 0) segments = 1;
  const segAngle = delta / segments;
  const t = (8 / 3) * Math.sin(segAngle / 4) * Math.sin(segAngle / 4) / Math.sin(segAngle / 2);

  let c1 = cos * rx;
  let c2 = cos * ry;
  let s1 = sin * rx;
  let s2 = sin * ry;
  let ca = Math.cos(startAngle);
  let sa = Math.sin(startAngle);
  let qx = -t * (c1 * sa + s2 * ca);
  let qy = -t * (s1 * sa - c2 * ca);

  const out: number[] = [];

  for (let i = 0; i < segments; i++) {
    startAngle += segAngle;
    ca = Math.cos(startAngle);
    sa = Math.sin(startAngle);
    const x2 = c1 * ca - s2 * sa + cx;
    const y2 = s1 * ca + c2 * sa + cy;
    const rx2 = -t * (c1 * sa + s2 * ca);
    const ry2 = -t * (s1 * sa - c2 * ca);
    out.push(qx + x0, qy + y0, x2 - rx2 + x0, y2 - ry2 + y0, x2 + x0, y2 + y0);
    qx = x2 + rx2;
    qy = y2 + ry2;
  }

  return out;
}

const STATIC_LABEL_OVERRIDES: Record<string, LabelOverrides> = {
  'mxgraph.android.quickscroll2': {
    inset: { left: 3 },
    getPaddingTop: ({ labelY, labelH }) => Math.round(labelY + labelH / 2) + 3
  },
  'mxgraph.lean_mapping.electronic_info_flow_edge': {
    getLabelBounds: (_style, x, y, width, height) => ({ x: x - 2, y: y - 2, width, height }),
    alwaysUseLabelBounds: true
  },
  'mxgraph.lean_mapping.manual_info_flow_edge': {
    getLabelBounds: (_style, x, y, width, height) => ({ x: x - 2, y: y - 2, width, height }),
    alwaysUseLabelBounds: true
  },
  'mxgraph.networks.comm_link_edge': {
    getLabelBounds: (_style, x, y, width, height) => ({ x: x - 2, y: y - 2, width, height }),
    alwaysUseLabelBounds: true
  },
  // arrows2.arrow: direct getLabelBounds override (not getLabelMargins)
  'mxgraph.arrows2.arrow': {
    getLabelBounds: (style, x, y, width, height) => {
      if (!style.boundedLbl) {
        return { x, y, width, height };
      }
      const w = width;
      const h = height;
      let direction = (style.direction as string) || 'east';
      const flipH = style.flipH === true || style.flipH === 1 || style.flipH === '1';
      const flipV = style.flipV === true || style.flipV === 1 || style.flipV === '1';
      if (flipH) {
        if (direction === 'west') direction = 'east';
        else if (direction === 'east') direction = 'west';
      }
      if (flipV) {
        if (direction === 'north') direction = 'south';
        else if (direction === 'south') direction = 'north';
      }
      const dyStyle = typeof style.dy === 'number' ? style.dy : parseFloat(String(style.dy ?? 0.5));
      const dxStyle = typeof style.dx === 'number' ? style.dx : parseFloat(String(style.dx ?? 0.5));
      let dy: number, dx: number;
      if (direction === 'north' || direction === 'south') {
        dy = w * 0.5 * Math.max(0, Math.min(1, dyStyle));
        dx = Math.max(0, Math.min(h, dxStyle));
      } else {
        dy = h * 0.5 * Math.max(0, Math.min(1, dyStyle));
        dx = Math.max(0, Math.min(w, dxStyle));
      }
      if (direction === 'east') {
        return { x, y: y + dy, width: w - dx, height: h - 2 * dy };
      } else if (direction === 'west') {
        return { x: x + dx, y: y + dy, width: w - dx, height: h - 2 * dy };
      } else if (direction === 'north') {
        return { x: x + dy, y: y + dx, width: w - 2 * dy, height: h - dx };
      } else {
        return { x: x + dy, y, width: w - 2 * dy, height: h - dx };
      }
    }
  },
  // arrows2.twoWayArrow: direct getLabelBounds override
  'mxgraph.arrows2.twoWayArrow': {
    getLabelBounds: (style, x, y, width, height) => {
      if (!style.boundedLbl) {
        return { x, y, width, height };
      }
      const w = width;
      const h = height;
      const direction = (style.direction as string) || 'east';
      const vertical = direction === 'north' || direction === 'south';
      const dyStyle = typeof style.dy === 'number' ? style.dy : parseFloat(String(style.dy ?? 0.5));
      const dxStyle = typeof style.dx === 'number' ? style.dx : parseFloat(String(style.dx ?? 0.5));
      let dy: number, dx: number;
      if (vertical) {
        dy = w * 0.5 * Math.max(0, Math.min(1, dyStyle));
        dx = Math.max(0, Math.min(h, dxStyle));
      } else {
        dy = h * 0.5 * Math.max(0, Math.min(1, dyStyle));
        dx = Math.max(0, Math.min(w, dxStyle));
      }
      if (vertical) {
        return { x: x + dy, y: y + dx, width: w - 2 * dy, height: h - 2 * dx };
      } else {
        return { x: x + dx, y: y + dy, width: w - 2 * dx, height: h - 2 * dy };
      }
    }
  }
};

const VERTEX_EDGE_SHAPE_SKIP = new Set<string>([
  'filledEdge',
  'flexArrow',
  'link',
  'pipe',
  'tableLine',
  'wire',
  'mxgraph.lean_mapping.electronic_info_flow_edge',
  'mxgraph.lean_mapping.manual_info_flow_edge',
  'mxgraph.networks.comm_link_edge'
]);
import { buildEdgeTerminal } from './renderer/edge/terminal.ts';
import { getEdgeOrigin } from './renderer/edge/origin.ts';
import { getEdgeArrowConfig } from './renderer/edge/arrows.ts';
import { getRouterPoints } from './renderer/edge/routing.ts';
import { resolveFloatingEndpoints } from './renderer/edge/floating-endpoints.ts';
import { finalizeAbsolutePoints } from './renderer/edge/points.ts';
import { shouldSkipZeroLengthEdge } from './renderer/edge/length.ts';
import { applyEdgeArrows } from './renderer/edge/arrow-render.ts';
import { renderEdgeDom } from './renderer/edge/dom.ts';
import { renderEdgeLabelIfAny } from './renderer/edge/label.ts';
import { buildEdgeRenderResult, type EdgeRenderResult } from './renderer/edge/bounds.ts';
import { getEdgeStyleConfig } from './renderer/edge/style.ts';
import { getEdgeAngles } from './renderer/edge/angles.ts';
import { getEdgePathD } from './renderer/edge/path.ts';
import { buildIsometricLinkPath, buildPolylineLinkPath } from './renderer/edge/link.ts';
import { renderOverflowTextCell } from './renderer/text/overflow.ts';
import { renderLineSeparator } from './renderer/shapes/line.ts';
import { renderEdgeChildLabel } from './renderer/text/edge-child.ts';
import {
  isLineShape as isLineShapeHelper,
  getLineStrokeWidth as getLineStrokeWidthHelper,
  shouldSkipPlaceholderShape as shouldSkipPlaceholderShapeHelper,
  isOverflowTextCell as isOverflowTextCellHelper,
  createLinkWrapper as createLinkWrapperHelper
} from './renderer/vertex-utils.ts';
import {
  applyArrow2Swap,
  computePaintBounds,
  createCellGroup as createCellGroupHelper,
  createGeometryGroup as createGeometryGroupHelper
} from './renderer/vertex-layout.ts';
import {
  initBounds,
  updateBounds as updateBoundsHelper,
  finalizeBounds,
  extendBoundsForShadow,
  extendBoundsForExternalLabels,
  extendBoundsForInternalLabelOverflow,
  updateBoundsForEdge,
  updateBoundsForRotatedRect,
  updateBoundsForCenterHtmlLabel,
  updateBoundsForOverflowHiddenText
} from './renderer/bounds.ts';

/** Rendering options */
export interface RenderOptions {
  /** Page index to render (default: 0) */
  pageIndex?: number;
  /** Background color (default: transparent) */
  backgroundColor?: string;
  /** Add padding around the diagram (default: 2) */
  padding?: number;
  /** Scale factor (default: 1) */
  scale?: number;
  /** Default font family for text rendering (optional) */
  fontFamily?: string;
  /** Stencil bundle for mxgraph stencils (optional) */
  stencils?: StencilBundle | null;
}

/** Bounding box */
interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** Shape rendering context - common parameters for all shapes */
export interface ShapeContext {
  x: number;
  y: number;
  width: number;
  height: number;
  style: MxStyle;
}

/** Parsed shape style attributes */
export interface ShapeAttrs {
  strokeWidth: number;
  rounded: boolean;
  fillStyle?: string;
  // Raw values for DOM building
  fillColor: string;
  strokeColor: string;
  opacity: number;
  fillOpacity: number;
  strokeOpacity: number;
  dashed: boolean;
  dashPattern?: string;
  lineJoin?: string;
  lineCap?: string;
  gradientId?: string;
  gradientStartColor?: string;
  gradientEndColor?: string;
  gradientDirection?: string;
  patternId?: string;
  patternStrokeColor?: string;
}

/**
 * Render context used by shape handlers.
 * Combines runtime state and shape-specific context.
 */
export interface RenderContext extends ShapeContext {
  cell: MxCell;
  cellMap: Map<string, MxCell>;
  builder: SvgBuilder | null;
  currentGroup: Element | null;
  cellGroup: Element | null;
  clipPaths: Map<string, { x: number; y: number; width: number; height: number }>;
  linearGradients: Set<string>;
  glassGradients: Set<string>;
  stencils: StencilBundle | null;
  scale: number;
  offsetX: number;
  offsetY: number;
  normalizeImageUrl: (url: string) => string;
  isPlaceholderImageUrl: (url: string) => boolean;
  createPlaceholderInlineSvg: (x: number, y: number, width: number, height: number) => Element | null;
  getStencilShape: (shape: string) => StencilShape | null;
  renderStencilShape: (ctx: ShapeContext, shape: StencilShape) => void;
  applyShapeAttrsToElement: (el: Element, attrs: ShapeAttrs) => void;
  applyShapeAttrsToBuilder: (builder: SvgBuilder, attrs: ShapeAttrs) => void;
  getTextMeasureProvider: typeof getTextMeasureProvider;
}

/**
 * SVG Renderer class
 */
export class SvgRenderer {
  private options: Required<RenderOptions>;
  private domParser: DOMParser;
  private clipPaths: Map<string, { x: number; y: number; width: number; height: number }> = new Map();
  private linearGradients: Set<string> = new Set();
  private glassGradients: Set<string> = new Set();
  private crossHatchPatterns: Set<string> = new Set();
  private stencils: StencilBundle | null = null;
  private shapeRegistry: ShapeRegistry = new ShapeRegistry();
  
  // DOM building context
  private builder: SvgBuilder | null = null;
  private currentGroup: Element | null = null;
  private groupStack: Element[] = [];
  
  // Coordinate offset for aligning content to padding
  private offsetX: number = 0;
  private offsetY: number = 0;
  
  // Store edge path points for calculating child label positions
  private edgePathPoints: Map<string, { x: number; y: number }[]> = new Map();
  // Store edge path points for jump calculations (previous edges only)
  private edgeJumpPoints: Map<string, { x: number; y: number }[]> = new Map();
  
  constructor(options: RenderOptions = {}) {
    if (options.fontFamily) {
      setDefaultFontFamily(options.fontFamily);
      setSystemDefaultFontFamily(options.fontFamily);
    }
    this.options = {
      pageIndex: options.pageIndex ?? 0,
      backgroundColor: options.backgroundColor ?? 'transparent',
      padding: options.padding ?? 2,
      scale: options.scale ?? 1,
      fontFamily: options.fontFamily ?? DEFAULT_FONT_FAMILY,
      stencils: options.stencils ?? null,
    };
    this.domParser = new DOMParser();
    this.stencils = options.stencils ?? null;
    registerHandlers(this.shapeRegistry);
  }

  /**
   * Get perimeter function for a shape by querying the handler
   */
  private getPerimeterFnForShape = (shape: string | undefined): ((bounds: CellState, next: Point, orthogonal: boolean, direction?: string) => Point) | null => {
    if (!shape) return null;
    const ctor = this.shapeRegistry.getHandlerCtor(shape);
    if (!ctor) return null;
    // Create a minimal render context just to query perimeter
    const dummyCtx = {} as RenderContext;
    const handler = new ctor(dummyCtx);
    return handler.getPerimeter?.() ?? null;
  };

  /**
   * Get label overrides for a shape by querying the handler
   */
  private getLabelOverridesForShape = (shape: string | undefined): import('./renderer/shape-registry.ts').LabelOverrides | null => {
    if (!shape) return null;
    if (STATIC_LABEL_OVERRIDES[shape]) {
      return STATIC_LABEL_OVERRIDES[shape];
    }
    const ctor = this.shapeRegistry.getHandlerCtor(shape);
    if (!ctor) return null;
    // Create a minimal render context just to query label overrides
    const dummyCtx = {} as RenderContext;
    const handler = new ctor(dummyCtx);
    return handler.getLabelOverrides?.() ?? null;
  };

  private createRenderContext(
    ctx: ShapeContext,
    cell: MxCell,
    cellMap: Map<string, MxCell>,
    cellGroup: Element | null
  ): RenderContext {
    return {
      ...ctx,
      cell,
      cellMap,
      builder: this.builder,
      currentGroup: this.currentGroup,
      cellGroup,
      clipPaths: this.clipPaths,
      linearGradients: this.linearGradients,
      glassGradients: this.glassGradients,
      stencils: this.stencils,
      scale: this.options.scale,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      normalizeImageUrl,
      isPlaceholderImageUrl,
      createPlaceholderInlineSvg: this.createPlaceholderInlineSvg.bind(this),
      getStencilShape: this.getStencilShape.bind(this),
      renderStencilShape: this.renderStencilShape.bind(this),
      applyShapeAttrsToElement: this.applyShapeAttrsToElement.bind(this),
      applyShapeAttrsToBuilder: this.applyShapeAttrsToBuilder.bind(this),
      getTextMeasureProvider,
    };
  }

  /**
   * Render a parsed diagram to SVG string
   */
  render(parsed: ParsedDrawio): string {
    const diagram = parsed.diagrams[this.options.pageIndex];
    if (!diagram) {
      throw new Error(`Page index ${this.options.pageIndex} not found`);
    }

    return this.renderDiagram(diagram);
  }

  /**
   * Render a single diagram to SVG
   * Two-pass rendering:
   * 1. First pass: render without DOM to calculate bounds
   * 2. Second pass: render with DOM, then apply offset
   */
  private renderDiagram(diagram: Diagram): string {
    const { cells } = diagram;
    const { padding, scale, backgroundColor } = this.options;

    // === First pass: no DOM building, just calculate bounds ===
    this.builder = null;
    this.currentGroup = null;
    this.groupStack = [];
    this.clipPaths.clear();
    this.linearGradients.clear();
    this.glassGradients.clear();
    this.crossHatchPatterns.clear();
    this.edgePathPoints.clear();
    this.edgeJumpPoints.clear();
    this.offsetX = 0;
    this.offsetY = 0;
    
    const { bounds: firstPassBounds } = this.renderCellsWithBounds(cells);
    const edgePathPointsSnapshot = new Map(this.edgePathPoints);

    // Adjust top bounds for step shapes with HTML labels (extends bounds upward)
    const cellMap = new Map<string, MxCell>();
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      cellMap.set(cell.id || `__cell_${i}__`, cell);
    }
    let minStepTop = Infinity;
    for (const cell of cells) {
      if (!cell.vertex || !cell.geometry) continue;
      const style = cell.style;
      if ((style.shape as string | undefined) !== 'step') continue;
      if ((style.html as string | undefined) !== '1') continue;
      if (style.whiteSpace !== 'wrap') continue;
      if (style.fixedSize === '1' || style.fixedSize === true) continue;
      const absPos = this.getAbsolutePosition(cell, cellMap);
      const fontSize = parseFloat(style.fontSize as string) || 12;
      const topPad = fontSize / 2 + 1;
      minStepTop = Math.min(minStepTop, absPos.y - topPad);
    }
    if (Number.isFinite(minStepTop)) {
      firstPassBounds.minY = Math.min(firstPassBounds.minY, minStepTop);
    }

    // Adjust top bounds for inline SVG images without labels (adds a small top pad)
    let minInlineSvgImageTop = Infinity;
    for (const cell of cells) {
      if (!cell.vertex || !cell.geometry) continue;
      if (cell.value) continue;
      const style = cell.style;
      if ((style.shape as string | undefined) !== 'image') continue;
      const imageValue = style.image as string | undefined;
      if (!imageValue || !imageValue.startsWith('data:image/svg+xml')) continue;
      const absPos = this.getAbsolutePosition(cell, cellMap);
      minInlineSvgImageTop = Math.min(minInlineSvgImageTop, absPos.y);
    }
    if (
      Number.isFinite(minInlineSvgImageTop) &&
      Math.abs(minInlineSvgImageTop - firstPassBounds.minY) < 0.01
    ) {
      firstPassBounds.minY -= 2;
    }

    
    // Calculate offset from first pass bounds
    let hasRotatedBoldTextOverflow = false;
    for (const cell of cells) {
      if (!cell.vertex || !cell.geometry || !cell.value) continue;
      const style = cell.style;
      const shapeType = style.shape as string | undefined;
      const isTextShape = shapeType === 'text' || shapeType === 'label' || style.text === true || style.text === '1';
      if (!isTextShape) continue;
      const rotation = parseFloat(style.rotation as string) || 0;
      if (rotation === 0) continue;
      const fontStyleRaw = parseInt(style.fontStyle as string) || 0;
      const isBold = (fontStyleRaw & 1) !== 0 || style.fontStyle === 'bold';
      if (!isBold) continue;
      const textSize = measureMultilineTextSize(cell.value || '', style, 12);
      if (textSize.width > cell.geometry.width) {
        hasRotatedBoldTextOverflow = true;
        break;
      }
    }
    const offsetEpsilon = 1e-6;
    const offsetBaseX = -firstPassBounds.minX + padding;
    const offsetBaseY = -firstPassBounds.minY + padding;
    // Handle floating-point precision issues when the offset is very close to an integer
    // e.g., -38.00000000000006 should be treated as -38, not -39
    const adjustedOffsetBaseX = Math.abs(offsetBaseX - Math.round(offsetBaseX)) < offsetEpsilon 
      ? Math.round(offsetBaseX) 
      : offsetBaseX;
    const adjustedOffsetBaseY = Math.abs(offsetBaseY - Math.round(offsetBaseY)) < offsetEpsilon 
      ? Math.round(offsetBaseY) 
      : offsetBaseY;
    this.offsetX = Math.floor(adjustedOffsetBaseX + (adjustedOffsetBaseX >= 0 ? offsetEpsilon : 0));
    this.offsetY = Math.floor(adjustedOffsetBaseY + (adjustedOffsetBaseY >= 0 ? offsetEpsilon : 0));
    if (hasRotatedBoldTextOverflow) {
      this.offsetX -= 1;
    }
    
    const edgePathPointsWithOffset = new Map(
      Array.from(edgePathPointsSnapshot.entries(), ([key, points]) => [
        key,
        points.map((pt) => ({ x: pt.x + this.offsetX, y: pt.y + this.offsetY }))
      ])
    );

    // === Second pass: render with DOM building (offset applied during rendering) ===
    this.builder = new SvgBuilder(10000, 10000);
    this.currentGroup = this.builder.root;
    this.groupStack = [];
    this.clipPaths.clear();
    this.linearGradients.clear();
    this.glassGradients.clear();
    this.crossHatchPatterns.clear();
    this.edgePathPoints = new Map(edgePathPointsWithOffset);
    this.edgeJumpPoints = new Map();
    
    // Render all cells with offset applied
    this.renderCellsWithBounds(cells);
    
    // Build defs
    this.buildDefsDOM(cells);
    
    // Width/height calculation formula:
    // w = Math.max(1, Math.ceil(bounds.width * s) + 2 * border)
    // where bounds.width = maxX - minX (float), not ceil(maxX) - floor(minX)
    // When scale=1 and border=0:
    const boundsWidth = firstPassBounds.maxX - firstPassBounds.minX;
    const boundsHeight = firstPassBounds.maxY - firstPassBounds.minY;
    
    // Add border (which is 0 by default for SVG export)
    // crisp offset is applied via a translate on the content group
    let width = Math.max(1, Math.ceil(boundsWidth)) + 2 * padding;
    let height = Math.max(1, Math.ceil(boundsHeight)) + 2 * padding;
    
    // Update SVG dimensions
    this.builder.root.setAttribute('width', `${width}px`);
    this.builder.root.setAttribute('height', `${height}px`);
    // viewBox at 0 0
    this.builder.root.setAttribute('viewBox', `0 0 ${width} ${height}`);
    if (backgroundColor !== 'transparent') {
      this.builder.root.setAttribute('style', `background-color: ${backgroundColor}`);
    }
    
    // Wrap content in scale group (uses per-shape 0.5 translate)
    const contentGroup = this.builder.createGroup();
    if (scale !== 1) {
      contentGroup.setAttribute('transform', `scale(${scale})`);
    }
    const childrenToMove: Node[] = [];
    for (let i = 0; i < this.builder.root.childNodes.length; i++) {
      const node = this.builder.root.childNodes[i];
      if (node.nodeType === 1 && (node as Element).tagName !== 'defs') {
        childrenToMove.push(node);
      }
    }
    for (const child of childrenToMove) {
      contentGroup.appendChild(child);
    }
    this.builder.root.appendChild(contentGroup);
    
    return this.builder.toString();
  }

  // === DOM Helper Methods ===

  /**
   * Push a new group and set it as current target
   * The new group is appended to the current group before switching.
   */
  private pushGroup(g: Element): void {
    if (this.currentGroup) {
      this.currentGroup.appendChild(g);
      this.groupStack.push(this.currentGroup);
    }
    this.currentGroup = g;
  }

  /**
   * Pop and restore previous group as current target
   */
  private popGroup(): void {
    this.currentGroup = this.groupStack.pop() || null;
  }

  /**
   * Build defs using DOM
   */
  private buildDefsDOM(cells: MxCell[]): void {
    void cells;
    if (!this.builder) return;
    if (this.clipPaths.size > 0) {
      for (const [id, rect] of this.clipPaths) {
        this.builder.createClipPath(id, rect.x, rect.y, rect.width, rect.height);
      }
    }
  }
  private getTextRenderContext(): TextRenderContext {
    return {
      builder: this.builder,
      currentGroup: this.currentGroup,
      clipPaths: this.clipPaths,
      normalizeColor: (color: string) => this.normalizeColor(color),
      escapeXml: (value: string) => this.escapeXml(value),
      convertToXhtml: (value: string) => this.convertToXhtml(value),
      setXhtmlContent: (element: Element, xhtmlContent: string) => setXhtmlContentHelper(element, xhtmlContent, this.domParser),
      getLabelOverrides: this.getLabelOverridesForShape
    };
  }

  // ==========================================================================
  // Shape Rendering Helpers
  // ==========================================================================

  /**
   * Normalize color to rgb(r, g, b) format
   */
  private normalizeColor(color: string): string {
    return normalizeColor(color);
  }

  private shouldApplyCrispTranslate(
    strokeWidth: number,
    strokeColor?: string,
    isTextShape?: boolean,
    isLineShape?: boolean
  ): boolean {
    void isTextShape;
    const effectiveStrokeWidth = strokeWidth > 0 && strokeWidth < 1 ? 1 : strokeWidth;
    const rounded = Math.round(effectiveStrokeWidth || 0);
    if (isLineShape) {
      const normalizedStroke = (strokeColor || '').replace(/\s+/g, '').toLowerCase();
      const isWhiteStroke = normalizedStroke === 'rgb(255,255,255)' || normalizedStroke === '#ffffff';
      if (rounded <= 2) {
        return rounded % 2 === 1 && !isWhiteStroke;
      }
    }
    return rounded % 2 === 1;
  }

  private shouldApplyCrispTranslateForShape(
    strokeWidth: number,
    shape?: string,
    strokeColor?: string,
    isTextShape?: boolean,
    isLineShape?: boolean
  ): boolean {
    if (shape === 'image') return false;
    return this.shouldApplyCrispTranslate(strokeWidth, strokeColor, isTextShape, isLineShape);
  }

  private normalizeColorId(color: string): string {
    return normalizeColorId(color);
  }

  private getGradientCoords(directionKey: string): { x1: string; y1: string; x2: string; y2: string } {
    return getGradientCoords(directionKey);
  }

  private ensureLinearGradient(
    id: string,
    startColor: string,
    endColor: string,
    directionKey: string
  ): void {
    if (!this.builder || this.linearGradients.has(id)) return;

    const defs = this.builder.getDefs();
    const gradient = this.builder.createElement('linearGradient');
    gradient.setAttribute('id', id);
    const coords = this.getGradientCoords(directionKey);
    gradient.setAttribute('x1', coords.x1);
    gradient.setAttribute('y1', coords.y1);
    gradient.setAttribute('x2', coords.x2);
    gradient.setAttribute('y2', coords.y2);

    const stopStart = this.builder.createElement('stop');
    stopStart.setAttribute('offset', '0%');
    stopStart.setAttribute('style', `stop-color: ${startColor}; stop-opacity: 1;`);
    const stopEnd = this.builder.createElement('stop');
    stopEnd.setAttribute('offset', '100%');
    stopEnd.setAttribute('style', `stop-color: ${endColor}; stop-opacity: 1;`);
    gradient.appendChild(stopStart);
    gradient.appendChild(stopEnd);
    defs.appendChild(gradient);
    this.linearGradients.add(id);
  }

  private ensureCrossHatchPattern(id: string, strokeColor: string): void {
    if (!this.builder || this.crossHatchPatterns.has(id)) return;

    const defs = this.builder.getDefs();
    const pattern = this.builder.createElement('pattern');
    pattern.setAttribute('id', id);
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', '15.75');
    pattern.setAttribute('height', '15.75');
    pattern.setAttribute('x', '0');
    pattern.setAttribute('y', '0');
    pattern.setAttribute('patternTransform', 'rotate(45)');

    const rect = this.builder.createElement('rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('width', '15.75');
    rect.setAttribute('height', '15.75');
    rect.setAttribute('stroke', strokeColor);
    rect.setAttribute('stroke-width', '0.5');
    rect.setAttribute('fill', 'none');
    pattern.appendChild(rect);

    defs.appendChild(pattern);
    this.crossHatchPatterns.add(id);
  }

  private ensureGlassGradient(id: string, color: string): void {
    if (!this.builder || this.glassGradients.has(id)) return;

    const defs = this.builder.getDefs();
    const gradient = this.builder.createElement('linearGradient');
    gradient.setAttribute('id', id);
    const coords = this.getGradientCoords('s');
    gradient.setAttribute('x1', coords.x1);
    gradient.setAttribute('y1', coords.y1);
    gradient.setAttribute('x2', coords.x2);
    gradient.setAttribute('y2', coords.y2);

    const stopStart = this.builder.createElement('stop');
    stopStart.setAttribute('offset', '0%');
    stopStart.setAttribute('style', `stop-color: ${color}; stop-opacity: 0.9;`);
    const stopEnd = this.builder.createElement('stop');
    stopEnd.setAttribute('offset', '100%');
    stopEnd.setAttribute('style', `stop-color: ${color}; stop-opacity: 0.1;`);
    gradient.appendChild(stopStart);
    gradient.appendChild(stopEnd);
    defs.appendChild(gradient);
    this.glassGradients.add(id);
  }

  private renderGlassOverlay(ctx: ShapeContext, attrs: ShapeAttrs): void {
    if (!this.builder || !this.currentGroup) return;

    const { x, y, width, height, style } = ctx;
    const { fillColor, strokeWidth } = attrs;
    if (!width || !height || fillColor === 'none') return;

    const glassColor = /^url\(/i.test(fillColor) ? '#ffffff' : this.normalizeColor(fillColor);
    const colorId = this.normalizeColorId(glassColor);
    const gradientId = `mx-glass-${colorId || 'transparent'}-0`;
    this.ensureGlassGradient(gradientId, glassColor);

    const sw = Math.ceil((strokeWidth || 1) / 2);
    const size = 0.4;
    const curveY = y + height * size;
    const controlY = y + height * 0.7;
    const midX = x + width * 0.5;
    const format = (value: number): number => Number(value.toFixed(2));

    let arc = 0;
    if (attrs.rounded) {
      const absoluteArcSize = style.absoluteArcSize === '1' || style.absoluteArcSize === true;
      const wPlus = width + (strokeWidth || 1);
      const hPlus = height + (strokeWidth || 1);
      if (absoluteArcSize) {
        const arcSize = parseFloat(style.arcSize as string) || 20;
        arc = Math.min(wPlus / 2, Math.min(hPlus / 2, arcSize / 2));
      } else {
        const f = (parseFloat(style.arcSize as string) || 15) / 100;
        arc = Math.min(wPlus * f, hPlus * f);
      }
      arc += 2 * sw;
    }

    const left = x - sw;
    const right = x + width + sw;
    const top = y - sw;

    this.builder.setCanvasRoot(this.currentGroup);
    this.builder.save();
    this.builder.setFillColor(`url(#${gradientId})`);
    this.builder.setStrokeColor('none');
    this.builder.setLineJoin('miter');
    this.builder.setLineCap('flat');
    this.builder.setMiterLimit(10);
    this.builder.begin();

    if (attrs.rounded) {
      this.builder.moveTo(format(left + arc), format(top));
      this.builder.quadTo(format(left), format(top), format(left), format(top + arc));
      this.builder.lineTo(format(left), format(curveY));
      this.builder.quadTo(format(midX), format(controlY), format(right), format(curveY));
      this.builder.lineTo(format(right), format(top + arc));
      this.builder.quadTo(format(right), format(top), format(right - arc), format(top));
      this.builder.close();
    } else {
      this.builder.moveTo(format(left), format(top));
      this.builder.lineTo(format(left), format(curveY));
      this.builder.quadTo(format(midX), format(controlY), format(right), format(curveY));
      this.builder.lineTo(format(right), format(top));
      this.builder.close();
    }

    this.builder.fill();
    this.builder.restore();

    const glassPath = this.currentGroup.lastChild as Element | null;
    if (glassPath) {
      glassPath.setAttribute('pointer-events', 'all');
    }
  }

  /**
   * Parse common style attributes for shape rendering
   */
  private parseShapeAttrs(
    style: MxStyle,
    cell?: MxCell | null,
    cellMap?: Map<string, MxCell> | null
  ): ShapeAttrs {
    return parseShapeAttrsHelper(style, cell, cellMap);
  }

  /**
   * Apply post-processing transforms (shadow, rotation) to shape element
   * Applies transforms to the last DOM element in currentGroup
   */
  private applyShapeTransforms(ctx: ShapeContext): void {
    const { x, y, width, height, style } = ctx;

    // Wrap shape with shadow filter if needed
    const hasShadow = style.shadow === '1' || style.shadow === true;
    if (hasShadow) {
      // DOM: apply filter to geometry group or wrap last element
      if (this.builder && this.currentGroup) {
        const geometryGroup = this.currentGroup.getAttribute('data-geometry') === '1'
          ? this.currentGroup
          : null;
        if (geometryGroup) {
          const existingStyle = geometryGroup.getAttribute('style') || '';
          const filterStyle = 'filter: drop-shadow(rgba(0, 0, 0, 0.25) 2px 3px 2px);';
          geometryGroup.setAttribute(
            'style',
            existingStyle ? `${existingStyle} ${filterStyle}` : filterStyle
          );
        } else {
          const lastChild = this.currentGroup.lastChild as Element;
          if (lastChild) {
            const shadowGroup = this.builder.createGroup();
            shadowGroup.setAttribute('style', 'filter: drop-shadow(rgba(0, 0, 0, 0.25) 2px 3px 2px);');
            this.currentGroup.removeChild(lastChild);
            shadowGroup.appendChild(lastChild);
            this.currentGroup.appendChild(shadowGroup);
          }
        }
      }
    }
    
    // Handle rotation - matching mxShape.getShapeRotation()
    let rotation = parseFloat(style.rotation as string) || 0;
    
    // Add direction-based rotation (mxShape.getShapeRotation)
    const direction = style.direction as string;
    if (direction) {
      if (direction === 'north') rotation += 270;
      else if (direction === 'west') rotation += 180;
      else if (direction === 'south') rotation += 90;
      // 'east' adds 0, which is the default
    }
    
    const shapeName = style.shape as string | undefined;
    let flipH = style.flipH === '1' || style.flipH === true;
    let flipV = style.flipV === '1' || style.flipV === true;

    let skipFlipRotation = false;

    if (shapeName === 'mxgraph.floorplan.doorRight' && direction === 'south' && flipH && !flipV) {
      flipH = false;
      flipV = true;
    }

    if (shapeName === 'mxgraph.arrows2.arrow' && direction === 'north' && flipV && !flipH) {
      flipH = true;
      flipV = false;
      rotation = -rotation;
      skipFlipRotation = true;
    }

    if (shapeName === 'mxgraph.infographic.circularCallout2'
      && (direction === 'north' || direction === 'south')
      && flipH
      && !flipV) {
      flipH = false;
      flipV = true;
    }

    if (flipH && flipV) {
      rotation += 180;
      flipH = false;
      flipV = false;
    } else if (rotation !== 0 && flipH !== flipV && !skipFlipRotation) {
      rotation = -rotation;
    }

    const hasFlip = flipH || flipV;

    if (rotation !== 0 || hasFlip) {
      let centerX = x + width / 2;
      let centerY = y + height / 2;

      const strokeWidth = parseFloat(style.strokeWidth as string) || 1;

      if (shapeName === 'mxgraph.electrical.miscellaneous.monocell_battery' && rotation !== 0) {
        centerX += 1;
      }
      if (shapeName === 'mxgraph.electrical.resistors.resistor_1' && rotation !== 0) {
        centerX += 1;
      }
      if (shapeName === 'mxgraph.lean_mapping.physical_pull' && flipH) {
        centerX += 1;
      }

      if (shapeName === 'mxgraph.arrows2.arrow') {
        const directionValue = (style.direction as string | undefined) || '';
        const strokeColor = (style.strokeColor as string | undefined) || '';
        const hasStroke = strokeColor !== 'none';
        if (hasStroke && directionValue === 'north' && Math.round(strokeWidth) % 2 === 1) {
          centerY += 1;
        }
      }

      if (shapeName === 'line') {
        const strokeWidth = parseFloat(style.strokeWidth as string) || 1;
        const directionValue = (style.direction as string | undefined) || '';
        const strokeColor = (style.strokeColor as string | undefined) || '';
        const isLineStyle = style.line === '1' || style.line === true;
        const isHtml = style.html === '1' || style.html === true;
        const hasStrokeColor = style.strokeColor !== undefined && style.strokeColor !== '';
        const normalizedStroke = strokeColor.replace(/\s+/g, '').toLowerCase();
        const isBlackStroke = !normalizedStroke
          || normalizedStroke === 'rgb(0,0,0)'
          || normalizedStroke === '#000000';
        if (!isLineStyle
          && (directionValue === 'north' || directionValue === 'south')
          && isBlackStroke
          && Math.round(strokeWidth) % 2 === 1) {
          centerY += 1;
        }
        if (isLineStyle
          && !isHtml
          && !hasStrokeColor
          && (directionValue === 'north' || directionValue === 'south')
          && Math.round(strokeWidth) % 2 === 1) {
          centerY += 1;
        }
      }


      const flipCenterX = flipH ? centerX : 0;
      const flipCenterY = flipV ? centerY : 0;
      const flipTransform = hasFlip
        ? `translate(${flipCenterX},${flipCenterY})scale(${flipH ? -1 : 1},${flipV ? -1 : 1})translate(${-flipCenterX},${-flipCenterY})`
        : '';
      const rotateTransform = rotation !== 0 ? `rotate(${rotation},${centerX},${centerY})` : '';
      const combined = [flipTransform, rotateTransform].filter(Boolean).join('');

      // DOM: add transform to the shape element(s)
      if (this.builder && this.currentGroup) {
        const geometryGroup = this.currentGroup.getAttribute('data-geometry') === '1'
          ? this.currentGroup
          : null;
        const lastChild = this.currentGroup.lastChild as Element | null;
        if (geometryGroup || lastChild) {
          const resolveTarget = (el: Element): Element | null => {
            if (el.tagName === 'g') {
              const directTransformGroup = el.getAttribute('data-transform') === 'group';
              if (directTransformGroup) return el;
              const inner = el.lastChild as Element | null;
              if (inner && inner.getAttribute && inner.getAttribute('data-transform') === 'group') {
                return inner;
              }
              return inner;
            }
            return el;
          };

          const rawTarget = geometryGroup ?? (lastChild ? resolveTarget(lastChild) : null);
          const targetRoot = rawTarget && rawTarget.tagName === 'g'
            ? rawTarget
            : (this.currentGroup ?? rawTarget);
          if (targetRoot && combined) {
            const applyTransform = (el: Element): void => {
              const existingTransform = el.getAttribute('transform') || '';
              el.setAttribute('transform', existingTransform ? `${existingTransform} ${combined}` : combined);
            };

            const shapeTags = new Set(['rect', 'path', 'ellipse', 'circle', 'polygon', 'line', 'image']);
            const targets: Element[] = [];
            const collectTargets = (el: Element): void => {
              if (shapeTags.has(el.tagName)) {
                targets.push(el);
                return;
              }
              const children = Array.from(el.childNodes)
                .filter((node) => (node as Element).nodeType === 1) as Element[];
              for (const child of children) {
                collectTargets(child);
              }
            };

            collectTargets(targetRoot);

            if (targets.length === 0) {
              applyTransform(targetRoot);
            } else {
              for (const target of targets) {
                applyTransform(target);
              }
            }
          }
        }
      }
    }
  }

  // ==========================================================================
  // Individual Shape Renderers
  // ==========================================================================

  /**
   * Apply common shape attributes to a DOM element
   */
  private applyShapeAttrsToElement(el: Element, attrs: ShapeAttrs): void {
    applyShapeAttrsToElementHelper(
      el,
      attrs,
      (id, startColor, endColor, directionKey) => {
        this.ensureLinearGradient(id, startColor, endColor, directionKey);
      },
      (id, strokeColor) => {
        this.ensureCrossHatchPattern(id, strokeColor);
      }
    );
  }

  /**
   * Apply common shape attributes to SvgBuilder canvas state
   */
  private applyShapeAttrsToBuilder(builder: SvgBuilder, attrs: ShapeAttrs): void {
    applyShapeAttrsToBuilderHelper(
      builder,
      attrs,
      (id, startColor, endColor, directionKey) => {
        this.ensureLinearGradient(id, startColor, endColor, directionKey);
      },
      (id, strokeColor) => {
        this.ensureCrossHatchPattern(id, strokeColor);
      }
    );
  }

  /**
   * Arrow marker info returned by createArrowPath
   */
  private createArrowPath(
    tipX: number, tipY: number,
    angle: number, // Angle in radians pointing INTO the arrow (from line end to tip)
    arrowType: string,
    size: number,
    filled: boolean,
    strokeColor: string,
    strokeWidth: number = 1
  ): { element: Element | null; lineOffset: number; boundPoints: Point[] } | null {
    if (!arrowType || arrowType === 'none') return null;

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // Apply endOffset to arrow tip position
    // endOffset = sw * factor compensates for stroke width
    // Factor varies by arrow type: diamond=0.7071 (1/√2), diamondThin=0.9862, others=1.118
    const endOffsetFactor = arrowType === 'diamond' ? 0.7071
      : arrowType === 'diamondThin' ? 0.9862
      : 1.118;
    const endOffset = strokeWidth * endOffsetFactor;
    const actualTipX = tipX - endOffset * cos;
    const actualTipY = tipY - endOffset * sin;
    
    // Transform a point relative to actual tip (local coords with arrow pointing right)
    const transform = (lx: number, ly: number): Point => ({
      x: actualTipX + lx * cos - ly * sin,
      y: actualTipY + lx * sin + ly * cos,
    });

    const fillValue = filled ? strokeColor : 'none';
    const roundValue = (value: number): number => Number(value.toFixed(2));
    const roundPoint = (point: Point): Point => ({ x: roundValue(point.x), y: roundValue(point.y) });
    
    // Arrow dimensions
    // For classic/block: unitX/Y = direction * (size + sw)
    // width = (size + sw) / widthFactor (widthFactor = 2 for normal, 3 for thin)
    const len = size + strokeWidth; // Arrow length
    const widthFactor = arrowType === 'diamondThin' ? 3.4 : (arrowType.includes('Thin') ? 3 : 2);
    const w = len / widthFactor; // Half-width
    
    let lineOffset: number;
    let boundPoints: Point[];
    let element: Element | null = null;

    // Helper to create path element with builder APIs
    const createPathElement = (draw: (builder: SvgBuilder) => void, fill: string): Element | null => {
      if (!this.builder || !this.currentGroup) return null;
      const tempGroup = this.builder.createGroup();
      this.builder.setCanvasRoot(tempGroup);
      this.builder.save();
      this.builder.resetCanvasTransform();
      this.builder.setFillColor(fill);
      this.builder.setStrokeColor(strokeColor);
      this.builder.setStrokeWidth(strokeWidth);
      this.builder.setLineJoin('miter');
      this.builder.setLineCap('flat');
      this.builder.setMiterLimit(10);
      this.builder.begin();
      draw(this.builder);
      if (fill === 'none') {
        this.builder.stroke();
      } else {
        this.builder.fillAndStroke();
      }
      this.builder.restore();
      this.builder.setCanvasRoot(this.currentGroup);
      const el = tempGroup.lastChild as Element | null;
      if (el) {
        el.setAttribute('pointer-events', 'all');
      }
      return el;
    };

    switch (arrowType) {
      case 'sysMLPackCont': {
        if (!this.builder || !this.currentGroup) {
          return { element: null, lineOffset: 0, boundPoints: [] };
        }

        const radius = size / 2;
        const centerX = roundValue(tipX - Math.cos(angle) * (radius + 1));
        const centerY = roundValue(tipY - Math.sin(angle) * (radius + 1));
        const perpX = -Math.sin(angle);
        const perpY = Math.cos(angle);
        const lineHalf = radius + 1;
        const lineStart = roundPoint({
          x: centerX - perpX * lineHalf,
          y: centerY - perpY * lineHalf
        });
        const lineEnd = roundPoint({
          x: centerX + perpX * lineHalf,
          y: centerY + perpY * lineHalf
        });

        const group = this.builder.createGroup();
        const lineEl = this.builder.createPath(`M ${lineStart.x} ${lineStart.y} L ${lineEnd.x} ${lineEnd.y}`);
        lineEl.setAttribute('fill', 'none');
        lineEl.setAttribute('stroke', strokeColor);
        lineEl.setAttribute('stroke-width', String(strokeWidth));
        lineEl.setAttribute('stroke-miterlimit', '10');
        lineEl.setAttribute('pointer-events', 'all');

        const ellipseEl = this.builder.createEllipse(centerX, centerY, radius, radius);
        ellipseEl.setAttribute('fill', 'none');
        ellipseEl.setAttribute('stroke', strokeColor);
        ellipseEl.setAttribute('stroke-width', String(strokeWidth));
        ellipseEl.setAttribute('pointer-events', 'all');

        group.appendChild(lineEl);
        group.appendChild(ellipseEl);

        return {
          element: group,
          lineOffset: 0,
          boundPoints: [
            lineStart,
            lineEnd,
            roundPoint({ x: centerX - radius, y: centerY - radius }),
            roundPoint({ x: centerX + radius, y: centerY + radius })
          ]
        };
      }
      case 'ERone':
      case 'ERmandOne':
      case 'ERmany':
      case 'ERoneToMany':
      case 'ERzeroToMany':
      case 'ERzeroToOne': {
        const unitX = cos;
        const unitY = sin;
        const len = size + strokeWidth + 1;
        const m = unitX * len;
        const n = unitY * len;
        const p = size / 2;

        const segments: Array<{ p1: Point; p2: Point }> = [];
        const addLine = (x1: number, y1: number, x2: number, y2: number): void => {
          segments.push({ p1: { x: roundValue(x1), y: roundValue(y1) }, p2: { x: roundValue(x2), y: roundValue(y2) } });
        };

        if (arrowType === 'ERone' || arrowType === 'ERmandOne' || arrowType === 'ERoneToMany' || arrowType === 'ERzeroToOne') {
          const barCenterOffset = arrowType === 'ERoneToMany' ? len : len / 2;
          addLine(
            tipX - unitX * barCenterOffset - n / 2,
            tipY - unitY * barCenterOffset + m / 2,
            tipX - unitX * barCenterOffset + n / 2,
            tipY - unitY * barCenterOffset - m / 2
          );
        }

        if (arrowType === 'ERmandOne') {
          addLine(
            tipX - m - n / 2,
            tipY - n + m / 2,
            tipX - m + n / 2,
            tipY - n - m / 2
          );
        }

        if (arrowType === 'ERmany' || arrowType === 'ERoneToMany' || arrowType === 'ERzeroToMany') {
          addLine(
            tipX + n / 2,
            tipY - m / 2,
            tipX - m,
            tipY - n
          );
          addLine(
            tipX - m,
            tipY - n,
            tipX - n / 2,
            tipY + m / 2
          );
        }

        const group = this.builder ? this.builder.createGroup() : null;
        if (group) {
          if (arrowType === 'ERzeroToMany' || arrowType === 'ERzeroToOne') {
            const ellipse = this.builder!.createEllipse(tipX - 1.5 * m, tipY - 1.5 * n, p, p);
            ellipse.setAttribute('fill', filled ? '#ffffff' : 'none');
            ellipse.setAttribute('stroke', strokeColor);
            ellipse.setAttribute('stroke-miterlimit', '10');
            ellipse.setAttribute('pointer-events', 'all');
            group.appendChild(ellipse);
          }

          if (segments.length > 0) {
            const path = createPathElement((builder) => {
              for (const segment of segments) {
                builder.moveTo(segment.p1.x, segment.p1.y);
                builder.lineTo(segment.p2.x, segment.p2.y);
              }
            }, 'none');
            if (path) {
              group.appendChild(path);
            }
          }
        }

        const boundPoints: Point[] = [];
        if (segments.length > 0) {
          boundPoints.push(
            { x: tipX - m / 2 - n / 2, y: tipY - n / 2 + m / 2 },
            { x: tipX - m / 2 + n / 2, y: tipY - n / 2 - m / 2 }
          );
        }
        if (arrowType === 'ERzeroToMany' || arrowType === 'ERzeroToOne') {
          boundPoints.push(
            { x: tipX - 1.5 * m - p, y: tipY - 1.5 * n - p },
            { x: tipX - 1.5 * m + p, y: tipY - 1.5 * n + p }
          );
        }

        return { element: group, lineOffset: 0, boundPoints };
      }
      case 'classic':
      case 'classicThin': {
        // Classic arrow with notch: tip -> left-wing -> notch -> right-wing -> close
        // Classic uses unitX * 3/4 for notch depth
        // Note: In transform, positive ly goes to the right side of the arrow direction
        const p1 = transform(0, 0); // Tip
        const p2 = transform(-len, w); // Left wing (positive ly = right in transform coords, but left visually)
        const p3 = transform(-len * 0.75, 0); // Notch (3/4 of length from tip)
        const p4 = transform(-len, -w); // Right wing
        const classicPoints = [roundPoint(p1), roundPoint(p2), roundPoint(p3), roundPoint(p4)];
        // LineOffset formula: (size + sw) * 0.75 + sw * 1.118
        lineOffset = (size + strokeWidth) * 0.75 + strokeWidth * 1.118;
        boundPoints = [p1, p2, p3, p4];
        element = createPathElement((builder) => {
          builder.addPoints(classicPoints, false, 0, true);
        }, fillValue);
        break;
      }
      case 'block':
      case 'blockThin': {
        // Block arrow (triangle): tip -> left -> right -> close
        const p1 = transform(0, 0);
        const p2 = transform(-len, w);
        const p3 = transform(-len, -w);
        const blockPoints = [roundPoint(p1), roundPoint(p2), roundPoint(p3)];
        // LineOffset formula: (size + sw) * 1 + sw * 1.118
        lineOffset = (size + strokeWidth) + strokeWidth * 1.118;
        boundPoints = [p1, p2, p3];
        element = createPathElement((builder) => {
          builder.addPoints(blockPoints, false, 0, true);
        }, fillValue);
        break;
      }
      case 'blockBar': {
        // Block arrow (triangle) with a separated perpendicular bar behind the base
        // Used for PlantUML's <|| / ||> (redefines) decoration
        const p1 = transform(0, 0);
        const p2 = transform(-len, w);
        const p3 = transform(-len, -w);
        const blockBarPoints = [roundPoint(p1), roundPoint(p2), roundPoint(p3)];
        // Bar is placed behind the triangle with a gap
        // Extend bar by half strokeWidth on each side to match triangle base visual width
        // (triangle corners have miter joins that extend beyond the path)
        const barGap = strokeWidth * 2;
        const barOffset = len + barGap;
        const barW = w + strokeWidth / 2;
        const barLeft = transform(-barOffset, barW);
        const barRight = transform(-barOffset, -barW);
        lineOffset = barOffset + strokeWidth;
        boundPoints = [p1, barLeft, barRight];

        const group = this.builder ? this.builder.createGroup() : null;
        if (group) {
          // Draw the triangle
          const tri = createPathElement((builder) => {
            builder.addPoints(blockBarPoints, false, 0, true);
          }, fillValue);
          if (tri) group.appendChild(tri);
          // Draw the perpendicular bar separated from the triangle base
          const bar = createPathElement((builder) => {
            builder.moveTo(roundValue(barLeft.x), roundValue(barLeft.y));
            builder.lineTo(roundValue(barRight.x), roundValue(barRight.y));
          }, 'none');
          if (bar) group.appendChild(bar);
        }
        return { element: group, lineOffset, boundPoints };
      }
      case 'open':
      case 'openThin':
      case 'openFilled': {
        // Open arrow (V shape, not closed)
        // Same ly sign swap as classic/block
        const p1 = transform(-len, w);  // Left
        const p2 = transform(0, 0);     // Tip
        const p3 = transform(-len, -w); // Right
        // LineOffset formula: sw * 1.118 * 2
        lineOffset = strokeWidth * 1.118 * 2;
        boundPoints = [p1, p2, p3];
        const useFill = arrowType === 'openFilled' ? fillValue : 'none';
        element = createPathElement((builder) => {
          builder.addPoints([roundPoint(p1), roundPoint(p2), roundPoint(p3)], false, 0, false);
        }, useFill);
        return { element, lineOffset, boundPoints };
      }
      case 'diamond':
      case 'diamondThin': {
        // Diamond shape - same ly sign swap
        const halfLen = len / 2;
        const p1 = transform(0, 0); // Tip
        const p2 = transform(-halfLen, w); // Left
        const p3 = transform(-len, 0); // Back
        const p4 = transform(-halfLen, -w); // Right
        const diamondPoints = [roundPoint(p1), roundPoint(p2), roundPoint(p3), roundPoint(p4)];
        // LineOffset for diamond: full length + strokeWidth offset (using per-type factor)
        lineOffset = (size + strokeWidth) + strokeWidth * endOffsetFactor;
        boundPoints = [p1, p2, p3, p4];
        element = createPathElement((builder) => {
          builder.addPoints(diamondPoints, false, 0, true);
        }, fillValue);
        break;
      }
      case 'square': {
        // Square marker centered on the original tip (connection point)
        // Used for PlantUML's # decoration
        const halfSide = w * 0.8;
        // transform uses actualTip (offset by endOffset), compensate to center on tipX/tipY
        const eo = endOffset;
        const sq1 = transform(-halfSide + eo, -halfSide);
        const sq2 = transform(halfSide + eo, -halfSide);
        const sq3 = transform(halfSide + eo, halfSide);
        const sq4 = transform(-halfSide + eo, halfSide);
        const squarePoints = [roundPoint(sq1), roundPoint(sq2), roundPoint(sq3), roundPoint(sq4)];
        lineOffset = halfSide + strokeWidth;
        boundPoints = [sq1, sq2, sq3, sq4];
        element = createPathElement((builder) => {
          builder.addPoints(squarePoints, false, 0, true);
        }, fillValue);
        break;
      }
      case 'oval': {
        // Oval/circle marker - circle centered at the original tip point (no endOffset)
        // Oval marker doesn't use the stroke offset compensation
        const r = size / 2;
        // Center at original tip (tipX/tipY, not actualTipX/actualTipY)
        const center = { x: tipX, y: tipY };
        element = this.builder ? this.builder.createEllipse(center.x, center.y, r, r) : null;
        if (element) {
          element.setAttribute('fill', fillValue);
          element.setAttribute('stroke', strokeColor);
          element.setAttribute('stroke-miterlimit', '10');
          element.setAttribute('pointer-events', 'all');
        }
        // Bound points for oval (approximate with 4 corners of bounding box)
        boundPoints = [
          { x: center.x - r, y: center.y - r },
          { x: center.x + r, y: center.y - r },
          { x: center.x + r, y: center.y + r },
          { x: center.x - r, y: center.y + r }
        ];
        // LineOffset for oval: line should end at the edge of the circle (radius)
        return { element, lineOffset: r, boundPoints };
      }
      case 'ovalHalfCircle': {
        // Circle + half-circle arc (ball-and-socket / provided-required interface)
        // Used for PlantUML's 0) / (0 decoration
        // Both circle and arc share the same center (tipX/tipY);
        // arc radius is slightly larger than the circle radius.
        const r = size / 2;
        const arcR = r + strokeWidth * 2;
        const perpX = -sin;
        const perpY = cos;
        const cx = tipX;
        const cy = tipY;

        const group = this.builder ? this.builder.createGroup() : null;
        if (group && this.builder) {
          // Draw the circle (ball)
          const ellipse = this.builder.createEllipse(
            roundValue(cx), roundValue(cy), r, r
          );
          ellipse.setAttribute('fill', fillValue);
          ellipse.setAttribute('stroke', strokeColor);
          ellipse.setAttribute('stroke-width', String(strokeWidth));
          ellipse.setAttribute('stroke-miterlimit', '10');
          ellipse.setAttribute('pointer-events', 'all');
          group.appendChild(ellipse);

          // Draw quarter-circle arc (socket) — same center, opens away from the line
          // Arc spans 90° (half of previous 180°), centered on the -cos direction
          const halfArc = arcR * Math.SQRT1_2; // arcR * cos(45°)
          const arcStart = {
            x: cx - cos * halfArc + perpX * halfArc,
            y: cy - sin * halfArc + perpY * halfArc
          };
          const arcEnd = {
            x: cx - cos * halfArc - perpX * halfArc,
            y: cy - sin * halfArc - perpY * halfArc
          };
          // Control point pushed out so quadratic Bezier passes through the circle at t=0.5
          // For B(0.5) to be at distance arcR: ctrlDist = 2*arcR - halfArc
          const ctrlDist = 2 * arcR - halfArc;
          const ctrlMid = {
            x: cx - cos * ctrlDist,
            y: cy - sin * ctrlDist
          };
          const arc = createPathElement((builder) => {
            builder.moveTo(roundValue(arcStart.x), roundValue(arcStart.y));
            builder.quadTo(roundValue(ctrlMid.x), roundValue(ctrlMid.y), roundValue(arcEnd.x), roundValue(arcEnd.y));
          }, 'none');
          if (arc) group.appendChild(arc);
        }

        boundPoints = [
          { x: cx - arcR, y: cy - arcR },
          { x: cx + arcR, y: cy + arcR }
        ];
        return { element: group, lineOffset: arcR, boundPoints };
      }
      case 'halfCircle': {
        const unitX = cos;
        const unitY = sin;
        const nx = unitX * (size + strokeWidth + 1);
        const ny = unitY * (size + strokeWidth + 1);
        const tip = { x: tipX, y: tipY };
        const end = { x: tipX - nx, y: tipY - ny };
        const start = { x: tip.x - ny, y: tip.y + nx };
        const finish = { x: tip.x + ny, y: tip.y - nx };
        const ctrl1 = { x: end.x - ny, y: end.y + nx };
        const ctrl2 = { x: end.x + ny, y: end.y - nx };

        element = createPathElement((builder) => {
          builder.moveTo(roundValue(start.x), roundValue(start.y));
          builder.quadTo(roundValue(ctrl1.x), roundValue(ctrl1.y), roundValue(end.x), roundValue(end.y));
          builder.quadTo(roundValue(ctrl2.x), roundValue(ctrl2.y), roundValue(finish.x), roundValue(finish.y));
        }, 'none');

        boundPoints = [start, finish, ctrl1, ctrl2];
        lineOffset = size + strokeWidth + 1;
        break;
      }
      case 'cross': {
        // X-shape marker: two crossing diagonal lines at the tip
        const crossSize = len * 0.7;
        const p1 = transform(-crossSize, crossSize);
        const p2 = transform(crossSize, -crossSize);
        const p3 = transform(-crossSize, -crossSize);
        const p4 = transform(crossSize, crossSize);
        element = createPathElement((builder) => {
          builder.moveTo(roundValue(p1.x), roundValue(p1.y));
          builder.lineTo(roundValue(p2.x), roundValue(p2.y));
          builder.moveTo(roundValue(p3.x), roundValue(p3.y));
          builder.lineTo(roundValue(p4.x), roundValue(p4.y));
        }, 'none');
        lineOffset = 0;
        boundPoints = [p1, p2, p3, p4];
        break;
      }
      case 'halfBottom': {
        // Bottom half of classic arrow (only the bottom wing)
        const p1 = transform(0, 0); // Tip
        const p2 = transform(-len, -w); // Bottom wing
        if (filled) {
          // Filled: triangle (tip, bottom wing, base)
          const p3 = transform(-len, 0); // Base center
          const halfPoints = [roundPoint(p1), roundPoint(p2), roundPoint(p3)];
          element = createPathElement((builder) => {
            builder.addPoints(halfPoints, false, 0, true);
          }, fillValue);
          boundPoints = [p1, p2, p3];
        } else {
          // Open: just a line from wing to tip
          element = createPathElement((builder) => {
            builder.addPoints([roundPoint(p2), roundPoint(p1)], false, 0, false);
          }, 'none');
          boundPoints = [p1, p2];
        }
        lineOffset = strokeWidth * 1.118 * 2;
        break;
      }
      case 'halfTop': {
        // Top half of classic arrow (only the top wing)
        const p1 = transform(0, 0); // Tip
        const p2 = transform(-len, w); // Top wing
        if (filled) {
          // Filled: triangle (tip, top wing, base)
          const p3 = transform(-len, 0); // Base center
          const halfPoints = [roundPoint(p1), roundPoint(p2), roundPoint(p3)];
          element = createPathElement((builder) => {
            builder.addPoints(halfPoints, false, 0, true);
          }, fillValue);
          boundPoints = [p1, p2, p3];
        } else {
          // Open: just a line from wing to tip
          element = createPathElement((builder) => {
            builder.addPoints([roundPoint(p2), roundPoint(p1)], false, 0, false);
          }, 'none');
          boundPoints = [p1, p2];
        }
        lineOffset = strokeWidth * 1.118 * 2;
        break;
      }
      case 'circlePlus': {
        // Circle-plus marker (SysML): circle centered at the original tip with a plus inside
        const r = size + strokeWidth;
        const center = {
          x: tipX - r * cos,
          y: tipY - r * sin
        };
        const group = this.builder ? this.builder.createGroup() : null;
        if (group && this.builder) {
          const ellipse = this.builder.createEllipse(center.x, center.y, r, r);
          ellipse.setAttribute('fill', fillValue);
          ellipse.setAttribute('stroke', strokeColor);
          ellipse.setAttribute('stroke-miterlimit', '10');
          ellipse.setAttribute('pointer-events', 'all');
          group.appendChild(ellipse);

          const plus = createPathElement((builder) => {
            builder.moveTo(roundValue(center.x), roundValue(center.y - r));
            builder.lineTo(roundValue(center.x), roundValue(center.y + r));
            builder.moveTo(roundValue(center.x + r), roundValue(center.y));
            builder.lineTo(roundValue(center.x - r), roundValue(center.y));
          }, 'none');
          if (plus) {
            group.appendChild(plus);
          }
        }

        boundPoints = [
          { x: center.x - r, y: center.y - r },
          { x: center.x + r, y: center.y - r },
          { x: center.x + r, y: center.y + r },
          { x: center.x - r, y: center.y + r }
        ];

        return { element: group, lineOffset: 0, boundPoints };
      }
      default: {
        // Handle compound arrows ending with 'Dot' (e.g., classicDot, halfBottomDot)
        // Renders the base arrow type plus an oval dot at the tip
        // Layout: |line|---[arrowhead]---[dot at tip]---|endpoint|
        if (arrowType.endsWith('Dot')) {
          const baseType = arrowType.slice(0, -3);
          const dotRadius = size * 0.5;
          // Offset the base arrow behind the dot so arrowhead doesn't overlap
          const baseTipX = tipX - dotRadius * cos;
          const baseTipY = tipY - dotRadius * sin;
          // Recursively render the base arrow at the offset position
          const baseResult = this.createArrowPath(
            baseTipX, baseTipY, angle, baseType, size, filled, strokeColor, strokeWidth
          );
          if (!baseResult) return null;
          // Center the dot at the original tip (on the lifeline/endpoint)
          const dotEl = this.builder ? this.builder.createEllipse(tipX, tipY, dotRadius, dotRadius) : null;
          if (dotEl) {
            dotEl.setAttribute('fill', strokeColor);
            dotEl.setAttribute('stroke', strokeColor);
            dotEl.setAttribute('stroke-width', String(strokeWidth));
            dotEl.setAttribute('pointer-events', 'all');
          }
          // Combine base arrow + dot into one group
          const group = this.builder ? this.builder.createGroup() : null;
          if (group) {
            if (baseResult.element) group.appendChild(baseResult.element);
            if (dotEl) group.appendChild(dotEl);
          }
          return {
            element: group,
            lineOffset: dotRadius + baseResult.lineOffset,
            boundPoints: baseResult.boundPoints
          };
        }
        return null;
      }
    }

    return { element, lineOffset, boundPoints };
  }

  /**
   * Render all cells and collect actual bounds
   * Uses recursive tree structure
   */
  private renderCellsWithBounds(cells: MxCell[]): { bounds: BoundingBox } {
    // Track actual bounds including edge paths
    const bounds = initBounds();

    
    const updateBounds = (x: number, y: number) => {
      updateBoundsHelper(bounds, x, y);
    };
    const updateBoundsForRotatedRectFromOrigin = (
      x: number,
      y: number,
      width: number,
      height: number,
      rotation: number,
      strokeMargin: number
    ) => {
      const expandedX = x - strokeMargin;
      const expandedY = y - strokeMargin;
      const expandedW = width + strokeMargin * 2;
      const expandedH = height + strokeMargin * 2;
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
        const dx = px - expandedX;
        const dy = py - expandedY;
        updateBounds(expandedX + dx * cos - dy * sin, expandedY + dx * sin + dy * cos);
      }
    };

    // Build cell map and children map for lookups
    const cellMap = new Map<string, MxCell>();
    const childrenMap = new Map<string, MxCell[]>();
    
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const key = cell.id || `__cell_${i}__`;
      cellMap.set(key, cell);
      
      // Build parent->children map
      const parentId = cell.parent || '';
      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, []);
      }
      childrenMap.get(parentId)!.push(cell);
    }

    const isCellVisible = (cell: MxCell): boolean => {
      const isVisibleValue = (value: unknown): boolean => {
        if (value === undefined || value === null) return true;
        if (value === false) return false;
        if (value === 0) return false;
        if (value === '0') return false;
        if (value === 'false') return false;
        return true;
      };

      if (!isVisibleValue(cell.visible)) return false;

      let parentId = cell.parent;
      while (parentId && parentId !== '0' && parentId !== '1') {
        const parent = cellMap.get(parentId);
        if (!parent) break;
        if (!isVisibleValue(parent.visible)) return false;
        parentId = parent.parent;
      }

      return true;
    };

    // Recursive render function
    const renderCellRecursive = (cell: MxCell): void => {
      if (!isCellVisible(cell)) return;

      const cellKey = cell.id || '';
      const children = childrenMap.get(cellKey) || [];
      
      // Separate children into vertices and edges
      const childContainers = children.filter(c => !c.vertex && !c.edge && !c.geometry);
      
      // Render cell's own content (if it's a vertex or edge)
      if (cell.vertex) {
        this.renderVertex(cell, cellMap, cellKey);
        
        // DOM: If builder exists, get the cell group and prepare for children
        let savedGroup: Element | null = null;
        if (this.builder && this.currentGroup && children.length > 0) {
          const lastChild = this.currentGroup.lastChild as Element;
          if (lastChild && lastChild.getAttribute && lastChild.getAttribute('data-cell-id') === cellKey) {
            savedGroup = this.currentGroup;
            this.currentGroup = lastChild;
          }
        }
        
        // Render children - containers first for structure, then vertices/edges in original order
        if (children.length > 0) {
          childContainers.forEach(c => renderCellRecursive(c));
          // Render vertices and edges in original XML order
          const verticesAndEdges = children.filter(c => c.vertex || c.edge || (!c.vertex && !c.edge && c.geometry));
          verticesAndEdges.forEach(c => renderCellRecursive(c));
        }
        
        // DOM: Restore currentGroup
        if (savedGroup) {
          this.currentGroup = savedGroup;
        }
        
        // Update bounds from vertex
        const geo = cell.geometry;
        const style = cell.style;
        if (geo) {
          const absPos = this.getAbsolutePosition(cell, cellMap);
          const x = absPos.x;
          const y = absPos.y;
          let rotation = parseFloat(style.rotation as string) || 0;
          const direction = style.direction as string;
          if (direction) {
            if (direction === 'north') rotation += 270;
            else if (direction === 'west') rotation += 180;
            else if (direction === 'south') rotation += 90;
          }
          
          // Calculate stroke margin for bounds (mxShape.augmentBoundingBox)
          // Only add margin if shape has a stroke:
          // - strokeColor='none' means no stroke
          // - 'image' shape has no stroke by default (mxImageShape sets this.stroke=null)
          // - 'text' shapes (like table cells) have no stroke by default
          // - Other shapes have black stroke by default
          const strokeColor = style.strokeColor as string;
          const shapeType = style.shape as string | undefined;
          const shapesWithoutDefaultStroke = ['image', 'label', 'text'];
          // For text shapes, treat as stroke-less by default
          const isTextShape = shapeType === 'text' || shapeType === 'label' ||
            style.text === true || style.text === '1' ||
            style.shape === 'text' || style.shape === 'label';
          const isGroup = style.group === '1' || style.group === true;
          const hasGroupVisual = Boolean(
            style.shape ||
            style.fillColor ||
            style.strokeColor ||
            style.rounded === '1' ||
            style.rounded === true ||
            style.shadow === '1' ||
            style.shadow === true
          );
          const isNonVisualGroup = isGroup && !cell.value && !hasGroupVisual;
          const hasStroke = !isNonVisualGroup && strokeColor !== 'none' && 
                           !(strokeColor === undefined && (shapesWithoutDefaultStroke.includes(shapeType ?? '') || isTextShape));
          const strokeWidth = parseFloat(style.strokeWidth as string) || 1;
          let strokeMargin = hasStroke ? strokeWidth / 2 : 0;
          if (shapeType === 'arrow' || shapeType === 'arrowConnector') {
            const arrowWidthValue = parseFloat(style.arrowWidth as string);
            const arrowSizeValue = parseFloat(style.arrowSize as string);
            const arrowWidth = Number.isFinite(arrowWidthValue) ? arrowWidthValue : 30;
            const arrowSize = Number.isFinite(arrowSizeValue) ? arrowSizeValue : 30;
            let growSize = Math.max(arrowWidth, arrowSize);
            if (shapeType === 'arrowConnector') {
              const startArrow = style.startArrow as string | undefined;
              const endArrow = style.endArrow as string | undefined;
              const hasStartArrow = !!startArrow && startArrow !== 'none';
              const hasEndArrow = !!endArrow && endArrow !== 'none';
              if (!hasStartArrow && !hasEndArrow) {
                growSize = arrowWidth / 3;
              }
            }
            const arrowMargin = growSize / 2 + strokeWidth;
            strokeMargin = Math.max(strokeMargin, arrowMargin);
          }
          // Edge-like vertex shapes: use shape-specific augmentBoundingBox margins
          // mxArrowConnector (link, flexArrow): grow by (edgeWidth/2 + strokeWidth)
          // mxConnector (filledEdge, wire, pipe) and tableLine: just strokeWidth/2 (default)
          if (shapeType && VERTEX_EDGE_SHAPE_SKIP.has(shapeType)) {
            if (shapeType === 'link' || shapeType === 'flexArrow') {
              // mxArrowConnector.augmentBoundingBox: bbox.grow((edgeWidth/2 + strokewidth) * scale)
              const defaultWidth = shapeType === 'flexArrow' ? 10 : 4;
              const edgeWidth = (parseFloat(style.width as string) || defaultWidth) + Math.max(0, strokeWidth - 1);
              const arrowMargin = edgeWidth / 2 + strokeWidth;
              strokeMargin = Math.max(strokeMargin, arrowMargin);
            }
            // Other edge-like shapes (filledEdge, wire, pipe, tableLine, stencil edges):
            // use only strokeWidth/2 from shape, already computed above
          }
          
          let boundsX = x;
          let boundsY = y;
          let boundsW = geo.width;
          let boundsH = geo.height;
          const edgeChildLabel = isEdgeChildLabel(cell, cellMap);
          const skipPlaceholderShape = shouldSkipPlaceholderShapeHelper(geo, Boolean(cell.value), edgeChildLabel);
          const skipBounds = skipPlaceholderShape;
          if (direction === 'north' || direction === 'south') {
            const t = (boundsW - boundsH) / 2;
            boundsX += t;
            boundsY -= t;
            const tmp = boundsW;
            boundsW = boundsH;
            boundsH = tmp;
          }

          if (!skipBounds) {
            updateBoundsForRotatedRect(bounds, boundsX, boundsY, boundsW, boundsH, rotation, strokeMargin);
          }

          // Extend bounds for external label positions with explicit labelWidth
          // When labelWidth > cell width, the label extends beyond the shape
          if (!skipBounds && style.labelWidth != null) {
            const styleLabelWidth = parseFloat(String(style.labelWidth));
            if (Number.isFinite(styleLabelWidth) && styleLabelWidth > boundsW) {
              const labelPosition = (style.labelPosition as string) || 'center';
              const verticalLabelPosition = (style.verticalLabelPosition as string) || 'middle';
              // Compute horizontal label bounds (same logic as label-bounds.ts / labels.ts)
              let lx = boundsX;
              if (labelPosition === 'center' || !labelPosition) {
                lx = boundsX - (styleLabelWidth - boundsW) / 2;
              }
              updateBounds(lx, boundsY);
              updateBounds(lx + styleLabelWidth, boundsY + boundsH);
              // Extend vertically for external label positions
              if (verticalLabelPosition === 'bottom' && cell.value) {
                const labelFontSize = parseFloat(style.fontSize as string) || 12;
                const labelTextHeight = labelFontSize * 1.2;
                const spacingTop = parseFloat(style.spacingTop as string) || 0;
                updateBounds(lx, boundsY + boundsH + 7 + spacingTop + labelTextHeight);
              } else if (verticalLabelPosition === 'top' && cell.value) {
                const labelFontSize = parseFloat(style.fontSize as string) || 12;
                const labelTextHeight = labelFontSize * 1.2;
                updateBounds(lx, boundsY - 3 - labelTextHeight);
              }
            }
          }

          // Edge-like vertex shapes: extend bounds to include text label
          // draw.io uses union of shape.boundingBox and text.boundingBox
          if (!skipBounds && shapeType && VERTEX_EDGE_SHAPE_SKIP.has(shapeType) && cell.value) {
            const fontSize = parseFloat(style.fontSize as string) || 12;
            const textHeight = fontSize * 1.2;
            const textCenterY = boundsY + boundsH / 2;
            const textTop = textCenterY - textHeight / 2;
            const textBottom = textCenterY + textHeight / 2;
            const shapeMinY = boundsY - strokeMargin;
            const shapeMaxY = boundsY + boundsH + strokeMargin;
            if (textTop < shapeMinY || textBottom > shapeMaxY) {
              // Text extends beyond shape bounds, include text bounds
              updateBoundsForRotatedRect(bounds, boundsX, textTop, boundsW, textHeight, 0, 0);
            }
          }

          // Extend bounds for text shapes based on actual text height (line-height 1.2)
          if (!skipBounds && isTextShape && cell.value) {
            if (
              Number.isFinite(boundsX) &&
              Number.isFinite(boundsY) &&
              Number.isFinite(boundsW) &&
              Number.isFinite(boundsH)
            ) {
              const defaultVerticalAlign = isTextShape ? 'top' : 'middle';
              const wrapEnabled = style.whiteSpace === 'wrap';
              const maxLineWidth = Math.max(1, boundsW - 2);

              // Get text dimensions without container width constraint
              const textLayoutNoWrap = measureMultilineTextLayout(
                cell.value || '',
                style,
                12
              );
              const textWidth = textLayoutNoWrap.width;

              // Get text height with container width when wrap is enabled
              let textHeight: number;
              if (wrapEnabled) {
                const textLayoutWithWrap = measureMultilineTextLayout(
                  cell.value || '',
                  style,
                  12,
                  maxLineWidth
                );
                textHeight = textLayoutWithWrap.height;
              } else {
                textHeight = textLayoutNoWrap.height;
              }

              if (Number.isFinite(textHeight) && textHeight > geo.height) {
                const extra = (textHeight - geo.height) / 2;
                const verticalAlign = (style.verticalAlign as string) || defaultVerticalAlign;
                if (verticalAlign === 'top') {
                  updateBounds(boundsX, boundsY + textHeight);
                } else if (verticalAlign === 'bottom') {
                  updateBounds(boundsX, boundsY + boundsH - textHeight);
                } else {
                  updateBounds(boundsX, boundsY - extra);
                  updateBounds(boundsX + boundsW, boundsY + boundsH + extra);
                }
              }

              const verticalAlign = (style.verticalAlign as string) || defaultVerticalAlign;
              // sub/sup detection removed: WebView textHeight already includes sub/sup impact
              if ((style.html as string | undefined) === '1' && verticalAlign === 'top' && style.overflow !== 'hidden') {
                const whiteSpaceWrap = style.whiteSpace === 'wrap';
                const overflow = style.overflow as string | undefined;
                const spacingTop = parseFloat(style.spacingTop as string) || 0;
                const spacing = parseFloat(style.spacing as string) || 0;
                const fontSize = parseFloat(style.fontSize as string) || 12;
                let paddingTop = 0;

                if (style.overflow === 'fill') {
                  paddingTop = Math.round(boundsY + spacingTop);
                } else if (!whiteSpaceWrap && overflow !== 'fill' && overflow !== 'hidden') {
                  if (spacing > 0) {
                    paddingTop = Math.round(boundsY + spacing + spacingTop + fontSize / 2 + 1);
                  } else {
                    paddingTop = Math.round(boundsY + spacingTop + 7);
                  }
                } else if (whiteSpaceWrap) {
                  const baseOffset = style.overflow === 'hidden' && spacing > 0 ? 5 : 7;
                  paddingTop = Math.round(boundsY + spacing + spacingTop + baseOffset);
                } else {
                  paddingTop = Math.round(boundsY + spacing + spacingTop + fontSize / 2 + 1);
                }

                const textBottom = paddingTop + textHeight;
                if (textBottom > boundsY + boundsH) {
                  updateBounds(boundsX + boundsW, textBottom);
                }
              }

              const spacingTop = parseFloat(style.spacingTop as string) || 0;
              // Adjust bounds for negative spacingTop on centered text shapes
              if (spacingTop < 0) {
                const verticalAlign = (style.verticalAlign as string) || defaultVerticalAlign;
                const align = (style.align as string) || 'center';
                const rawValue = cell.value || '';
                const hasSpan = /<span\b/i.test(rawValue);
                if (verticalAlign === 'middle' && !hasSpan) {
                  const isSingleChar = rawValue.trim().length <= 1;
                  const hasBoldTag = /<b\b/i.test(rawValue);
                  const fontStyleRaw = parseInt(style.fontStyle as string) || 0;
                  const hasBoldStyle = (fontStyleRaw & 1) !== 0;
                  // Use WebView lineCount instead of HTML regex for line break detection
                  const hasMultipleLines = textLayoutNoWrap.lineCount > 1;
                  // Apply spacing offset for bold text (center-aligned), or overflow=hidden text shapes
                  const shouldAdjust = (align === 'center' && (hasBoldTag || (hasBoldStyle && (hasMultipleLines || isSingleChar))))
                    || (isTextShape && style.overflow === 'hidden');
                  if (shouldAdjust) {
                    let adjust = Math.floor(spacingTop / 2);
                    if (align === 'center' && hasBoldStyle && hasMultipleLines && !hasBoldTag && !isSingleChar) {
                      adjust = Math.ceil(spacingTop / 2);
                    }
                    updateBounds(boundsX, boundsY + adjust);
                  }
                }
              }
              const whiteSpaceWrap = style.whiteSpace === 'wrap';
              const overflow = style.overflow as string | undefined;
              const normalizedRotation = ((rotation % 360) + 360) % 360;
              const isHorizontalLabel = style.horizontal !== 0 && style.horizontal !== '0' && style.horizontal !== false;
              const isZeroSizeText = boundsW === 0 && boundsH === 0;
              const isVerticalSingleLine = isZeroSizeText && normalizedRotation !== 0 && !whiteSpaceWrap &&
                overflow !== 'fill' && overflow !== 'hidden';
              if (
                normalizedRotation === 0 &&
                isHorizontalLabel &&
                overflow !== 'hidden' &&
                overflow !== 'fill' &&
                !edgeChildLabel &&
                Number.isFinite(textWidth) &&
                textWidth > 0
              ) {
                const rawValue = cell.value || '';
                // Use WebView lineCount instead of HTML block element regex
                const hasMultipleLines = textLayoutNoWrap.lineCount > 1;
                const plainText = rawValue.replace(/<[^>]+>/g, '');
                const hasBreakableSpace = /\s/.test(plainText);
                const allowWrapOverflow = !whiteSpaceWrap || !hasBreakableSpace;
                if (!hasMultipleLines && allowWrapOverflow) {
                  const align = (style.align as string) || 'left';
                  const spacing = parseFloat(style.spacing as string) || 0;
                  const spacingLeft = parseFloat(style.spacingLeft as string) || 0;
                  const spacingRight = parseFloat(style.spacingRight as string) || 0;
                  let alignOffset = 0;
                  if (align === 'left') alignOffset = 1;
                  else if (align === 'right') alignOffset = -1;

                  let baseMarginLeft: number;
                  let baseLabelWidth: number;
                  if (spacing > 0) {
                    baseMarginLeft = x + spacing - 1 + alignOffset + spacingLeft;
                    baseLabelWidth = geo.width - 2 * spacing + 2 - spacingLeft - spacingRight;
                  } else {
                    baseMarginLeft = x + 1 + alignOffset + spacingLeft;
                    baseLabelWidth = geo.width - 2 - spacingLeft - spacingRight;
                  }

                  const maxLabelWidth = Math.max(0, baseLabelWidth);
                  const adjustedTextWidth = whiteSpaceWrap ? Math.max(0, textWidth - 2) : textWidth;
                  if (adjustedTextWidth > maxLabelWidth) {
                    let anchorX: number;
                    if (align === 'center') {
                      anchorX = baseMarginLeft + baseLabelWidth / 2;
                    } else if (align === 'right') {
                      anchorX = x + geo.width - 2 + spacingLeft;
                    } else {
                      anchorX = x + 2 + spacingLeft;
                    }

                    let textLeft: number;
                    let textRight: number;
                    if (align === 'right') {
                      textLeft = anchorX - adjustedTextWidth;
                      textRight = anchorX;
                    } else if (align === 'center') {
                      textLeft = anchorX - adjustedTextWidth / 2;
                      textRight = anchorX + adjustedTextWidth / 2;
                    } else {
                      textLeft = anchorX;
                      textRight = anchorX + adjustedTextWidth;
                    }

                    updateBounds(textLeft, y);
                    updateBounds(textRight, y + geo.height);
                  }
                }
              }
              if (
                normalizedRotation !== 0 &&
                Number.isFinite(textWidth) &&
                Number.isFinite(textHeight)
              ) {
                // widthBoost removed: WebView already measures bold text with correct fontWeight,
                // so the 1.185x multiplier was redundant (verified in Phase 1.2)
                const expandedWidth = Math.max(boundsW, textWidth);
                const expandedHeight = Math.max(boundsH, textHeight);
                if (expandedWidth > boundsW || expandedHeight > boundsH) {
                  if (boundsW === 0 && boundsH === 0) {
                    const verticalOffsetX = isVerticalSingleLine ? 7 : 0;
                    updateBoundsForRotatedRectFromOrigin(
                      boundsX + verticalOffsetX,
                      boundsY,
                      expandedWidth,
                      expandedHeight,
                      rotation,
                      strokeMargin
                    );
                  } else {
                    const centerX = boundsX + boundsW / 2;
                    const centerY = boundsY + boundsH / 2;
                    const expandedX = centerX - expandedWidth / 2;
                    const expandedY = centerY - expandedHeight / 2;
                    updateBoundsForRotatedRect(
                      bounds,
                      expandedX,
                      expandedY,
                      expandedWidth,
                      expandedHeight,
                      rotation,
                      strokeMargin
                    );
                  }
                }
              }
            }
          }

          // Extend bounds for line shape labels placed below the line (verticalAlign=top)
          if (!skipBounds && cell.value && isLineShapeHelper(style)) {
            const verticalAlign = (style.verticalAlign as string) || 'middle';
            if (verticalAlign === 'top') {
              const textSize = measureMultilineTextSize(cell.value || '', style, 12);
              const textHeight = Math.max(0, Math.round(textSize.height) - 1);
              const spacingTop = parseFloat(style.spacingTop as string) || 0;
              const labelTop = y + geo.height + 2 + spacingTop;
              const labelBottom = labelTop + textHeight;
              updateBounds(x + geo.width / 2, labelBottom);
            }
          }
          
          // Extend bbox for shadow
          if (!skipBounds && (style.shadow === '1' || style.shadow === true)) {
            if (rotation !== 0) {
              const cx = boundsX + boundsW / 2;
              const cy = boundsY + boundsH / 2;
              const rad = rotation * Math.PI / 180;
              const cos = Math.cos(rad);
              const sin = Math.sin(rad);
              const corners = [
                [boundsX, boundsY],
                [boundsX + boundsW, boundsY],
                [boundsX + boundsW, boundsY + boundsH],
                [boundsX, boundsY + boundsH]
              ];
              let minRotX = Infinity;
              let minRotY = Infinity;
              let maxRotX = -Infinity;
              let maxRotY = -Infinity;
              for (const [px, py] of corners) {
                const dx = px - cx;
                const dy = py - cy;
                const rx = cx + dx * cos - dy * sin;
                const ry = cy + dx * sin + dy * cos;
                minRotX = Math.min(minRotX, rx);
                minRotY = Math.min(minRotY, ry);
                maxRotX = Math.max(maxRotX, rx);
                maxRotY = Math.max(maxRotY, ry);
              }
              const strokePad = Math.max(0, strokeMargin);
              updateBounds(minRotX - 4 - strokePad, minRotY - 4);
              updateBounds(maxRotX + 6 + strokePad, maxRotY + 8);
            } else {
              extendBoundsForShadow(bounds, x, y, geo.width, geo.height, strokeMargin * 2);
            }

            const fillColor = style.fillColor as string | undefined;
            const strokeColorShadow = style.strokeColor as string | undefined;
            const whiteSpaceWrap = style.whiteSpace === 'wrap';
            const isShadowTextOnly = isTextShape && (fillColor === 'none' || fillColor === undefined) &&
              (strokeColorShadow === 'none' || strokeColorShadow === undefined);
            if (isShadowTextOnly && whiteSpaceWrap) {
              updateBounds(bounds.minX, y - 9);
            }

          }
          
          // Extend bbox for external labels
          if (!skipBounds && !isTextShape) {
            extendBoundsForExternalLabels(
              bounds,
              style,
              shapeType,
              x,
              y,
              geo.width,
              geo.height,
              Boolean(cell.value),
              cell.value || ''
            );
          }

          // Extend bbox for internal labels that overflow shape bounds
          if (!skipBounds && !isTextShape && cell.value) {
            extendBoundsForInternalLabelOverflow(
              bounds,
              style,
              x,
              y,
              geo.width,
              geo.height,
              cell.value
            );
          }

          if (!skipBounds && shapeType === 'mxgraph.mockup.misc.ruler2' && cell.value) {
            const dxRaw = parseFloat(style.dx as string);
            const dx = Number.isFinite(dxRaw) ? dxRaw : 100;
            const spacingLeft = Math.round(1000 * Math.max(0, Math.min(geo.width, dx))) / 1000 - 4;
            const labelCenterX = boundsX + geo.width / 2 + spacingLeft / 2;
            const labelCenterY = boundsY + geo.height / 2;
            updateBoundsForCenterHtmlLabel(bounds, cell.value || '', style, labelCenterX, labelCenterY, 12);
          }

          // Include bounds for edge child center labels (html=1, width/height=0)
          const isCenterHtmlLabel = edgeChildLabel && geo.width === 0 && geo.height === 0 &&
            cell.value && (style.html as string) === '1';
          if (!skipBounds && isCenterHtmlLabel) {
            updateBoundsForCenterHtmlLabel(bounds, cell.value || '', style, x, y, 12);
          }
          
          // Include text bounds for text shapes with overflow=hidden
          if (!skipBounds && cell.value && style.overflow === 'hidden') {
            const isTableLike = shapeType === 'partialRectangle'
              || shapeType === 'table'
              || shapeType === 'tableRow'
              || shapeType === 'tableCell';
            const verticalAlign = style.verticalAlign as string | undefined;
            const allowOverflowBounds = !isTableLike || verticalAlign === 'top' || verticalAlign === 'bottom';
            if (allowOverflowBounds) {
              if (isTextShape && verticalAlign !== 'middle') {
                updateBoundsForOverflowHiddenText(bounds, x, y, geo.height, style);
              } else if (!isTextShape && (style.html as string | undefined) === '1') {
                const spacingTop = parseFloat(style.spacingTop as string) || 0;
                if (spacingTop >= 0) {
                  updateBoundsForOverflowHiddenText(bounds, x, y, geo.height, style);
                }
              }
            }
          }

        }
      } else if (cell.edge) {
        const result = this.renderEdge(cell, cellMap, cellKey);
        if (result) {
          // Store edge points for calculating child label positions
          if (cellKey) {
            this.edgePathPoints.set(cellKey, result.edgePathPoints || result.boundPoints);
          }
          if (this.builder && cellKey) {
            this.edgeJumpPoints.set(cellKey, result.edgePathPoints || result.boundPoints);
          }

          // Update bounds from edge
          const style = cell.style;
          const shapeName = style.shape as string | undefined;
          const isWedgeArrowEdge = shapeName === 'mxgraph.arrows2.wedgeArrow'
            || shapeName === 'mxgraph.arrows2.wedgeArrowDashed'
            || shapeName === 'mxgraph.arrows2.wedgeArrowDashed2';
          const boundsStyle = isWedgeArrowEdge
            ? { ...style, startArrow: 'none', endArrow: 'none' }
            : style;
          updateBoundsForEdge(bounds, result.boundPoints, boundsStyle);

          // Include edge label bounds - use measureText for accurate measurement
          if (cell.value && result.labelPosition) {
            // Use actual label position from renderEdge
            const labelX = result.labelPosition.x;
            const labelY = result.labelPosition.y;

            const bounds = measureTextBoundsAtPosition(cell.value, style, labelX, labelY, 11);
            updateBounds(bounds.minX, bounds.minY);
            updateBounds(bounds.maxX, bounds.maxY);
          }
        }
        
        // Render edge's child vertices (like UML relationship labels: source/target/center labels)
        // These are vertex cells with parent pointing to this edge
        if (children.length > 0) {
          // DOM: If builder exists, get the edge group and prepare for children
          let savedGroup: Element | null = null;
          if (this.builder && this.currentGroup) {
            const lastChild = this.currentGroup.lastChild as Element;
            if (lastChild && lastChild.getAttribute && lastChild.getAttribute('data-cell-id') === cellKey) {
              savedGroup = this.currentGroup;
              this.currentGroup = lastChild;
            }
          }
          
          // Render children - containers first for structure, then vertices/edges in original order
          childContainers.forEach(c => renderCellRecursive(c));
          // Render vertices and edges in original XML order
          const verticesAndEdges = children.filter(c => c.vertex || c.edge || (!c.vertex && !c.edge && c.geometry));
          verticesAndEdges.forEach(c => renderCellRecursive(c));
          
          // DOM: Restore currentGroup
          if (savedGroup) {
            this.currentGroup = savedGroup;
          }
        }
      } else {
        // Container cell (root/layer) - render as <g> wrapper with children inside
        
        // DOM: Create container group and push as currentGroup
        let containerGroup: Element | null = null;
        if (this.builder && this.currentGroup && cellKey) {
          containerGroup = this.builder.createGroup();
          containerGroup!.setAttribute('data-cell-id', cellKey);
          this.currentGroup.appendChild(containerGroup!);
          this.groupStack.push(this.currentGroup);
          this.currentGroup = containerGroup;
        }
        
        // Render children - containers first for structure, then vertices/edges in original order
        childContainers.forEach(c => renderCellRecursive(c));
        // Render vertices and edges in original XML order
        const verticesAndEdges = children.filter(c => c.vertex || c.edge || (!c.vertex && !c.edge && c.geometry));
        verticesAndEdges.forEach(c => renderCellRecursive(c));
        
        // DOM: Pop container group
        if (containerGroup) {
          this.currentGroup = this.groupStack.pop() || null;
        }
      }
    };

    // Find root cells (no parent or parent not in cellMap)
    const rootCells = cells.filter(c => !c.parent || c.parent === '' || !cellMap.has(c.parent));
    
    // Render from roots
    rootCells.forEach(c => renderCellRecursive(c));
    
    return { bounds: finalizeBounds(bounds) };
  }

  /**
   * Get stencil shape from bundle (JSON format) or inline stencil
   */
  private getStencilShape(shape: string): StencilShape | null {
    // Handle inline stencil: shape=stencil(base64data)
    if (shape.startsWith('stencil(') && shape.endsWith(')')) {
      const base64data = shape.substring(8, shape.length - 1);
      const xml = decompressContent(base64data);
      if (xml) {
        return parseInlineStencil(xml);
      }
      return null;
    }
    
    if (!this.stencils) return null;
    if (!shape.startsWith('mxgraph.')) return null;
    
    const key = shape.slice('mxgraph.'.length);
    const parts = key.split('.');
    const group = parts[0];
    
    // Direct lookup with full key
    const direct = this.stencils.get(group, key);
    if (direct) return direct;
    
    // Try all groups
    const groupData = this.stencils.getGroup(group);
    if (groupData && groupData[key]) return groupData[key];
    
    // Fallback: search all groups
    const allGroups = this.stencils.groups();
    for (const g of allGroups) {
      const data = this.stencils.getGroup(g);
      if (data && data[key]) return data[key];
    }
    
    return null;
  }

  /**
   * Render stencil shape from JSON format
   */
  private renderStencilShape(ctx: ShapeContext, shape: StencilShape): void {
    if (!this.builder || !this.currentGroup) return;

    const shapeName = ctx.style.shape as string | undefined;
    
    const srcW = shape.width;
    const srcH = shape.height;
    if (!srcW || !srcH) return;

    // Calculate scaling
    let scaleX = ctx.width / srcW;
    let scaleY = ctx.height / srcH;
    const isElectricalStencil = !!(shapeName && shapeName.startsWith('mxgraph.electrical.'));
    const aspectDiff = Math.abs(scaleX - scaleY);
    const forceVariableAspect = !!shapeName && shapeName.startsWith('mxgraph.cisco19.bg');
    const fixedAspect = !forceVariableAspect && (
      shape.aspect === 'fixed' ||
      (ctx.style.aspect as string) === 'fixed' ||
      (ctx.style.imageAspect as string) === '1' ||
      (isElectricalStencil && aspectDiff <= 0.05)
    );

    let extraX = 0;
    let extraY = 0;
    if (fixedAspect) {
      const scale = Math.min(scaleX, scaleY);
      scaleX = scale;
      scaleY = scale;
      extraX = (ctx.width - srcW * scale) / 2;
      extraY = (ctx.height - srcH * scale) / 2;
    }

    const baseX = ctx.x + extraX;
    const baseY = ctx.y + extraY;
    const scaleStroke = Math.min(scaleX, scaleY);

    // Get style colors
    // lineShape=1: freehand PerfectFreehand mode - fill uses strokeColor
    const isLineShape = ctx.style.lineShape === '1' || ctx.style.lineShape === 1 || ctx.style.lineShape === true;
    const rawFillColor = isLineShape
      ? ((ctx.style.strokeColor as string) || '#000000')
      : ((ctx.style.fillColor as string) || '#ffffff');
    const resolvedFillColor = (rawFillColor === 'default' || rawFillColor === 'inherit')
      ? (isLineShape ? '#000000' : '#ffffff') : rawFillColor;
    const normalizedFillColor = this.normalizeColor(resolvedFillColor);

    // Check for gradient fill - stencils should use gradient when gradientColor is specified
    const gradientColor = ctx.style.gradientColor as string | undefined;
    const gradientDirection = ctx.style.gradientDirection as string | undefined;
    const gradientToken = typeof gradientColor === 'string' ? gradientColor.trim().toLowerCase() : '';
    const canUseGradient = gradientColor
      && gradientToken !== 'none'
      && gradientToken !== 'inherit'
      && gradientToken !== 'default'
      && resolvedFillColor !== 'none';

    let styleFill: string;
    if (canUseGradient) {
      // Create gradient and use its URL reference
      const startId = normalizeColorId(resolvedFillColor);
      const endId = normalizeColorId(gradientColor as string);
      const gradientDirectionKey = getGradientDirectionKey(gradientDirection);
      const gradientId = `mx-gradient-${startId}-1-${endId}-1-${gradientDirectionKey}-0`;
      const gradientStartColor = normalizedFillColor;
      const gradientEndColor = this.normalizeColor(gradientColor as string);
      this.ensureLinearGradient(gradientId, gradientStartColor, gradientEndColor, gradientDirectionKey);
      styleFill = `url(#${gradientId})`;
    } else {
      styleFill = normalizedFillColor;
    }

    const rawStrokeColor = (ctx.style.strokeColor as string) || '#000000';
    const resolvedStrokeColor = (rawStrokeColor === 'default' || rawStrokeColor === 'inherit')
      ? '#000000' : rawStrokeColor;
    const styleStroke = this.normalizeColor(resolvedStrokeColor);
    const styleFontColor = this.normalizeColor((ctx.style.fontColor as string) || '#000000');

    // Opacity: Use builder's current alpha if available, else fall back to style opacity
    // This allows shape handlers to call builder.setAlpha() before rendering stencils
    const builderAlpha = this.builder.getAlpha?.();
    const rawOpacity = parseFloat(ctx.style.opacity as string);
    const styleOpacity = Number.isFinite(rawOpacity) ? rawOpacity / 100 : 1;
    // If builder has a non-default alpha set (not 1), use it; otherwise use style opacity
    const effectiveBaseOpacity = (builderAlpha !== undefined && builderAlpha !== 1) ? builderAlpha : styleOpacity;

    // Helper to resolve color token
    const resolveColor = (color: string, defaultVal?: string, type: 'fill' | 'stroke' | 'font' = 'fill'): string => {
      if (color === 'none' || color === 'transparent') return 'none';
      if (color === 'fillColor' || color === 'fill') return styleFill;
      if (color === 'strokeColor' || color === 'stroke') return styleStroke;
      if (color === 'fontColor') return styleFontColor;
      // currentColor: resolve to the current fill/stroke color based on context
      // In stencil context, currentColor means "use the current state's color"
      if (color === 'currentColor') {
        if (type === 'fill') return state.fillColor;
        if (type === 'stroke') return state.strokeColor;
        return state.fontColor;
      }
      // fillColor2-8
      const fillMatch = color.match(/^fillColor([2-8])$/);
      if (fillMatch) {
        const styleVal = ctx.style[`fillColor${fillMatch[1]}` as keyof typeof ctx.style] as string | undefined;
        return styleVal ? this.normalizeColor(styleVal) : (defaultVal ? this.normalizeColor(defaultVal) : styleFill);
      }
      // strokeColor2-5
      const strokeMatch = color.match(/^strokeColor([2-5])$/);
      if (strokeMatch) {
        const styleVal = ctx.style[`strokeColor${strokeMatch[1]}` as keyof typeof ctx.style] as string | undefined;
        return styleVal ? this.normalizeColor(styleVal) : (defaultVal ? this.normalizeColor(defaultVal) : styleStroke);
      }
      // fontColor2-3
      const fontMatch = color.match(/^fontColor([2-3])$/);
      if (fontMatch) {
        const styleVal = ctx.style[`fontColor${fontMatch[1]}` as keyof typeof ctx.style] as string | undefined;
        return styleVal ? this.normalizeColor(styleVal) : (defaultVal ? this.normalizeColor(defaultVal) : styleFontColor);
      }
      // Hex or other color
      if (color.startsWith('#') || color.startsWith('rgb')) {
        return this.normalizeColor(color);
      }
      // Custom style property as color token (e.g., 'neutralFill')
      // Per mxStencil.js getColorValue: look up in style, if not found return none (null -> fill=none)
      const customStyleVal = ctx.style[color as keyof typeof ctx.style] as string | undefined;
      if (customStyleVal) {
        return this.normalizeColor(customStyleVal);
      }
      // If custom style not found, use default if provided, otherwise 'none' (mimics draw.io behavior)
      return defaultVal ? this.normalizeColor(defaultVal) : 'none';
    };

    // Transform point
    const transformPoint = (x: number, y: number): { x: number; y: number } => {
      return { x: baseX + x * scaleX, y: baseY + y * scaleY };
    };

    // Transform path commands to SVG d string
    // Arc commands are converted to cubic bezier for consistent rendering with draw.io
    const buildPathD = (commands: PathCmd[]): string => {
      const parts: string[] = [];
      // Track current point in source coordinates (before transform)
      let cx = 0, cy = 0;
      // Track start point for Z command
      let sx = 0, sy = 0;
      
      for (const cmd of commands) {
        switch (cmd[0]) {
          case 'M': {
            const pt = transformPoint(cmd[1], cmd[2]);
            parts.push(`M ${pt.x} ${pt.y}`);
            cx = cmd[1];
            cy = cmd[2];
            sx = cmd[1];
            sy = cmd[2];
            break;
          }
          case 'L': {
            const pt = transformPoint(cmd[1], cmd[2]);
            parts.push(`L ${pt.x} ${pt.y}`);
            cx = cmd[1];
            cy = cmd[2];
            break;
          }
          case 'C': {
            const p1 = transformPoint(cmd[1], cmd[2]);
            const p2 = transformPoint(cmd[3], cmd[4]);
            const p3 = transformPoint(cmd[5], cmd[6]);
            parts.push(`C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`);
            cx = cmd[5];
            cy = cmd[6];
            break;
          }
          case 'Q': {
            const p1 = transformPoint(cmd[1], cmd[2]);
            const p2 = transformPoint(cmd[3], cmd[4]);
            parts.push(`Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`);
            cx = cmd[3];
            cy = cmd[4];
            break;
          }
          case 'A': {
            // Arc: rx, ry, rotation, largeArc, sweep, x, y
            // Convert to cubic bezier curves for consistent rendering with draw.io
            const rx = cmd[1] * scaleX;
            const ry = cmd[2] * scaleY;
            const rotation = cmd[3];
            const largeArc = cmd[4];
            const sweep = cmd[5];
            const destX = cmd[6];
            const destY = cmd[7];
            
            // Transform current point and destination
            const currPt = transformPoint(cx, cy);
            const destPt = transformPoint(destX, destY);
            
            // Convert arc to bezier curves
            const curves = arcToCurves(
              currPt.x, currPt.y,
              rx, ry,
              rotation,
              largeArc,
              sweep,
              destPt.x, destPt.y
            );
            
            if (curves && curves.length) {
              // curves is array of [cp1x, cp1y, cp2x, cp2y, endx, endy, ...]
              for (let ci = 0; ci < curves.length; ci += 6) {
                parts.push(`C ${curves[ci]} ${curves[ci + 1]} ${curves[ci + 2]} ${curves[ci + 3]} ${curves[ci + 4]} ${curves[ci + 5]}`);
              }
            } else {
              // Fallback to line if arc conversion fails
              parts.push(`L ${destPt.x} ${destPt.y}`);
            }
            
            cx = destX;
            cy = destY;
            break;
          }
          case 'Z':
            parts.push('Z');
            cx = sx;
            cy = sy;
            break;
        }
      }
      return parts.join(' ');
    };

    // Rendering state
    type RenderState = {
      fillColor: string;
      strokeColor: string;
      strokeWidth: number;
      fillAlpha: number;
      strokeAlpha: number;
      alpha: number;
      dashed: boolean;
      dashPattern?: string;
      lineJoin?: string;
      lineCap?: string;
      miterLimit?: number;
      fontFamily: string;
      fontSize: number;
      fontStyle: number;
      fontColor: string;
    };

    // Per mxStencil.js drawShape():
    // - When strokewidth == 'inherit': use cell's strokeWidth directly (NO scaling)
    // - When strokewidth is a number (or default 1): use that number * minScale (WITH scaling)
    const strokeWidthInherit = shape.strokeWidth === 'inherit';
    // When shape.strokeWidth is undefined, treat it as default value 1 (per mxStencil.js line 314-315)
    const stencilStrokeWidth = typeof shape.strokeWidth === 'number' ? shape.strokeWidth : 1;
    const initialStrokeWidth = strokeWidthInherit
      ? (parseFloat(ctx.style.strokeWidth as string) || 1)
      : stencilStrokeWidth * scaleStroke;

    const createInitialState = (): RenderState => ({
      fillColor: styleFill,
      strokeColor: styleStroke,
      strokeWidth: initialStrokeWidth,
      fillAlpha: 1,
      strokeAlpha: 1,
      alpha: effectiveBaseOpacity,
      dashed: false,
      fontFamily: (ctx.style.fontFamily as string) || 'Helvetica',
      // draw.io uses DEFAULT_FONTSIZE = 11 (see mxConstants.js)
      fontSize: 11,
      fontStyle: 0,
      fontColor: styleFontColor,
    });

    let state = createInitialState();
    const stateStack: RenderState[] = [];

    type PendingShape =
      | { type: 'path'; d: string }
      | { type: 'rect'; x: number; y: number; w: number; h: number; rx?: number }
      | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
      | { type: 'text'; x: number; y: number; str: string; align: string; valign: string };

    let pending: PendingShape | null = null;

    const flushPending = (paint: 'fillStroke' | 'stroke' | 'fill'): void => {
      if (!pending || !this.builder) return;

      const effectiveAlpha = state.alpha;
      const attrs: Record<string, string | number> = {};

      if (paint === 'fillStroke' || paint === 'fill') {
        attrs.fill = state.fillColor;
        const fillOp = state.fillAlpha * effectiveAlpha;
        // Skip fill-opacity when fill is 'none' (no visual effect, matches draw.io behavior)
        if (fillOp !== 1 && state.fillColor !== 'none') attrs['fill-opacity'] = fillOp;
      } else {
        attrs.fill = 'none';
      }

      if (paint === 'fillStroke' || paint === 'stroke') {
        attrs.stroke = state.strokeColor;
        // strokeWidth is already correctly set in initialStrokeWidth:
        // - 'inherit': cell's strokeWidth (no scaling)
        // - number: shape's strokeWidth * scaleStroke (pre-scaled)
        // So we just use state.strokeWidth directly here
        attrs['stroke-width'] = state.strokeWidth;
        const strokeOp = state.strokeAlpha * effectiveAlpha;
        if (strokeOp !== 1) attrs['stroke-opacity'] = strokeOp;
        if (state.dashed) {
          // Per mxSvgCanvas2D.createDashPattern: scale factor is (fixDash ? 1 : strokeWidth) * state.scale
          // In stencil rendering: fixDash defaults to false, state.scale is 1
          // So dash scale factor = strokeWidth * 1 = strokeWidth (the current rendered strokeWidth)
          const rawPattern = state.dashPattern || '3 3';
          const dashScale = state.strokeWidth;
          const scaledPattern = rawPattern
            .split(' ')
            .map((v) => {
              const num = parseFloat(v);
              return Number.isFinite(num) ? String(Math.round(num * dashScale * 100) / 100) : v;
            })
            .join(' ');
          attrs['stroke-dasharray'] = scaledPattern;
        }
        if (state.lineJoin) attrs['stroke-linejoin'] = state.lineJoin;
        if (state.lineCap) attrs['stroke-linecap'] = state.lineCap;
        if (state.miterLimit !== undefined) attrs['stroke-miterlimit'] = state.miterLimit;
      } else {
        attrs.stroke = 'none';
      }

      let el: Element;
      switch (pending.type) {
        case 'path':
          el = this.builder.createPath(pending.d, attrs);
          break;
        case 'rect':
          if (pending.rx) attrs.rx = pending.rx;
          el = this.builder.createRect(pending.x, pending.y, pending.w, pending.h, attrs);
          break;
        case 'ellipse':
          el = this.builder.createEllipse(pending.cx, pending.cy, pending.rx, pending.ry, attrs);
          break;
        case 'text': {
          let textY = pending.y;
          const fontSize = state.fontSize * scaleStroke;
          // SVG text baseline is at y, so we need to adjust for vertical alignment
          // Based on draw.io's mxSvgCanvas2D.js plainText function:
          // Initial: cy = y + size - 1
          // For stencil text (single line, no overflow/clip):
          // - top: cy = y + size - 1 (no further adjustment)
          // - middle: cy = y + size - 1 - textHeight/2 = y + fontSize/2 - 1
          // - bottom: cy = y + size - 1 - textHeight - 1 = y - 2
          if (pending.valign === 'middle') {
            textY += fontSize / 2 - 1;
          } else if (pending.valign === 'top') {
            textY += fontSize - 1;
          } else if (pending.valign === 'bottom') {
            textY -= 2;
          }
          const textAttrs: Record<string, string | number> = {
            x: pending.x,
            y: textY,
            fill: state.fontColor,
            'font-family': state.fontFamily,
            'font-size': fontSize,
          };
          if (pending.align === 'center') textAttrs['text-anchor'] = 'middle';
          else if (pending.align === 'right') textAttrs['text-anchor'] = 'end';
          if (state.fontStyle & 1) textAttrs['font-weight'] = 'bold';
          if (state.fontStyle & 2) textAttrs['font-style'] = 'italic';
          if (effectiveAlpha !== 1) textAttrs['opacity'] = effectiveAlpha;

          el = this.builder.doc.createElementNS('http://www.w3.org/2000/svg', 'text');
          for (const [k, v] of Object.entries(textAttrs)) {
            el.setAttribute(k, String(v));
          }
          el.textContent = pending.str;
          break;
        }
        default:
          return;
      }

      g.appendChild(el);
      pending = null;
    };

    const processOp = (op: DrawOp): void => {
      if (typeof op === 'string') {
        switch (op) {
          case 'save':
            stateStack.push({ ...state });
            break;
          case 'restore':
            state = stateStack.pop() ?? createInitialState();
            break;
          case 'fill':
            flushPending('fill');
            break;
          case 'stroke':
            flushPending('stroke');
            break;
          case 'fillStroke':
            flushPending('fillStroke');
            break;
        }
        return;
      }

      // Object operations
      if ('path' in op) {
        pending = { type: 'path', d: buildPathD(op.path) };
      } else if ('rect' in op) {
        const [x, y, w, h] = op.rect;
        const pt = transformPoint(x, y);
        pending = { type: 'rect', x: pt.x, y: pt.y, w: w * scaleX, h: h * scaleY };
      } else if ('roundRect' in op) {
        const [x, y, w, h, arcSize] = op.roundRect;
        const pt = transformPoint(x, y);
        const r = Math.min(w, h) * (arcSize / 100) / 2 * Math.min(scaleX, scaleY);
        pending = { type: 'rect', x: pt.x, y: pt.y, w: w * scaleX, h: h * scaleY, rx: r };
      } else if ('ellipse' in op) {
        const [x, y, w, h] = op.ellipse;
        const cx = x + w / 2;
        const cy = y + h / 2;
        const pt = transformPoint(cx, cy);
        pending = { type: 'ellipse', cx: pt.x, cy: pt.y, rx: w / 2 * scaleX, ry: h / 2 * scaleY };
      } else if ('text' in op) {
        const pt = transformPoint(op.text.x, op.text.y);
        pending = { type: 'text', x: pt.x, y: pt.y, str: op.text.str, align: op.text.align || 'left', valign: op.text.valign || 'top' };
        flushPending('fill');
      } else if ('fillColor' in op) {
        state.fillColor = resolveColor(op.fillColor, op.default, 'fill');
      } else if ('strokeColor' in op) {
        state.strokeColor = resolveColor(op.strokeColor, op.default, 'stroke');
      } else if ('strokeWidth' in op) {
        // Per mxStencil.js: internal strokewidth operations should be scaled by minScale
        // (unless fixed=1, which V2 format currently doesn't support)
        state.strokeWidth = op.strokeWidth * scaleStroke;
      } else if ('alpha' in op) {
        state.alpha = op.alpha * styleOpacity;
      } else if ('fillAlpha' in op) {
        state.fillAlpha = op.fillAlpha;
      } else if ('strokeAlpha' in op) {
        state.strokeAlpha = op.strokeAlpha;
      } else if ('dashed' in op) {
        state.dashed = op.dashed;
        // Apply custom dashpattern only when "pattern" attribute was used in stencil XML
        // (mxStencil.js only reads "pattern" attr, ignores "dash" attr - see stencil/xml.ts)
        // Per mxStencil.js: dashpattern values are scaled by minScale = Math.min(aspect.width, aspect.height)
        if ('pattern' in op && op.pattern) {
          state.dashPattern = op.pattern
            .split(' ')
            .map((v: string) => {
              const num = parseFloat(v);
              return Number.isFinite(num) ? String(Math.round(num * scaleStroke * 100) / 100) : v;
            })
            .join(' ');
        }
      } else if ('lineJoin' in op) {
        state.lineJoin = op.lineJoin;
      } else if ('lineCap' in op) {
        state.lineCap = op.lineCap;
      } else if ('miterLimit' in op) {
        state.miterLimit = op.miterLimit;
      } else if ('fontFamily' in op) {
        state.fontFamily = op.fontFamily;
      } else if ('fontSize' in op) {
        state.fontSize = op.fontSize;
      } else if ('fontStyle' in op) {
        state.fontStyle = op.fontStyle;
      } else if ('fontColor' in op) {
        state.fontColor = resolveColor(op.fontColor, op.default, 'font');
      }
    };

    // Create group
    const g = this.builder.createGroup();

    // Add pointer-events rect if pointerEvents=1 in style
    // Per mxStencil.js: Only draw when STYLE_POINTER_EVENTS == '1' (default is '0' for stencils)
    const pointerEvents = ctx.style.pointerEvents as string | undefined;
    if (pointerEvents === '1' || pointerEvents === 1 as unknown as string) {
      const rectEl = this.builder.createRect(ctx.x, ctx.y, ctx.width, ctx.height, {
        fill: 'none',
        stroke: 'none',
        'pointer-events': 'all'
      });
      g.appendChild(rectEl);
    }

    // Process background
    if (shape.background) {
      for (const op of shape.background) {
        processOp(op);
      }
    }

    // Process foreground
    for (const op of shape.foreground) {
      processOp(op);
    }

    this.currentGroup.appendChild(g);
  }

  /**
   * Get absolute position of a cell (considering parent hierarchy)
   */
  private getAbsolutePosition(cell: MxCell, cellMap: Map<string, MxCell>): { x: number, y: number } {
    return getAbsolutePositionHelper(cell, cellMap, this.edgePathPoints);
  }

  private hasCollapsedAncestor(cell: MxCell, cellMap: Map<string, MxCell>): boolean {
    let parentId = cell.parent;
    while (parentId && parentId !== '0' && parentId !== '1') {
      const parent = cellMap.get(parentId);
      if (!parent) break;
      if (parent.collapsed === true) return true;
      parentId = parent.parent;
    }
    return false;
  }

  /**
   * Render a vertex (shape)
   */
  private renderVertex(
    cell: MxCell, 
    cellMap: Map<string, MxCell>,
    cellKey?: string
  ): void {
    const geo = cell.geometry;
    
    // Use provided cellKey or fall back to cell.id for data-cell-id attribute
    const dataCellId = cellKey || cell.id;

    // If no geometry, skip rendering (root/layer containers are added separately in renderDiagram)
    if (!geo) {
      return;
    }

    if (this.hasCollapsedAncestor(cell, cellMap)) {
      return;
    }

    const style = cell.style;
    // Apply default fontSize if not set (the platform UI uses 12 as default for vertices)
    if (style.fontSize === undefined) {
      style.fontSize = 12;
    }
    const edgeChildLabel = isEdgeChildLabel(cell, cellMap);
    const skipPlaceholderShape = shouldSkipPlaceholderShapeHelper(geo, Boolean(cell.value), edgeChildLabel);

    // Get absolute position considering parent hierarchy
    const absPos = this.getAbsolutePosition(cell, cellMap);
    
    // Apply offset during rendering (not post-process)
    // BUT: if this is an edge child label, absPos already includes offset from edgePathPoints
    let x = edgeChildLabel ? absPos.x : absPos.x + this.offsetX;
    let y = edgeChildLabel ? absPos.y : absPos.y + this.offsetY;
    
    let { width, height } = geo;

    const shape = style.shape as string | undefined;
    const shouldSkipEdgeShapeRendering = !!shape && VERTEX_EDGE_SHAPE_SKIP.has(shape);

    // Special case: mxgraph.arrows2.arrow renders with swapped dimensions in the platform
    const swapped = applyArrow2Swap({ x, y, width, height });
    x = swapped.x;
    y = swapped.y;
    width = swapped.width;
    height = swapped.height;

    // Parse style attributes using helper (pass cell and cellMap to resolve fillColor=swimlane)
    const attrs = this.parseShapeAttrs(style, cell, cellMap);
    let handlerAttrs = attrs;
    let handlerStyle = style;
    // WORKAROUND: pid2misc.column valve/bubble type needs dashed='1' passed to Handler
    // so it doesn't restore to solid line after drawing separator lines.
    // Column valve/bubble types use dashed lines in exported SVG
    const columnType = style.columnType as string | undefined;
    if (shape === 'mxgraph.pid2misc.column' && (columnType === 'valve' || columnType === 'bubble')) {
      handlerStyle = { ...style, dashed: '1' } as MxStyle;
      handlerAttrs = { ...attrs, dashed: false, dashPattern: undefined };
    }

    // Use paint bounds for north/south direction
    const paintBounds = computePaintBounds({ x, y, width, height }, style);

    // Create shape context for painting
    const ctx: ShapeContext = { x: paintBounds.x, y: paintBounds.y, width: paintBounds.width, height: paintBounds.height, style };

    // Get label overrides from shape handler (e.g., defaultStartSize for swimlane)
    const labelOverrides = this.getLabelOverridesForShape(shape);

    const buildLabelParams = (baseX: number, baseY: number, baseW: number, baseH: number) => {
      return { cell, shape, x: baseX, y: baseY, width: baseW, height: baseH, style, labelOverrides };
    };

    // DOM: Create cell group and set as current rendering target
    let cellGroup: Element | null = null;
    if (this.builder) {
      const dataShape = shape && this.getStencilShape(shape) ? shape : undefined;
      cellGroup = createCellGroupHelper(this.builder, dataCellId, dataShape, (g) => this.pushGroup(g));
    }

    const link = style.link as string | undefined;
    const { popLinkWrapper } = createLinkWrapperHelper(
      {
        builder: this.builder,
        currentGroup: this.currentGroup,
        pushGroup: (g) => this.pushGroup(g),
        popGroup: () => this.popGroup()
      },
      link
    );

    // Placeholder containers should render as empty groups (no shapes)
    if (skipPlaceholderShape) {
      popLinkWrapper();
      if (this.builder) this.popGroup();
      return;
    }

    const isGroup = style.group === '1' || style.group === true;
    // Check if group has visual elements (fillColor/strokeColor='none' is not visual)
    const hasFillColor = style.fillColor && style.fillColor !== 'none';
    const hasStrokeColor = style.strokeColor && style.strokeColor !== 'none';
    const hasGroupVisual = Boolean(
      style.shape ||
      hasFillColor ||
      hasStrokeColor ||
      style.rounded === '1' ||
      style.rounded === true ||
      style.shadow === '1' ||
      style.shadow === true
    );
    if (isGroup && !cell.value && !hasGroupVisual) {
      popLinkWrapper();
      if (this.builder) this.popGroup();
      return;
    }
    
    // Special handling for edge child labels (width=0, height=0)
    // There are two types:
    // 1. Source/target labels (html!="1"): render as pure SVG text without foreignObject
    // 2. Center labels (html="1"): render as foreignObject with width=1px, height=1px layout
    if (edgeChildLabel && width === 0 && height === 0) {
      renderEdgeChildLabel(
        this.getTextRenderContext(),
        { value: cell.value, x, y, width, height, style }
      );
      popLinkWrapper();
      if (this.builder) this.popGroup();
      return;
    }

    // Handle special style-based shapes (line and text)
    // These are indicated by style.line=true or style.text=true, not shape property
    const isLineShape = isLineShapeHelper(style);
    const lineStrokeWidth = getLineStrokeWidthHelper(isLineShape, style, attrs.strokeWidth);

    // Prepare geometry group (the platform uses per-shape translate(0.5,0.5) for odd stroke widths)
    let geometryGroup: Element | null = null;
    const isTextShape = style.text === true || style.text === '1' || style.shape === 'text';
    const isZeroSizeTextShape = isTextShape && width === 0 && height === 0;
    let useCrispTranslate = this.shouldApplyCrispTranslateForShape(
      lineStrokeWidth,
      shape,
      attrs.strokeColor,
      isTextShape,
      isLineShape
    );
    if (isZeroSizeTextShape) {
      useCrispTranslate = false;
    }
    if (this.builder) {
      geometryGroup = createGeometryGroupHelper(this.builder, useCrispTranslate, (g) => this.pushGroup(g));
    }
    if (isLineShape) {
      renderLineSeparator(
        { builder: this.builder, currentGroup: this.currentGroup },
        { x, y, width, height, style, attrs, strokeWidth: lineStrokeWidth }
      );
      this.applyShapeTransforms(ctx);
      
      // Pop geometry group and cell group, then return
      if (this.builder && geometryGroup) this.popGroup();
      renderVertexLabel(
        {
          renderLabel: this.renderLabel.bind(this),
          renderSwimlaneLabel: this.renderSwimlaneLabel.bind(this),
        },
        buildLabelParams(x, y, width, height)
      );
      popLinkWrapper();
      if (this.builder) this.popGroup();
      return;
    }

    // Group containers without visual styling should render label only
    if (isGroup && !hasGroupVisual) {
      // Pop geometry group before rendering labels
      if (this.builder && geometryGroup) {
        this.popGroup();
      }

      renderVertexLabel(
        {
          renderLabel: this.renderLabel.bind(this),
          renderSwimlaneLabel: this.renderSwimlaneLabel.bind(this),
        },
        buildLabelParams(x, y, width, height)
      );

      popLinkWrapper();
      if (this.builder) {
        this.popGroup();
      }
      return;
    }

    // UML class diagram text rows: style.text=true + overflow=hidden (no html=1)
    // These render as native SVG text with clipPath for overflow
    // Regular text shapes have html=1 and should go through normal rendering
    const isOverflowTextCell = isOverflowTextCellHelper(style);
    const isStackLayoutChild = (() => {
      if (!cellMap || !cell.parent) return false;
      const parent = cellMap.get(cell.parent);
      if (!parent || !parent.style) return false;
      const parentStyle = parent.style;
      const isSwimlane = parentStyle.swimlane === true || parentStyle.shape === 'swimlane';
      return isSwimlane && parentStyle.childLayout === 'stackLayout';
    })();
    if (isOverflowTextCell && isStackLayoutChild) {
      renderOverflowTextCell(
        this.getTextRenderContext(),
        { value: cell.value || '', x, y, width, height, style },
        () => {
          if (this.builder && geometryGroup) this.popGroup();
        }
      );
      popLinkWrapper();
      if (this.builder) this.popGroup();
      return;
    }
    const hasRounded = style.rounded === '1' || style.rounded === true;
    const hasShadow = style.shadow === '1' || style.shadow === true;
    const hasFill = style.fillColor !== undefined && style.fillColor !== 'none';
    const hasStroke = style.strokeColor !== undefined && style.strokeColor !== 'none';
    const skipGroupShape = (isGroup || shape === 'group') && !cell.value && !hasRounded && !hasShadow && !hasFill && !hasStroke;
    const pointerEventsValue = style.pointerEvents as string | number | undefined;
    const isNonInteractiveTextShape =
      isTextShape &&
      shape === 'text' &&
      (pointerEventsValue === '0' || pointerEventsValue === 0) &&
      !hasFill &&
      !hasStroke;
    const isLabelOnlyCell = width === 0 && height === 0 && Boolean(cell.value) && !shape && !isLineShape;

    if (!skipGroupShape) {
      const shouldRenderShape =
        !(isZeroSizeTextShape && (!shape || shape === 'text')) &&
        !isNonInteractiveTextShape &&
        !isLabelOnlyCell &&
        !shouldSkipEdgeShapeRendering;
      if (shouldRenderShape) {
        const handlerCtx = handlerStyle === style ? ctx : { ...ctx, style: handlerStyle };
        const handler = this.shapeRegistry.create(shape, this.createRenderContext(handlerCtx, cell, cellMap, cellGroup));
        if (handler) {
          handler.render(handlerAttrs);

          // Apply glass effect only if shape supports it
          // Only rectangle-like shapes and swimlane shapes support glass
          // Actor-based shapes (like shadedCube) don't support glass
          const glassEnabled = style.glass === '1' || style.glass === true || style.glass === 'true';
          // Use handler's supportsGlass, default to true for backward compatibility
          // (unregistered shapes behave like mxRectangleShape)
          const shapeSupportsGlass = handler.supportsGlass?.() ?? true;
          if (glassEnabled && shapeSupportsGlass) {
            this.renderGlassOverlay(ctx, attrs);
          }
        } else {
          // No handler - apply glass for default rectangle-like rendering
          const glassEnabled = style.glass === '1' || style.glass === true || style.glass === 'true';
          if (glassEnabled) {
            this.renderGlassOverlay(ctx, attrs);
          }
        }
      }
    }

    // Render inline image overlays for label-like shapes
    const rawImageUrl = typeof style.image === 'string' ? style.image : '';
    const skipInlineImage = !!rawImageUrl && typeof shape === 'string'
      && shape.startsWith('mxgraph.office.security.')
      && rawImageUrl.startsWith('img/lib/mscae/');
    if (style.image && shape !== 'image' && !skipInlineImage) {
      this.renderInlineImage(style, x, y, width, height);
    }

    // Apply post-processing transforms (shadow, rotation)
    if (!isZeroSizeTextShape) {
      this.applyShapeTransforms(ctx);
    }

    // Pop geometry group before rendering labels
    if (this.builder && geometryGroup) {
      this.popGroup();
    }

    // Edge-like vertex shapes use edge-style label positioning (center point)
    if (shouldSkipEdgeShapeRendering && cell.value) {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      this.renderEdgeLabel(cell.value, centerX, centerY, style);
    } else {
      renderVertexLabel(
        {
          renderLabel: this.renderLabel.bind(this),
          renderSwimlaneLabel: this.renderSwimlaneLabel.bind(this),
        },
        buildLabelParams(x, y, width, height)
      );
    }

    // DOM: Pop cell group
    popLinkWrapper();
    if (this.builder) {
      this.popGroup();
    }
  }

  /**
   * Render inline image for label-like shapes
   */
  private renderInlineImage(style: MxStyle, x: number, y: number, width: number, height: number): void {
    renderInlineImageHelper(
      {
        builder: this.builder,
        currentGroup: this.currentGroup,
        normalizeImageUrl,
        isPlaceholderImageUrl,
        createPlaceholderInlineSvg: this.createPlaceholderInlineSvg.bind(this)
      },
      { style, x, y, width, height }
    );
  }

  private createPlaceholderInlineSvg(x: number, y: number, width: number, height: number): Element | null {
    return createPlaceholderInlineSvg(this.builder, x, y, width, height);
  }

  /**
   * Render text label - choose between native SVG text or foreignObject based on style
   */
  private renderLabel(
    value: string,
    x: number, y: number, width: number, height: number,
    style: MxStyle
  ): void {
    renderLabelHelper(this.getTextRenderContext(), value, x, y, width, height, style);
  }

  /**
   * Render an edge label at a specific point
   * Edge labels use a different layout: width=1px, height=1px with margin-left and padding-top for positioning
   */
  private renderEdgeLabel(
    value: string,
    x: number, y: number,
    style: MxStyle
  ): void {
    renderEdgeLabelHelper(this.getTextRenderContext(), value, x, y, style);
  }

  /**
   * Render a swimlane title label
   * Uses conditional rendering like regular labels
   */
  private renderSwimlaneLabel(
    value: string,
    x: number, y: number, width: number, height: number,
    startSize: number, horizontal: boolean,
    style: MxStyle
  ): void {
    renderSwimlaneLabelHelper(this.getTextRenderContext(), value, x, y, width, height, startSize, horizontal, style);
  }

  /**
   * Render an edge (connection line)
   * 
   * Key coordinate system understanding from the platform:
   * - Edge geometry points are relative to the edge's parent cell
   * - Source/target cells have absolute positions after parent hierarchy resolution
   * - transformControlPoint converts: absolute = scale * (pt + translate + origin)
   *   where origin is the accumulated offset from parent cells
   */
  private renderEdge(
    cell: MxCell, 
    cellMap: Map<string, MxCell>,
    cellKey?: string
  ): EdgeRenderResult | null {
    const geo = cell.geometry;
    const style = cell.style;
    
    // Use provided cellKey or fall back to cell.id for data-cell-id attribute
    const dataCellId = cellKey || cell.id;

    // DOM: Create edge group
    let edgeGroup: Element | null = null;
    if (this.builder) {
      edgeGroup = this.builder.createGroup();
      edgeGroup!.setAttribute('data-cell-id', dataCellId);
      this.pushGroup(edgeGroup!);
    }

    // Get source and target cells
    const sourceCell = cell.source ? (cellMap.get(cell.source) ?? null) : null;
    const targetCell = cell.target ? (cellMap.get(cell.target) ?? null) : null;

    const resolveVisibleTerminal = (terminal: MxCell | null): MxCell | null => {
      if (!terminal) return null;
      let collapsedAncestor: MxCell | null = terminal.collapsed ? terminal : null;
      let parentId = terminal.parent;

      while (parentId && parentId !== '0' && parentId !== '1') {
        const parent = cellMap.get(parentId);
        if (!parent) break;
        if (parent.collapsed === true) {
          collapsedAncestor = parent;
        }
        parentId = parent.parent;
      }

      return collapsedAncestor ?? terminal;
    };

    const visibleSourceCell = resolveVisibleTerminal(sourceCell);
    const visibleTargetCell = resolveVisibleTerminal(targetCell);
    
    // NOTE: Don't check for sourceCell/targetCell here!
    // Standalone edges (with only sourcePoint/targetPoint) are valid and must be rendered.
    // The validation will happen later when we check for p0/pe points.

    // Calculate the edge's parent origin (accumulated offset from parent hierarchy)
    // This is equivalent to state.origin in the platform
    const edgeOrigin = getEdgeOrigin(
      { getAbsolutePosition: this.getAbsolutePosition.bind(this) },
      cell,
      cellMap,
      this.offsetX,
      this.offsetY
    );
    const edgeOriginX = edgeOrigin.x;
    const edgeOriginY = edgeOrigin.y;

    // Get source cell state (absolute position, with offset applied)
    let sourceState: CellState | null = null;
    let p0: Point | null = null; // Fixed source point (from constraint or explicit point)
    let sourceIsEdgeChildLabel = false;
    let sourceSkipPerimeter = false;

    const sourceTerminal = buildEdgeTerminal(
      {
        getAbsolutePosition: this.getAbsolutePosition.bind(this),
        isEdgeChildLabel,
        measureMultilineTextSize,
        getStencilShape: this.getStencilShape.bind(this),
        getPerimeterFn: this.getPerimeterFnForShape,
      },
      {
        terminalCell: visibleSourceCell ?? null,
        cellMap,
        edgeStyle: style,
        edgeGeometry: geo,
        edgeOrigin: { x: edgeOriginX, y: edgeOriginY },
        offsetX: this.offsetX,
        offsetY: this.offsetY,
        kind: 'source',
      }
    );
    sourceState = sourceTerminal.state;
    p0 = sourceTerminal.fixedPoint;
    sourceIsEdgeChildLabel = sourceTerminal.isEdgeChildLabel;
    sourceSkipPerimeter = sourceTerminal.skipPerimeter === true;
    
    // Get target cell state (absolute position, with offset applied)
    let targetState: CellState | null = null;
    let pe: Point | null = null; // Fixed target point (from constraint or explicit point)
    let targetIsEdgeChildLabel = false;
    let targetSkipPerimeter = false;

    const targetTerminal = buildEdgeTerminal(
      {
        getAbsolutePosition: this.getAbsolutePosition.bind(this),
        isEdgeChildLabel,
        measureMultilineTextSize,
        getStencilShape: this.getStencilShape.bind(this),
        getPerimeterFn: this.getPerimeterFnForShape,
      },
      {
        terminalCell: visibleTargetCell ?? null,
        cellMap,
        edgeStyle: style,
        edgeGeometry: geo,
        edgeOrigin: { x: edgeOriginX, y: edgeOriginY },
        offsetX: this.offsetX,
        offsetY: this.offsetY,
        kind: 'target',
      }
    );
    targetState = targetTerminal.state;
    pe = targetTerminal.fixedPoint;
    targetIsEdgeChildLabel = targetTerminal.isEdgeChildLabel;
    targetSkipPerimeter = targetTerminal.skipPerimeter === true;
    
    // Must have either source state or fixed point
    if (!sourceState && !p0) {
      if (this.builder) this.popGroup();
      return null;
    }
    if (!targetState && !pe) {
      if (this.builder) this.popGroup();
      return null;
    }

    // Get edge style parameters
    const rawEdgeStyle = style.edgeStyle as string | undefined;
    const noEdgeStyle = style.noEdgeStyle === '1' || style.noEdgeStyle === true || style.noEdgeStyle === 1;
    const edgeStyle = noEdgeStyle ? 'none' : rawEdgeStyle;
    const elbowType = style.elbow as string;

    // Transform control points from edge-relative to absolute coordinates
    // This is equivalent to transformControlPoint in the platform
    const rawControlHints: Point[] = geo?.points?.map((pt: { x: number; y: number }) => ({
      x: pt.x + edgeOriginX,
      y: pt.y + edgeOriginY
    })) || [];
    const allowHintsWithoutTerminals = !edgeStyle || edgeStyle === 'none';
    const controlHints: Point[] = rawControlHints.length > 0
      ? rawControlHints
      : (allowHintsWithoutTerminals
        ? rawControlHints
        : (sourceState && targetState ? rawControlHints : []));
    
    // Check if this is a loop edge (source === target)
    const isLoop = !!(sourceCell && targetCell && sourceCell.id === targetCell.id);
    const loopEnabled = style.loop === '1' || style.loop === true || style.loop === 1;
    const orthogonalLoop = style.orthogonalLoop === '1';
    const loopDirection = (style.direction as string) || 'west';
    
    // Check if edge is orthogonal (for perimeter point calculation)
    // Matches the platform's isOrthogonal() - these edge styles use orthogonal perimeter points
    const isOrthogonalEdge = edgeStyle === 'orthogonalEdgeStyle' ||
                 edgeStyle === 'elbowEdgeStyle' ||
                 edgeStyle === 'entityRelationEdgeStyle' ||
                 edgeStyle === 'segmentEdgeStyle' ||
                 edgeStyle === 'isometricEdgeStyle' ||
                 style.orthogonal === '1' ||
                 style.orthogonal === true;
    const forceStraightEdge = !edgeStyle || edgeStyle === 'none';
    const isIsometricEdge = edgeStyle === 'isometricEdgeStyle';
    const isOrthogonalEdgeWithConstraint = forceStraightEdge ? false : (isIsometricEdge ? false : isOrthogonalEdge);
    const exitPerimeterRaw = parseFloat(style.exitPerimeter as string);
    const entryPerimeterRaw = parseFloat(style.entryPerimeter as string);
    const useExitPerimeter = !Number.isFinite(exitPerimeterRaw) || exitPerimeterRaw !== 0;
    const useEntryPerimeter = !Number.isFinite(entryPerimeterRaw) || entryPerimeterRaw !== 0;

    const perimeterSpacingRaw = parseFloat(style.perimeterSpacing as string);
    const sourcePerimeterSpacingRaw = parseFloat(style.sourcePerimeterSpacing as string);
    const targetPerimeterSpacingRaw = parseFloat(style.targetPerimeterSpacing as string);
    const perimeterSpacing = Number.isFinite(perimeterSpacingRaw) ? perimeterSpacingRaw : 0;
    const sourcePerimeterSpacing = Number.isFinite(sourcePerimeterSpacingRaw) ? sourcePerimeterSpacingRaw : 0;
    const targetPerimeterSpacing = Number.isFinite(targetPerimeterSpacingRaw) ? targetPerimeterSpacingRaw : 0;
    const sourceBorder = perimeterSpacing + sourcePerimeterSpacing;
    const targetBorder = perimeterSpacing + targetPerimeterSpacing;

    if (p0 && sourceState && useExitPerimeter && !sourceIsEdgeChildLabel && !sourceSkipPerimeter) {
      const sourceBounds = sourceBorder !== 0
        ? { ...sourceState, x: sourceState.x - sourceBorder, y: sourceState.y - sourceBorder, width: sourceState.width + sourceBorder * 2, height: sourceState.height + sourceBorder * 2 }
        : sourceState;
      p0 = getPerimeterPoint(sourceBounds, p0, isOrthogonalEdgeWithConstraint, this.getPerimeterFnForShape);
    }
    if (pe && targetState && useEntryPerimeter && !targetIsEdgeChildLabel && !targetSkipPerimeter) {
      const targetBounds = targetBorder !== 0
        ? { ...targetState, x: targetState.x - targetBorder, y: targetState.y - targetBorder, width: targetState.width + targetBorder * 2, height: targetState.height + targetBorder * 2 }
        : targetState;
      pe = getPerimeterPoint(targetBounds, pe, isOrthogonalEdgeWithConstraint, this.getPerimeterFnForShape);
    }
    
    // ========================================================================
    // Build absolutePoints following the platform's updateEdgeState flow:
    // 1. updateFixedTerminalPoints - set p0 and pe (if fixed)
    // 2. updatePoints - call router, fill in middle points
    // 3. updateFloatingTerminalPoints - calculate floating endpoints
    // ========================================================================
    
    // Initialize absolutePoints with fixed terminal points (may be null for floating)
    const absolutePoints: (Point | null)[] = [p0, pe];
    
    const {
      startArrow,
      endArrow,
      startFill,
      endFill,
      startSize,
      endSize,
      sourceBuffer,
      targetBuffer,
    } = getEdgeArrowConfig(style);

    let routingSourceBuffer = sourceBuffer;
    let routingTargetBuffer = targetBuffer;

    // Call router to get waypoints and insert them between endpoints
    // Router output goes between absolutePoints[0] and absolutePoints[n-1]
    let routingP0 = p0;
    let routingPe = pe;
    if (edgeStyle === 'elbowEdgeStyle' && controlHints.length === 0) {
      const sourceThin = !!sourceState && Math.min(sourceState.width, sourceState.height) <= 12;
      const targetThin = !!targetState && Math.min(targetState.width, targetState.height) <= 12;
      const shouldAlign = sourceThin || targetThin;
      if (!shouldAlign) {
        // Skip alignment optimization for normal-sized terminals
        // to avoid altering default elbow routing.
      } else {
      const alignmentTol = 0.5;
      if (!routingP0 && sourceState && routingPe) {
        const candidateP0 = getPerimeterPoint(sourceState, routingPe, isOrthogonalEdgeWithConstraint, this.getPerimeterFnForShape);
        const aligned = Math.abs(candidateP0.x - routingPe.x) <= alignmentTol
          || Math.abs(candidateP0.y - routingPe.y) <= alignmentTol;
        if (aligned) {
          routingP0 = candidateP0;
        }
      }
      if (!routingPe && targetState && routingP0) {
        const candidatePe = getPerimeterPoint(targetState, routingP0, isOrthogonalEdgeWithConstraint, this.getPerimeterFnForShape);
        const aligned = Math.abs(candidatePe.x - routingP0.x) <= alignmentTol
          || Math.abs(candidatePe.y - routingP0.y) <= alignmentTol;
        if (aligned) {
          routingPe = candidatePe;
        }
      }
      }
    }

    const routerPoints = getRouterPoints({
      style,
      edgeStyle,
      elbowType,
      sourceState,
      targetState,
      p0: routingP0,
      pe: routingPe,
      controlHints,
      isLoop,
      loopEnabled,
      orthogonalLoop,
      loopDirection,
      sourceBuffer: routingSourceBuffer,
      targetBuffer: routingTargetBuffer,
    });

    // Insert router points between start and end
    // absolutePoints = [p0, ...routerPoints, pe]
    absolutePoints.splice(1, 0, ...routerPoints);
    
    // ========================================================================
    // updateFloatingTerminalPoints - calculate perimeter points for floating endpoints
    // the platform processes target first, then source
    // ========================================================================
    
    resolveFloatingEndpoints({
      absolutePoints,
      sourceState,
      targetState,
      isOrthogonalEdge: isOrthogonalEdgeWithConstraint,
      style,
      sourceIsEdgeChildLabel,
      targetIsEdgeChildLabel,
      getPerimeterPoint,
      getPerimeterFn: this.getPerimeterFnForShape,
    });
    
    // Validate: both endpoints must be non-null
    const allPoints = finalizeAbsolutePoints(absolutePoints);
    if (!allPoints) {
      if (this.builder) this.popGroup();
      return null;
    }

    if (edgeStyle === 'orthogonalEdgeStyle' && allPoints.length === 2) {
      const first = allPoints[0];
      const last = allPoints[1];
      const dx = Math.abs(first.x - last.x);
      const dy = Math.abs(first.y - last.y);
      if (dx > 1e-6 && dy > 1e-6) {
        const mid = dx >= dy
          ? { x: last.x, y: first.y }
          : { x: first.x, y: last.y };
        allPoints.splice(1, 0, mid);
      }
    }


    if (edgeStyle === 'elbowEdgeStyle' && controlHints.length === 0 && allPoints.length >= 2) {
      const sourceThin = !!sourceState && Math.min(sourceState.width, sourceState.height) <= 12;
      const targetThin = !!targetState && Math.min(targetState.width, targetState.height) <= 12;
      if (sourceThin || targetThin) {
        const snapTol = 2;
        const first = allPoints[0];
        const last = allPoints[allPoints.length - 1];
        if (Math.abs(first.x - last.x) <= snapTol) {
          last.x = first.x;
        } else if (Math.abs(first.y - last.y) <= snapTol) {
          last.y = first.y;
        }
      }
    }


    let linePoints = allPoints.filter((pt, index) => {
      if (index === 0) return true;
      const prev = allPoints[index - 1];
      return Math.abs(prev.x - pt.x) > 1e-6 || Math.abs(prev.y - pt.y) > 1e-6;
    });
    if (isLoop && !loopEnabled && rawControlHints.length === 0) {
      const first = linePoints[0];
      const last = linePoints[linePoints.length - 1];
      const hasDistinctEndpoints = linePoints.length > 1
        && (Math.abs(first.x - last.x) > 1e-6 || Math.abs(first.y - last.y) > 1e-6);
      if (!hasDistinctEndpoints) {
        if (this.builder) this.popGroup();
        return null;
      }
    }
    const edgePathPoints = linePoints.map((pt) => ({ ...pt }));
    const labelLinePoints = linePoints;
    const isCurvedStyle = style.curved === '1' || style.curved === true;
    const hasControlHints = controlHints.length > 0;
    const isControlHintPoint = (pt: Point): boolean => controlHints.some((hint) =>
      Math.abs(hint.x - pt.x) <= 1e-6 && Math.abs(hint.y - pt.y) <= 1e-6
    );
    const isCollinear = (a: Point, b: Point, c: Point): boolean => {
      const cross = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      return Math.abs(cross) <= 1e-6;
    };
    const removeCollinearPoints = (points: Point[]): Point[] => {
      if (points.length <= 2) return points;
      const simplified: Point[] = [points[0]];
      for (let i = 1; i < points.length - 1; i++) {
        const prev = simplified[simplified.length - 1];
        const current = points[i];
        const next = points[i + 1];
        if (!isControlHintPoint(current) && isCollinear(prev, current, next)) {
          const dx1 = current.x - prev.x;
          const dy1 = current.y - prev.y;
          const dx2 = next.x - current.x;
          const dy2 = next.y - current.y;
          const dot = dx1 * dx2 + dy1 * dy2;
          if (dot >= 0) {
            continue;
          }
        }
        simplified.push(current);
      }
      simplified.push(points[points.length - 1]);
      return simplified;
    };
    const edgeRoundedHint = style.rounded !== 0 && style.rounded !== '0' && style.rounded !== false;
    const removeTinyDoglegs = (points: Point[], tol: number): Point[] => {
      if (points.length <= 2) return points;
      const simplified: Point[] = [points[0]];
      for (let i = 1; i < points.length - 1; i++) {
        const prev = simplified[simplified.length - 1];
        const current = points[i];
        const next = points[i + 1];
        const nextNext = i + 2 < points.length ? points[i + 2] : null;
        const dx1 = current.x - prev.x;
        const dy1 = current.y - prev.y;
        const dx2 = next.x - current.x;
        const dy2 = next.y - current.y;
        const len1 = Math.hypot(dx1, dy1);
        const len2 = Math.hypot(dx2, dy2);
        const seg1Axis = Math.abs(dx1) <= 1e-6 || Math.abs(dy1) <= 1e-6;
        const seg2Axis = Math.abs(dx2) <= 1e-6 || Math.abs(dy2) <= 1e-6;
        const isOrthogonalTurn = seg1Axis && seg2Axis && (Math.abs(dx1) <= 1e-6) !== (Math.abs(dx2) <= 1e-6);
        const axisAligned = Math.abs(prev.x - next.x) <= tol || Math.abs(prev.y - next.y) <= tol;
        const tinyPrev = len1 <= tol && seg1Axis;
        const tinyNext = len2 <= tol && seg2Axis;
        const doglegTol = Math.max(tol, 0.8);
        if (!isControlHintPoint(current) && !isControlHintPoint(next) && nextNext && seg1Axis && seg2Axis && len2 <= doglegTol + 1e-6) {
          const dx3 = nextNext.x - next.x;
          const dy3 = nextNext.y - next.y;
          const seg3Axis = Math.abs(dx3) <= 1e-6 || Math.abs(dy3) <= 1e-6;
          if (seg3Axis) {
            const seg1Vertical = Math.abs(dx1) <= 1e-6;
            const seg2Vertical = Math.abs(dx2) <= 1e-6;
            const seg3Vertical = Math.abs(dx3) <= 1e-6;
            const tinyStepBetweenParallel = seg1Vertical === seg3Vertical && seg2Vertical !== seg1Vertical;
            if (tinyStepBetweenParallel) {
              simplified.push(current);
              i++;
              continue;
            }
          }
        }
        if (!isControlHintPoint(current) && (tinyPrev || (isOrthogonalTurn && axisAligned && tinyPrev))) {
          continue;
        }
        if (!isControlHintPoint(current) && (tinyNext || (isOrthogonalTurn && axisAligned && tinyNext))) {
          continue;
        }
        simplified.push(current);
      }
      simplified.push(points[points.length - 1]);
      return simplified;
    };
    const trimTinyEndSegments = (points: Point[], tol: number): Point[] => {
      if (points.length <= 2) return points;
      let result = points;
      let changed = true;
      while (changed && result.length > 2) {
        changed = false;
        if (result.length > 2) {
          const p0 = result[0];
          const p1 = result[1];
          const dx = p1.x - p0.x;
          const dy = p1.y - p0.y;
          const len = Math.hypot(dx, dy);
          const segAxis = Math.abs(dx) <= 1e-6 || Math.abs(dy) <= 1e-6;
          if (segAxis && len <= tol) {
            result = [p0, ...result.slice(2)];
            changed = true;
          }
        }
        if (result.length > 2) {
          const n = result.length;
          const pPrev = result[n - 2];
          const pEnd = result[n - 1];
          const dx = pEnd.x - pPrev.x;
          const dy = pEnd.y - pPrev.y;
          const len = Math.hypot(dx, dy);
          const segAxis = Math.abs(dx) <= 1e-6 || Math.abs(dy) <= 1e-6;
          if (segAxis && len <= tol) {
            result = result.slice(0, n - 1);
            changed = true;
          }
        }
      }
      return result;
    };
    const snapAxisAlignedPoints = (points: Point[], tol: number, snapEnds: boolean = true): Point[] => {
      if (points.length <= 1) return points;
      const snapped = points.map((pt) => ({ ...pt }));
      for (let i = 1; i < snapped.length; i++) {
        if (!snapEnds && i === snapped.length - 1) continue;
        const prev = snapped[i - 1];
        const curr = snapped[i];
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        if (Math.abs(dx) <= tol && Math.abs(dy) > Math.abs(dx)) {
          curr.x = prev.x;
        } else if (Math.abs(dy) <= tol && Math.abs(dx) > Math.abs(dy)) {
          curr.y = prev.y;
        }
      }
      return snapped;
    };
    let normalizedPoints = linePoints.length > 0 ? linePoints : allPoints;
    if (edgeStyle === 'orthogonalEdgeStyle' && normalizedPoints.length > 1) {
      normalizedPoints = removeTinyDoglegs(normalizedPoints, edgeRoundedHint ? 0.3 : 0.5);
    }
    if (!isIsometricEdge && edgeStyle !== 'entityRelationEdgeStyle' && normalizedPoints.length > 2 && !(edgeStyle === 'elbowEdgeStyle' && !hasControlHints)) {
      if (!isCurvedStyle) {
        normalizedPoints = removeCollinearPoints(normalizedPoints);
      } else {
        normalizedPoints = removeCollinearPoints(normalizedPoints);
      }
    }
    const shapeName = style.shape as string | undefined;
    // Save pre-trim endpoints for bounds calculation (lean_mapping edges trim normalizedPoints)
    const preShapeStart = { ...normalizedPoints[0] };
    const preShapeEnd = { ...normalizedPoints[normalizedPoints.length - 1] };
    if (shapeName === 'mxgraph.lean_mapping.electronic_info_flow_edge' && normalizedPoints.length >= 2) {
      const start = normalizedPoints[0];
      const end = normalizedPoints[normalizedPoints.length - 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const len = Math.hypot(dx, dy);
      if (len > 0) {
        const ux = dx / len;
        const uy = dy / len;
        const trim = len * 0.05;
        const forward = len * 0.1;
        const lateral = len * 0.1 / 3;
        const startTrim = { x: start.x + ux * trim, y: start.y + uy * trim };
        const endTrim = { x: end.x - ux * trim, y: end.y - uy * trim };
        const midBase = {
          x: startTrim.x + (endTrim.x - startTrim.x) * 0.5,
          y: startTrim.y + (endTrim.y - startTrim.y) * 0.5
        };
        const midFar = {
          x: midBase.x + ux * forward + uy * lateral,
          y: midBase.y + uy * forward - ux * lateral
        };
        const midNear = {
          x: midBase.x - ux * forward - uy * lateral,
          y: midBase.y - uy * forward + ux * lateral
        };
        normalizedPoints = [startTrim, midFar, midNear, endTrim];
      }
    }
    if (shapeName === 'mxgraph.lean_mapping.manual_info_flow_edge' && normalizedPoints.length >= 2) {
      const start = normalizedPoints[0];
      const end = normalizedPoints[normalizedPoints.length - 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const len = Math.hypot(dx, dy);
      if (len > 0) {
        const trim = Math.max(5.5, len * 0.05);
        const ux = dx / len;
        const uy = dy / len;
        const startTrim = { x: start.x + ux * trim, y: start.y + uy * trim };
        const endTrim = { x: end.x - ux * trim, y: end.y - uy * trim };
        normalizedPoints = [startTrim, endTrim];
      }
    }
    if (edgeStyle !== 'entityRelationEdgeStyle' && normalizedPoints.length > 2 &&
      shapeName !== 'mxgraph.lean_mapping.electronic_info_flow_edge' &&
      shapeName !== 'mxgraph.lean_mapping.manual_info_flow_edge') {
      normalizedPoints = removeTinyDoglegs(normalizedPoints, edgeRoundedHint ? 0.3 : 0.6);
      const endTrimTol = Math.max(edgeRoundedHint ? 0.3 : 0.6, 0.5);
      normalizedPoints = trimTinyEndSegments(normalizedPoints, endTrimTol);
      if (!edgeRoundedHint && edgeStyle === 'orthogonalEdgeStyle') {
        const snapTol = 0.3;
        normalizedPoints = snapAxisAlignedPoints(normalizedPoints, snapTol, false);
      }
    }
    if (isOrthogonalEdge && controlHints.length === 0 && normalizedPoints.length === 3) {
      const snapTol = 0.5;
      const axisTol = 0.05;
      const gapTol = 0.2;
      const [start, mid, end] = normalizedPoints;
      const tailLen = Math.hypot(end.x - mid.x, end.y - mid.y);
      const strokeWidthValue = parseFloat(style.strokeWidth as string);
      const strokeWidth = Number.isFinite(strokeWidthValue) ? strokeWidthValue : 1;
      if (strokeWidth <= 1 && tailLen <= 3) {
        const alignX = Math.abs(mid.x - end.x) <= axisTol
          && Math.abs(start.x - end.x) <= snapTol
          && Math.abs(start.x - mid.x) >= gapTol;
        const alignY = Math.abs(mid.y - end.y) <= axisTol
          && Math.abs(start.y - end.y) <= snapTol
          && Math.abs(start.y - mid.y) >= gapTol;
        if (alignX) {
          mid.x = start.x;
          end.x = start.x;
        } else if (alignY) {
          mid.y = start.y;
          end.y = start.y;
        }
      }
    }
    // Adjacent close-point deduplication (matches draw.io mxShape.getWaypoints).
    // When two adjacent points are both within threshold in X AND Y, the later
    // point is dropped. This prevents tiny end segments where the arrow offset
    // would overshoot and reverse direction.
    {
      const edgeScale = this.options.scale || 1;
      const waypointThreshold = Math.max(1, 1 / edgeScale);
      const filtered: Point[] = [normalizedPoints[0]];
      let prev = normalizedPoints[0];
      for (let i = 1; i < normalizedPoints.length; i++) {
        const curr = normalizedPoints[i];
        if (Math.abs(prev.x - curr.x) >= waypointThreshold ||
            Math.abs(prev.y - curr.y) >= waypointThreshold) {
          filtered.push(curr);
        }
        prev = curr; // always advance (matches draw.io rolling-prev behavior)
      }
      if (filtered.length >= 2) {
        normalizedPoints = filtered;
      }
    }

    // Now absolutePoints is complete: [startPoint, ...waypoints, endPoint]
    // All points are guaranteed non-null at this point
    const startPoint = normalizedPoints[0];
    const endPoint = normalizedPoints[normalizedPoints.length - 1];
    const useNormalizedEdgePointsForLabels = edgeStyle === 'orthogonalEdgeStyle' && isCurvedStyle;
    const edgePathPointsForLabels = (useNormalizedEdgePointsForLabels ? normalizedPoints : edgePathPoints)
      .map((pt) => ({ ...pt }));

    // Skip rendering zero-length edges with no label
    const hasLabel = !!cell.value;
    if (shouldSkipZeroLengthEdge(normalizedPoints, hasLabel)) {
      if (this.builder) this.popGroup();
      return null;
    }

    // Style attributes
    const {
      strokeColor,
      strokeWidth,
      dashed,
      dashPattern,
      curved,
      edgeRounded,
      isCommLinkEdge,
      fillColor,
    } = getEdgeStyleConfig(style, this.normalizeColor.bind(this));
    const edgeDashPattern = (() => {
      if (strokeColor === 'none') return undefined;
      const rawPattern = (dashPattern && dashPattern.trim() !== '' && dashPattern.trim() !== 'none')
        ? dashPattern.trim()
        : (dashed ? '3 3' : undefined);
      if (!rawPattern) return undefined;
      const tokens = rawPattern.split(/[ ,]+/).filter((token) => token.length > 0);
      if (tokens.length === 0) return undefined;
      const scaledTokens = tokens.map((token) => {
        const value = parseFloat(token);
        if (!Number.isFinite(value)) return token;
        const scaled = value * strokeWidth;
        return Number.isFinite(scaled) ? String(scaled) : token;
      });
      return scaledTokens.join(' ');
    })();
    const edgeRoundedForPath = edgeRounded || isIsometricEdge;
    const edgeHasShadow = style.shadow === '1' || style.shadow === true;

    // Calculate angles for arrows
    const { startAngle, endAngle } = getEdgeAngles(normalizedPoints);

    // Save original endpoints for bounds calculation (before arrow lineOffset adjustment)
    // For lean_mapping edges, use the pre-trim endpoints since the shape-specific
    // trimming reduces the visible path but doesn't change the logical edge extent.
    const isLeanMappingEdge = shapeName === 'mxgraph.lean_mapping.electronic_info_flow_edge'
      || shapeName === 'mxgraph.lean_mapping.manual_info_flow_edge';
    const originalStartPoint = isLeanMappingEdge ? { ...preShapeStart } : { ...startPoint };
    const originalEndPoint = isLeanMappingEdge ? { ...preShapeEnd } : { ...endPoint };

    const linkShapeName = style.shape as string | undefined;
    const hasMarkers = (startArrow && startArrow !== 'none') || (endArrow && endArrow !== 'none');
    const canRenderLinkShape = linkShapeName === 'link' && !hasMarkers;
    if (canRenderLinkShape) {
      const linkWidthRaw = parseFloat(style.width as string);
      const linkWidth = Number.isFinite(linkWidthRaw)
        ? linkWidthRaw
        : 4;
      const linkWidthAbs = Math.abs(linkWidth);
      const p0 = normalizedPoints[0];
      const p1 = isIsometricEdge
        ? normalizedPoints[normalizedPoints.length - 1]
        : normalizedPoints[1];
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 0) {
        let pathD: string;
        if (isIsometricEdge) {
          pathD = buildIsometricLinkPath(p0, p1, linkWidthAbs);
        } else {
          const normalSign = linkWidth < 0 ? -1 : 1;
          pathD = buildPolylineLinkPath(normalizedPoints, linkWidthAbs, normalSign);
        }

        let boundPointsOverride: Point[] | null = null;
        const { boundPointsOverride: domBoundPointsOverride } = renderEdgeDom(
          {
            builder: this.builder,
            shouldApplyCrispTranslate: this.shouldApplyCrispTranslate.bind(this),
            pushGroup: this.pushGroup.bind(this),
            popGroup: this.popGroup.bind(this),
            getCurrentGroup: () => this.currentGroup,
          },
          {
            isCommLinkEdge,
            strokeColor,
            strokeWidth,
            dashed,
            dashPattern: edgeDashPattern,
            fillColor,
            hasShadow: edgeHasShadow,
            pathD,
            startPoint,
            endPoint,
            arrowElements: [],
          }
        );
        if (domBoundPointsOverride) {
          boundPointsOverride = domBoundPointsOverride;
        }

        const { labelPosition } = renderEdgeLabelIfAny(
          { renderEdgeLabel: this.renderEdgeLabel.bind(this) },
          {
            cell,
            geometry: geo,
            style,
            originalStartPoint,
            originalEndPoint,
            linePoints: labelLinePoints,
          }
        );

        if (this.builder) {
          this.popGroup();
        }

        return buildEdgeRenderResult(
          originalStartPoint,
          normalizedPoints,
          originalEndPoint,
          boundPointsOverride,
          labelPosition,
          edgePathPointsForLabels
        );
      }
    }

    const isWedgeArrowEdge = shapeName === 'mxgraph.arrows2.wedgeArrow'
      || shapeName === 'mxgraph.arrows2.wedgeArrowDashed'
      || shapeName === 'mxgraph.arrows2.wedgeArrowDashed2';
    if (isWedgeArrowEdge) {
      let boundPointsOverride: Point[] | null = null;
      const points = normalizedPoints;
      if (points.length >= 2) {
        const start = points[0];
        const end = points[points.length - 1];
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const len = Math.hypot(dx, dy);
        if (len > 0) {
          const startWidthRaw = parseFloat(style.startWidth as string);
          const startWidth = Math.max(0, Number.isFinite(startWidthRaw) ? startWidthRaw : 20);
          const px = (dx * startWidth) / len;
          const py = (dy * startWidth) / len;
          boundPointsOverride = [
            { x: start.x + py, y: start.y - px },
            { x: start.x - py, y: start.y + px },
            { x: end.x, y: end.y },
          ];

          if (this.builder && this.currentGroup) {
            const handlerCtor = this.shapeRegistry.getHandlerCtor(shapeName || '');
            if (handlerCtor) {
              const useCrispTranslate = this.shouldApplyCrispTranslate(strokeWidth, strokeColor, false, false);
              const prevGroup = this.currentGroup;
              if (useCrispTranslate) {
                const geometryGroup = this.builder.createGroup();
                geometryGroup.setAttribute('transform', 'translate(0.5,0.5)');
                prevGroup.appendChild(geometryGroup);
                this.currentGroup = geometryGroup;
              }

              const styleForHandler = { ...style, fillColor: 'none' };
              const handlerCtx: ShapeContext = {
                x: start.x,
                y: start.y - startWidth,
                width: len,
                height: startWidth * 2,
                style: styleForHandler,
              };
              const renderCtx = this.createRenderContext(handlerCtx, cell, cellMap, this.currentGroup);
              const handler = new handlerCtor(renderCtx);
              const attrs = this.parseShapeAttrs(styleForHandler, cell, cellMap);
              handler.render(attrs);

              if (useCrispTranslate) {
                this.currentGroup = prevGroup;
              }
            }
          }
        }
      }

      const { labelPosition } = renderEdgeLabelIfAny(
        { renderEdgeLabel: this.renderEdgeLabel.bind(this) },
        {
          cell,
          geometry: geo,
          style,
          originalStartPoint,
          originalEndPoint,
          linePoints: labelLinePoints,
        }
      );

      if (this.builder) {
        this.popGroup();
      }

      return buildEdgeRenderResult(
        originalStartPoint,
        normalizedPoints,
        originalEndPoint,
        boundPointsOverride,
        labelPosition,
        edgePathPointsForLabels
      );
    }

    const isFlexArrowEdge = shapeName === 'flexArrow';
    if (isFlexArrowEdge) {
      if (this.builder && this.currentGroup) {
        const points = normalizedPoints;
        if (points.length >= 2) {
          const start = points[0];
          const end = points[points.length - 1];
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && points.length === 2) {
            const vx = dx / dist;
            const vy = dy / dist;
            const edgeWidth = (parseFloat(style.width as string) || 10) + Math.max(0, strokeWidth - 1);
            const startArrowWidth = edgeWidth + (parseFloat(style.startWidth as string) || 20);
            const endArrowWidth = edgeWidth + (parseFloat(style.endWidth as string) || 20);
            const defaultSize = 6;
            const startSize = (parseFloat(style.startSize as string) || defaultSize) * 3 + strokeWidth;
            const endSize = (parseFloat(style.endSize as string) || defaultSize) * 3 + strokeWidth;
            const spacing = strokeWidth / 2;
            const hasStartMarker = (style.startArrow as string) && (style.startArrow as string) !== 'none';
            const hasEndMarker = (style.endArrow as string) && (style.endArrow as string) !== 'none';

            const useCrispTranslate = this.shouldApplyCrispTranslate(strokeWidth, strokeColor, false, false);
            let targetGroup = this.currentGroup;
            if (useCrispTranslate) {
              const geometryGroup = this.builder.createGroup();
              geometryGroup.setAttribute('transform', 'translate(0.5,0.5)');
              targetGroup.appendChild(geometryGroup);
              targetGroup = geometryGroup;
            }

            const paintMarker = (
              builder: SvgBuilder,
              x: number,
              y: number,
              dxUnit: number,
              dyUnit: number,
              size: number,
              arrowWidth: number,
              edgeWidthValue: number,
              spacingValue: number,
              moveTo: boolean
            ) => {
              const ratio = edgeWidthValue / arrowWidth;
              const n = edgeWidthValue * dyUnit / 2;
              const k = -edgeWidthValue * dxUnit / 2;
              const px = (spacingValue + size) * dxUnit;
              const py = (spacingValue + size) * dyUnit;
              if (moveTo) {
                builder.moveTo(x - n + px, y - k + py);
              } else {
                builder.lineTo(x - n + px, y - k + py);
              }
              builder.lineTo(x - n / ratio + px, y - k / ratio + py);
              builder.lineTo(x + spacingValue * dxUnit, y + spacingValue * dyUnit);
              builder.lineTo(x + n / ratio + px, y + k / ratio + py);
              builder.lineTo(x + n + px, y + k + py);
            };

            const builder = this.builder;
            builder.setCanvasRoot(targetGroup);
            builder.save();
            builder.resetCanvasTransform();
            builder.setFillColor((style.fillColor as string) || '#ffffff');
            builder.setStrokeColor(strokeColor);
            builder.setStrokeWidth(strokeWidth);
            builder.setLineJoin('miter');
            builder.setLineCap('flat');
            builder.setMiterLimit(10);
            builder.begin();

            const u = edgeWidth * vy;
            const w = -edgeWidth * vx;

            if (hasStartMarker) {
              paintMarker(builder, start.x, start.y, vx, vy, startSize, startArrowWidth, edgeWidth, spacing, true);
            } else {
              const c1x = start.x + u / 2 + spacing * vx;
              const c1y = start.y + w / 2 + spacing * vy;
              const c2x = start.x - u / 2 + spacing * vx;
              const c2y = start.y - w / 2 + spacing * vy;
              builder.moveTo(c2x, c2y);
              builder.lineTo(c1x, c1y);
            }

            if (hasEndMarker) {
              paintMarker(builder, end.x, end.y, -vx, -vy, endSize, endArrowWidth, edgeWidth, spacing, false);
            } else {
              builder.lineTo(end.x - spacing * vx + u / 2, end.y - spacing * vy + w / 2);
              builder.lineTo(end.x - spacing * vx - u / 2, end.y - spacing * vy - w / 2);
            }

            builder.close();

            const rawFillColor = (style.fillColor as string) || '#ffffff';
            const normalizedFill = rawFillColor === 'none' ? 'none' : this.normalizeColor(rawFillColor);
            const gradientColor = style.gradientColor as string | undefined;
            if (gradientColor && gradientColor !== 'none' && normalizedFill !== 'none') {
              const gradientId = 'drawio-svg-fixed-2';
              const gradientEnd = this.normalizeColor(gradientColor);
              const directionKey = getGradientDirectionKey(style.gradientDirection as string | undefined);
              this.ensureLinearGradient(gradientId, normalizedFill, gradientEnd, directionKey);
              builder.setFillColor(`url(#${gradientId})`);
            } else {
              builder.setFillColor(normalizedFill);
            }
            builder.fillAndStroke();
            builder.restore();
            builder.setCanvasRoot(this.currentGroup);

            const path = targetGroup.lastChild as Element | null;
            if (path) {
              path.setAttribute('pointer-events', 'all');
            }
          }
        }
      }

      const { labelPosition } = renderEdgeLabelIfAny(
        { renderEdgeLabel: this.renderEdgeLabel.bind(this) },
        {
          cell,
          geometry: geo,
          style,
          originalStartPoint,
          originalEndPoint,
          linePoints: labelLinePoints,
        }
      );

      if (this.builder) {
        this.popGroup();
      }

      return buildEdgeRenderResult(
        originalStartPoint,
        normalizedPoints,
        originalEndPoint,
        null,
        labelPosition,
        edgePathPointsForLabels
      );
    }

    const isArrowEdge = (style.shape as string | undefined) === 'arrow' || style.arrow === true || style.arrow === '1';
    if (isArrowEdge) {
      if (this.builder && this.currentGroup) {
        const dx = originalEndPoint.x - originalStartPoint.x;
        const dy = originalEndPoint.y - originalStartPoint.y;
        const len = Math.hypot(dx, dy);
        if (len > 0) {
          const ux = dx / len;
          const uy = dy / len;
          const headLength = Math.min(30, len * 0.4);
          const shaftHalf = 5;
          const headHalf = Math.max(shaftHalf, headLength / 2);
          const baseX = originalEndPoint.x - ux * headLength;
          const baseY = originalEndPoint.y - uy * headLength;
          const px = -uy;
          const py = ux;

          // Points order to match the platform: start-right, start-left, base-left, head-left, tip, head-right, base-right
          const points = [
            { x: originalStartPoint.x + px * shaftHalf, y: originalStartPoint.y + py * shaftHalf },
            { x: originalStartPoint.x - px * shaftHalf, y: originalStartPoint.y - py * shaftHalf },
            { x: baseX - px * shaftHalf, y: baseY - py * shaftHalf },
            { x: baseX - px * headHalf, y: baseY - py * headHalf },
            { x: originalEndPoint.x, y: originalEndPoint.y },
            { x: baseX + px * headHalf, y: baseY + py * headHalf },
            { x: baseX + px * shaftHalf, y: baseY + py * shaftHalf }
          ];

          const d = `M ${points.map((pt) => `${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`).join(' L ')} Z`;
          const path = this.builder.createPath(d);
          const edgeStyleName = style.edgeStyle as string | undefined;
          // Note: edgeStyle='none' means "no edge style", should be treated as falsy
          const hasEdgeStyle = edgeStyleName && edgeStyleName !== 'none';
          const fillValue = hasEdgeStyle ? 'none' : this.normalizeColor((style.fillColor as string) || '#ffffff');
          path.setAttribute('fill', fillValue);
          path.setAttribute('stroke', strokeColor === 'none' ? 'none' : strokeColor);
          path.setAttribute('stroke-width', String(strokeWidth));
          path.setAttribute('stroke-miterlimit', '10');
          path.setAttribute('pointer-events', 'all');
          this.currentGroup.appendChild(path);
        }
      }

      const { labelPosition } = renderEdgeLabelIfAny(
        { renderEdgeLabel: this.renderEdgeLabel.bind(this) },
        {
          cell,
          geometry: geo,
          style,
          originalStartPoint,
          originalEndPoint,
          linePoints: labelLinePoints,
        }
      );

      if (this.builder) {
        this.popGroup();
      }

      return buildEdgeRenderResult(
        originalStartPoint,
        normalizedPoints,
        originalEndPoint,
        null,
        labelPosition,
        edgePathPointsForLabels
      );
    }

    // Create arrows and adjust line endpoints
    const isElectronicInfoFlowEdge = (style.shape as string | undefined) === 'mxgraph.lean_mapping.electronic_info_flow_edge';
    const isManualInfoFlowEdge = (style.shape as string | undefined) === 'mxgraph.lean_mapping.manual_info_flow_edge';
    const arrowEndPoint = (isElectronicInfoFlowEdge || isManualInfoFlowEdge)
      ? {
          x: endPoint.x + Math.cos(endAngle) * strokeWidth * 1.118,
          y: endPoint.y + Math.sin(endAngle) * strokeWidth * 1.118
        }
      : endPoint;

    const { arrowElements, lineStart, lineEnd } = applyEdgeArrows({
      startPoint,
      endPoint: arrowEndPoint,
      startAngle,
      endAngle,
      startArrow,
      endArrow,
      startSize,
      endSize,
      startFill,
      endFill,
      strokeColor,
      strokeWidth,
      isCommLinkEdge,
      createArrowPath: this.createArrowPath.bind(this),
    });

    let adjustedLineEnd = lineEnd;
    if (!isCommLinkEdge && endArrow === 'blockThin' && normalizedPoints.length >= 2) {
      const prevPoint = normalizedPoints[normalizedPoints.length - 2];
      const isHorizontalEnd = Math.abs(prevPoint.y - lineEnd.y) <= 1e-6;
      const startEndDelta = Math.abs(startPoint.y - endPoint.y);
      if (isHorizontalEnd && startEndDelta >= 0.4 && startEndDelta <= 0.6) {
        const nudge = Math.max(1, strokeWidth);
        const direction = startPoint.y >= endPoint.y ? 1 : -1;
        adjustedLineEnd = { x: lineEnd.x, y: lineEnd.y + direction * nudge };
      }
    }

    if (!isCommLinkEdge) {
      // Update first and last points for line path
      if (
        (style.shape as string | undefined) === 'mxgraph.lean_mapping.electronic_info_flow_edge'
        || (style.shape as string | undefined) === 'mxgraph.lean_mapping.manual_info_flow_edge'
      ) {
        normalizedPoints[0] = startPoint;
        normalizedPoints[normalizedPoints.length - 1] = endPoint;
      } else {
        normalizedPoints[0] = lineStart;
        normalizedPoints[normalizedPoints.length - 1] = adjustedLineEnd;
      }
    }

    // Build path using helper method
    const isOrthogonalLike = (points: Point[], tol: number): boolean => {
      if (points.length < 2) return false;
      for (let i = 1; i < points.length; i++) {
        const dx = Math.abs(points[i].x - points[i - 1].x);
        const dy = Math.abs(points[i].y - points[i - 1].y);
        if (dx > tol && dy > tol) {
          return false;
        }
      }
      return true;
    };
    const jumpStyle = String(style.jumpStyle ?? '').toLowerCase();
    const jumpSizeValue = parseFloat(style.jumpSize as string);
    const jumpSize = Number.isFinite(jumpSizeValue) ? jumpSizeValue : 6;
    const noJump = style.noJump === '1' || style.noJump === true;
    const jumpArcEnabled = jumpStyle === 'arc' && jumpSize > 0 && !curved && !noJump;
    const jumpOffset = Math.max(0, (jumpSize - 2) / 2 + strokeWidth);
    const jumpArcOffset = jumpOffset * 1.3;
    const scale = this.options.scale;
    const endpointTol = 0.5 * scale;
    const mergeTolSq = scale * scale;
    const round2 = (value: number): number => Number(value.toFixed(2));
    const ptSegDistSq = (x1: number, y1: number, x2: number, y2: number, px: number, py: number): number => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      if (dx === 0 && dy === 0) {
        const ddx = px - x1;
        const ddy = py - y1;
        return ddx * ddx + ddy * ddy;
      }
      let t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
      t = Math.max(0, Math.min(1, t));
      const cx = x1 + t * dx;
      const cy = y1 + t * dy;
      const ddx = px - cx;
      const ddy = py - cy;
      return ddx * ddx + ddy * ddy;
    };
    const ptLineDist = (a: Point, b: Point, p: Point): number => {
      return Math.sqrt(ptSegDistSq(a.x, a.y, b.x, b.y, p.x, p.y));
    };
    const intersectSegments = (a: Point, b: Point, c: Point, d: Point): Point | null => {
      const s1x = b.x - a.x;
      const s1y = b.y - a.y;
      const s2x = d.x - c.x;
      const s2y = d.y - c.y;
      const denom = (-s2x * s1y + s1x * s2y);
      if (Math.abs(denom) <= 1e-6) return null;
      const s = (-s1y * (a.x - c.x) + s1x * (a.y - c.y)) / denom;
      const t = (s2x * (a.y - c.y) - s2y * (a.x - c.x)) / denom;
      if (s < 0 || s > 1 || t < 0 || t > 1) return null;
      return { x: a.x + (t * s1x), y: a.y + (t * s1y) };
    };
    const collectJumpMap = (points: Point[], currentEdgeKey?: string): Map<number, Point[]> => {
      const jumpMap = new Map<number, Point[]>();
      if (!jumpArcEnabled || points.length < 2) return jumpMap;

      for (let i = 0; i < points.length - 1; i++) {
        let start = points[i];
        let end = points[i + 1];
        let next = points[i + 2];
        while (i < points.length - 2 && ptSegDistSq(start.x, start.y, next.x, next.y, end.x, end.y) < mergeTolSq) {
          end = next;
          i++;
          next = points[i + 2];
        }

        const intersections: { distSq: number; pt: Point }[] = [];

        for (const [edgeKey, otherPoints] of this.edgeJumpPoints.entries()) {
          if (currentEdgeKey && edgeKey === currentEdgeKey) continue;
          const otherCell = cellMap.get(edgeKey || '');
          const otherNoJump = otherCell?.style?.noJump === '1' || otherCell?.style?.noJump === true;
          if (otherNoJump) continue;
          if (!otherPoints || otherPoints.length < 2) continue;

          let prevOtherStart: Point | null = null;
          for (let j = 0; j < otherPoints.length - 1; j++) {
            let otherStart = otherPoints[j];
            let otherEnd = otherPoints[j + 1];
            let otherNext = otherPoints[j + 2];
            while (j < otherPoints.length - 2 && ptSegDistSq(otherStart.x, otherStart.y, otherNext.x, otherNext.y, otherEnd.x, otherEnd.y) < mergeTolSq) {
              otherEnd = otherNext;
              j++;
              otherNext = otherPoints[j + 2];
            }

            const hit = intersectSegments(start, end, otherStart, otherEnd);
            if (hit) {
              const nearStart = Math.abs(hit.x - start.x) <= endpointTol && Math.abs(hit.y - start.y) <= endpointTol;
              const nearEnd = Math.abs(hit.x - end.x) <= endpointTol && Math.abs(hit.y - end.y) <= endpointTol;
              if (!nearStart && !nearEnd) {
                const prevTooClose = prevOtherStart
                  ? ptLineDist(start, end, prevOtherStart) <= endpointTol && ptLineDist(start, end, otherStart) <= endpointTol
                  : false;
                const nextTooClose = otherNext
                  ? ptLineDist(start, end, otherNext) <= endpointTol && ptLineDist(start, end, otherEnd) <= endpointTol
                  : false;
                if (!prevTooClose && !nextTooClose) {
                  const dx = hit.x - start.x;
                  const dy = hit.y - start.y;
                  const distSq = dx * dx + dy * dy;
                  let inserted = false;
                  for (let k = 0; k < intersections.length; k++) {
                    if (intersections[k].distSq > distSq) {
                      intersections.splice(k, 0, { distSq, pt: hit });
                      inserted = true;
                      break;
                    }
                  }
                  if (!inserted) {
                    const last = intersections[intersections.length - 1];
                    if (!last || last.pt.x !== hit.x || last.pt.y !== hit.y) {
                      intersections.push({ distSq, pt: hit });
                    }
                  }
                }
              }
            }
            prevOtherStart = otherStart;
          }
        }

        if (intersections.length > 0) {
          jumpMap.set(i, intersections.map((entry) => entry.pt));
        }
      }

      return jumpMap;
    };
    const buildJumpPath = (points: Point[], jumpMap: Map<number, Point[]>): string | null => {
      if (!jumpArcEnabled || jumpMap.size === 0 || points.length < 2) return null;
      let path = `M ${round2(points[0].x)} ${round2(points[0].y)}`;

      for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        const jumps = jumpMap.get(i) ?? [];
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const len = Math.hypot(dx, dy);

        if (jumps.length === 0 || len <= 1e-6 || jumpOffset <= 0) {
          path += ` L ${round2(end.x)} ${round2(end.y)}`;
          continue;
        }

        const ux = dx / len;
        const uy = dy / len;
        const perpX = -uy;
        const perpY = ux;
        const dirSign = (Math.round(ux) < 0 || (Math.round(ux) === 0 && Math.round(uy) <= 0)) ? 1 : -1;
        let currentDist = 0;

        for (const pt of jumps) {
          const proj = (pt.x - start.x) * ux + (pt.y - start.y) * uy;
          const jumpStartDist = proj - jumpOffset;
          const jumpEndDist = proj + jumpOffset;
          if (jumpStartDist < 0 || jumpEndDist > len) continue;
          if (jumpStartDist < currentDist - 1e-6) continue;

          const jumpStart = {
            x: start.x + ux * jumpStartDist,
            y: start.y + uy * jumpStartDist,
          };
          const jumpEnd = {
            x: start.x + ux * jumpEndDist,
            y: start.y + uy * jumpEndDist,
          };
          const ctrlX = perpX * jumpArcOffset * dirSign;
          const ctrlY = perpY * jumpArcOffset * dirSign;

          path += ` L ${round2(jumpStart.x)} ${round2(jumpStart.y)}`;
          path += ` C ${round2(jumpStart.x + ctrlX)} ${round2(jumpStart.y + ctrlY)} ${round2(jumpEnd.x + ctrlX)} ${round2(jumpEnd.y + ctrlY)} ${round2(jumpEnd.x)} ${round2(jumpEnd.y)}`;
          currentDist = jumpEndDist;
        }

        path += ` L ${round2(end.x)} ${round2(end.y)}`;
      }

      return path;
    };
    const orthogonalHint = !isOrthogonalEdgeWithConstraint
      && controlHints.length > 0
      && isOrthogonalLike(normalizedPoints, 2);
    const isOrthogonalEdgeForPath = isIsometricEdge
      ? true
      : (isOrthogonalEdgeWithConstraint || orthogonalHint);
    const jumpMap = collectJumpMap(normalizedPoints, cellKey);
    const jumpPathD = buildJumpPath(normalizedPoints, jumpMap);
    const pathD = jumpPathD ?? getEdgePathD({
      points: normalizedPoints,
      curved,
      edgeRounded: edgeRoundedForPath,
      isOrthogonalEdge: isOrthogonalEdgeForPath,
      edgeStyle: edgeStyle ?? '',
      isLoop,
    });
    let boundPointsOverride: Point[] | null = null;

    // DOM building for edge
    const { boundPointsOverride: domBoundPointsOverride } = renderEdgeDom(
      {
        builder: this.builder,
        shouldApplyCrispTranslate: this.shouldApplyCrispTranslate.bind(this),
        pushGroup: this.pushGroup.bind(this),
        popGroup: this.popGroup.bind(this),
        getCurrentGroup: () => this.currentGroup,
      },
      {
        isCommLinkEdge,
        strokeColor,
        strokeWidth,
        dashed,
        dashPattern: edgeDashPattern,
        fillColor,
        hasShadow: edgeHasShadow,
        pathD,
        startPoint,
        endPoint,
        arrowElements,
      }
    );
    if (domBoundPointsOverride) {
      boundPointsOverride = domBoundPointsOverride;
    }

    // mxArrow-based edge shapes: use only original routing endpoints for bounds
    // mxArrow.augmentBoundingBox grows bbox from these points (not the rendered zigzag/trim path)
    const isMxArrowEdge = shapeName === 'mxgraph.lean_mapping.electronic_info_flow_edge'
      || shapeName === 'mxgraph.lean_mapping.manual_info_flow_edge'
      || shapeName === 'mxgraph.networks.comm_link_edge';
    if (isMxArrowEdge) {
      boundPointsOverride = [originalStartPoint, originalEndPoint];
    }

    const { labelPosition } = renderEdgeLabelIfAny(
      { renderEdgeLabel: this.renderEdgeLabel.bind(this) },
      {
        cell,
        geometry: geo,
        style,
        originalStartPoint,
        originalEndPoint,
        linePoints: labelLinePoints,
      }
    );

    // DOM: Pop edge group
    if (this.builder) {
      this.popGroup();
    }

    const edgeResult = buildEdgeRenderResult(
      originalStartPoint,
      normalizedPoints,
      originalEndPoint,
      boundPointsOverride,
      labelPosition,
      edgePathPointsForLabels
    );
    return edgeResult;
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(str: string): string {
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  }

  /**
   * Convert HTML to XHTML format for embedding in SVG foreignObject
   * Uses DOMParser to parse HTML and XMLSerializer to serialize as XHTML
   */
  private convertToXhtml(html: string): string {
    const sanitized = html
      .replace(/\u0001/g, '');
    return convertToXhtmlHelper(sanitized, this.domParser);
  }
}
