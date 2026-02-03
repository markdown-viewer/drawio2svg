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
import type { StencilBundle } from './stencil/index.ts';
import { convertStencilXmlToSvgs } from './stencil/index.ts';
import pako from 'pako';
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
import { getTextMeasureProvider } from './text/index.ts';
import { DEFAULT_FONT_FAMILY, setDefaultFontFamily } from './text/constants.ts';
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
  getStencilSvg: (style: MxStyle) => string | null;
  renderStencilShape: (ctx: ShapeContext, svg: string) => void;
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
  private inlineStencilCache = new Map<string, string>();
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
      getStencilSvg: this.getStencilSvg.bind(this),
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
    this.offsetX = Math.floor(offsetBaseX + (offsetBaseX >= 0 ? offsetEpsilon : 0));
    this.offsetY = Math.floor(offsetBaseY + (offsetBaseY >= 0 ? offsetEpsilon : 0));
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
    // endOffset = sw * 1.118 compensates for stroke width
    const endOffset = strokeWidth * 1.118;
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
        // LineOffset for diamond: full length + strokeWidth offset
        lineOffset = (size + strokeWidth) + strokeWidth * 1.118;
        boundPoints = [p1, p2, p3, p4];
        element = createPathElement((builder) => {
          builder.addPoints(diamondPoints, false, 0, true);
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
      default:
        return null;
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
              const hasSubOrSup = /<\s*(sub|sup)\b/i.test(cell.value || '');
              if ((style.html as string | undefined) === '1' && verticalAlign === 'top' && !hasSubOrSup && style.overflow !== 'hidden') {
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
                if (verticalAlign === 'middle' && align === 'center' && !hasSpan) {
                  const isSingleChar = rawValue.trim().length <= 1;
                  const hasBoldTag = /<b\b/i.test(rawValue);
                  const fontStyleRaw = parseInt(style.fontStyle as string) || 0;
                  const hasBoldStyle = (fontStyleRaw & 1) !== 0;
                  const hasLineBreak = /<br\b|<div\b|<p\b|\n/i.test(rawValue);
                  const shouldAdjust = hasBoldTag || (hasBoldStyle && (hasLineBreak || isSingleChar));
                  if (shouldAdjust) {
                    let adjust = Math.floor(spacingTop / 2);
                    if (hasBoldStyle && hasLineBreak && !hasBoldTag && !isSingleChar) {
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
                const hasHtmlBlocks = /<br\b|<div\b|<p\b|<li\b|<ul\b|<ol\b/i.test(rawValue);
                const plainText = rawValue.replace(/<[^>]+>/g, '');
                const hasBreakableSpace = /\s/.test(plainText);
                const allowWrapOverflow = !whiteSpaceWrap || !hasBreakableSpace;
                if (!hasHtmlBlocks && allowWrapOverflow) {
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
                const fontStyleRaw = parseInt(style.fontStyle as string) || 0;
                const isBold = (fontStyleRaw & 1) !== 0 || style.fontStyle === 'bold';
                const widthBoost = isBold ? 1.185 : 1;
                const boostedWidth = textWidth * widthBoost;
                const expandedWidth = Math.max(boundsW, boostedWidth);
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

  private getStencilSvg(style: MxStyle): string | null {
    const shape = style.shape as string | undefined;
    if (!shape) return null;

    const inlineStencilSvg = this.getInlineStencilSvg(shape);
    if (inlineStencilSvg) return inlineStencilSvg;

    return this.getStencilSvgFromResource(shape);
  }

  private getStencilSvgFromResource(shape: string): string | null {
    if (!this.stencils) return null;
    if (!shape.startsWith('mxgraph.')) return null;
    
    // The shape name format is "mxgraph.{package}.{name}" where package may have dots
    // e.g., "mxgraph.veeam2.1u_server" -> key="veeam2.1u_server"
    // e.g., "mxgraph.weblogos.identi.ca" -> key="weblogos.identi.ca"
    // 
    // Resource keys are stored in the same format (without "mxgraph." prefix)
    // We need to find which group file contains the key
    const key = shape.slice('mxgraph.'.length);
    
    // Extract the first part as potential group for lookup
    const parts = key.split('.');
    const group = parts[0];
    
    // Direct lookup with full key
    const direct = this.stencils.get(group, key);
    if (direct) return direct;
    
    // Try all groups in case the key is stored in a different group file
    const groupData = this.stencils.getGroup(group);
    if (groupData && groupData[key]) return groupData[key];
    
    // Fallback: search all groups for this key
    const allGroups = this.stencils.groups();
    for (const g of allGroups) {
      const data = this.stencils.getGroup(g);
      if (data && data[key]) return data[key];
    }
    
    return null;
  }

  private getInlineStencilSvg(shape: string): string | null {
    if (!shape.startsWith('stencil(') || !shape.endsWith(')')) return null;
    const data = shape.slice('stencil('.length, -1).trim();
    if (!data) return null;
    const cached = this.inlineStencilCache.get(data);
    if (cached) return cached;
    const xml = this.decodeInlineStencilData(data);
    if (!xml) return null;
    const wrapped = xml.trim().startsWith('<shapes') ? xml : `<shapes>${xml}</shapes>`;
    try {
      const shapes = convertStencilXmlToSvgs(wrapped, 1);
      if (!shapes.length) return null;
      const svg = shapes[0].svg;
      this.inlineStencilCache.set(data, svg);
      return svg;
    } catch {
      return null;
    }
  }

  private decodeInlineStencilData(data: string): string | null {
    try {
      const buffer = Buffer.from(data, 'base64');
      const inflated = pako.inflateRaw(buffer, { to: 'string' }) as string;
      try {
        return decodeURIComponent(inflated);
      } catch {
        return inflated;
      }
    } catch {
      return null;
    }
  }

  private renderStencilShape(ctx: ShapeContext, svg: string): void {
    if (!this.builder || !this.currentGroup) return;

    const doc = this.domParser.parseFromString(svg, 'image/svg+xml');
    const svgEl = doc.documentElement;
    if (!svgEl) return;

    const viewBox = svgEl.getAttribute('viewBox');
    let vbX = 0, vbY = 0, vbW = 0, vbH = 0;
    if (viewBox) {
      const nums = viewBox.split(/[\s,]+/).map(n => parseFloat(n));
      [vbX, vbY, vbW, vbH] = nums.length >= 4 ? nums : [0, 0, 0, 0];
    }
    const widthAttr = parseFloat(svgEl.getAttribute('width') || '0');
    const heightAttr = parseFloat(svgEl.getAttribute('height') || '0');
    let srcW = vbW || widthAttr;
    let srcH = vbH || heightAttr;
    let exportOffsetX = 0;
    let exportOffsetY = 0;
    const shapeName = ctx.style.shape as string | undefined;
    if (srcW === 105 && srcH === 105 && !widthAttr && !heightAttr
      && shapeName !== 'mxgraph.infographic.circularCallout2') {
      const firstGroup = svgEl.firstElementChild;
      if (firstGroup && firstGroup.tagName === 'g') {
        const transform = firstGroup.getAttribute('transform') || '';
        if (/translate\(\s*0\.5\s*,\s*0\.5\s*\)/.test(transform)) {
          srcW = 100;
          srcH = 100;
          exportOffsetX = 2;
          exportOffsetY = 2;
        }
      }
    }
    if (!srcW || !srcH) return;

    const pointerEventsRaw = ctx.style.pointerEvents as string | number | undefined;
    const hasPointerEvents = pointerEventsRaw === '1' || pointerEventsRaw === 'true' || pointerEventsRaw === 1;
    const rectNodes = svgEl.getElementsByTagName('rect');
    let hasSvgRect = false;
    for (let i = 0; i < rectNodes.length; i++) {
      const rect = rectNodes[i];
      const w = parseFloat(rect.getAttribute('width') || '0');
      const h = parseFloat(rect.getAttribute('height') || '0');
      if (w > 0 && h > 0) {
        hasSvgRect = true;
        break;
      }
    }
    const hasShadow = ctx.style.shadow === '1' || ctx.style.shadow === true;
    const skipPointerRectForShadowedConcept = hasShadow && (shapeName === 'mxgraph.office.concepts.best_practices' || shapeName === 'mxgraph.office.concepts.help');
    const needsPointerRect = !!shapeName && hasPointerEvents && !skipPointerRectForShadowedConcept && (
      shapeName.startsWith('mxgraph.signs.')
      || (shapeName.startsWith('mxgraph.aws4.') && shapeName !== 'mxgraph.aws4.resourceIcon')
      || shapeName.startsWith('mxgraph.cisco_safe.')
      || !hasSvgRect
    );
    if (needsPointerRect) {
      const hitRect = this.builder.createRect(ctx.x, ctx.y, ctx.width, ctx.height, {
        fill: 'none',
        stroke: 'none',
        'pointer-events': 'all'
      });
      this.currentGroup.appendChild(hitRect);
    }
    const isElectricalStencil = !!(shapeName && shapeName.startsWith('mxgraph.electrical.'));
    let scaleX = ctx.width / srcW;
    let scaleY = ctx.height / srcH;
    const aspectDiff = Math.abs(scaleX - scaleY);
    const forceVariableAspect = !!shapeName && shapeName.startsWith('mxgraph.cisco19.bg');
    const fixedAspect = !forceVariableAspect && ((ctx.style.aspect as string) === 'fixed'
      || (ctx.style.imageAspect as string) === '1'
      || (isElectricalStencil && aspectDiff <= 0.05));
    let extraX = 0;
    let extraY = 0;
    if (fixedAspect) {
      const scale = Math.min(scaleX, scaleY);
      scaleX = scale;
      scaleY = scale;
      extraX = (ctx.width - srcW * scale) / 2;
      extraY = (ctx.height - srcH * scale) / 2;
    }
    let baseX = ctx.x + extraX - vbX * scaleX;
    let baseY = ctx.y + extraY - vbY * scaleY;
    if (shapeName === 'mxgraph.infographic.circularCallout2') {
      baseX -= 6.857;
      baseY -= 4.686;
    }
    if (shapeName === 'mxgraph.electrical.resistors.resistor_1') {
      baseX += 1;
    }
    const scaleStroke = Math.min(scaleX, scaleY);

    const rawFillColor = (ctx.style.fillColor as string) || '#ffffff';
    const resolvedFillColor = (rawFillColor === 'default' || rawFillColor === 'inherit')
      ? '#ffffff'
      : rawFillColor;
    let styleFill = this.normalizeColor(resolvedFillColor);
    const stencilFillOverrides: Record<string, { color: string; onlyWhenMissing?: boolean }> = {
      'mxgraph.citrix.laptop_1': { color: '#c7cdda', onlyWhenMissing: true },
      'mxgraph.citrix.tablet_1': { color: '#bec5d5', onlyWhenMissing: true },
      'mxgraph.citrix.laptop_2': { color: '#dedede' },
      'mxgraph.citrix.pda': { color: '#5d5d5d' },
      'mxgraph.citrix.users': { color: '#2782c2', onlyWhenMissing: true },
      'mxgraph.citrix.firewall': { color: '#ffffff' },
      'mxgraph.citrix.home_office': { color: '#bac1d3' },
      'mxgraph.citrix.hq_enterprise': { color: '#b7bed1' },
      'mxgraph.citrix.router': { color: '#9ea5b5' },
      'mxgraph.citrix.cache_server': { color: '#abb4c5' },
      'mxgraph.citrix.proxy_server': { color: '#abb4c5' },
      'mxgraph.citrix.switch': { color: '#b7bed1' },
      'mxgraph.citrix.site': { color: '#999ea4' }
    };
    const override = shapeName ? stencilFillOverrides[shapeName] : undefined;
    if (override) {
      const hasFill = (ctx.style.fillColor as string) !== undefined;
      if (!override.onlyWhenMissing || !hasFill) {
        styleFill = this.normalizeColor(override.color);
      }
    }
    const rawStrokeColor = (ctx.style.strokeColor as string) || '#000000';
    const resolvedStrokeColor = (rawStrokeColor === 'default' || rawStrokeColor === 'inherit')
      ? '#000000'
      : rawStrokeColor;
    let styleStroke = this.normalizeColor(resolvedStrokeColor);
    const baseFillColor = styleFill;
    const gradientColor = ctx.style.gradientColor as string | undefined;
    const gradientToken = typeof gradientColor === 'string' ? gradientColor.trim().toLowerCase() : '';
    if (gradientColor && gradientToken !== 'none' && gradientToken !== 'inherit' && gradientToken !== 'default' && baseFillColor !== 'none') {
      const gradientStart = baseFillColor;
      const gradientEnd = this.normalizeColor(gradientColor);
      const directionKey = getGradientDirectionKey(ctx.style.gradientDirection as string | undefined);
      const gradientId = `mx-gradient-${this.normalizeColorId(gradientStart)}-1-${this.normalizeColorId(gradientEnd)}-1-${directionKey}-0`;
      this.ensureLinearGradient(gradientId, gradientStart, gradientEnd, directionKey);
      styleFill = `url(#${gradientId})`;
    }
    const rawOpacity = parseFloat(ctx.style.opacity as string);
    const rawFillOpacity = parseFloat(ctx.style.fillOpacity as string);
    const rawStrokeOpacity = parseFloat(ctx.style.strokeOpacity as string);
    // Also consider builder's alpha state (set via setAlpha() in handlers)
    const builderAlpha = this.builder?.getAlpha();
    const hasBuilderAlpha = builderAlpha !== undefined && builderAlpha < 1;
    const styleOpacity = Number.isFinite(rawOpacity) ? rawOpacity : 100;
    // If builder has alpha set, use it (converted from 0-1 to 0-100 scale)
    let styleFillOpacity = Number.isFinite(rawFillOpacity) ? rawFillOpacity : styleOpacity;
    if (hasBuilderAlpha) {
      styleFillOpacity = builderAlpha * 100;
    }
    const styleStrokeOpacity = Number.isFinite(rawStrokeOpacity) ? rawStrokeOpacity : styleOpacity;
    if (shapeName === 'mxgraph.ios7.misc.keyboard_(letters)') {
      styleFill = this.normalizeColor('#e0e0e0');
      styleStroke = 'none';
    }
    const labelBackgroundColor = ctx.style.labelBackgroundColor as string | undefined;
    const timerStartFill = this.normalizeColor(labelBackgroundColor || (ctx.style.fillColor as string) || '#ffffff');
    let timerStartCircleIndex = 0;

    const transformPoint = (x: number, y: number, relative: boolean): { x: number; y: number } => {
      if (relative) {
        return { x: x * scaleX, y: y * scaleY };
      }
      const adjX = x - exportOffsetX;
      const adjY = y - exportOffsetY;
      return { x: baseX + adjX * scaleX, y: baseY + adjY * scaleY };
    };

    const transformLengthX = (val: number): number => val * scaleX;
    const transformLengthY = (val: number): number => val * scaleY;

    // For rack stencils, strokeColor token should be replaced with 'none'
    const isRackStencil = !!(shapeName && shapeName.startsWith('mxgraph.rack'));

    const replaceColorToken = (val: string): string => {
      // Handle {{token}} or {{token|default}} format
      const match = val.match(/^\{\{([^}|]+)(?:\|([^}]+))?\}\}$/);
      if (match) {
        const [, token, defaultVal] = match;
        const lower = token.toLowerCase();
        // strokeColor and strokeColor2 use styleStroke
        if (lower === 'strokecolor' || lower === 'strokecolor2') {
          return isRackStencil ? 'none' : styleStroke;
        }
        // strokeColor3-5: use from style or fall back to default value, then styleStroke
        const strokeMatch = lower.match(/^strokecolor([3-5])$/);
        if (strokeMatch) {
          const styleVal = ctx.style[`strokeColor${strokeMatch[1]}` as keyof typeof ctx.style] as string | undefined;
          return styleVal || defaultVal || styleStroke;
        }
        // fillColor uses styleFill directly
        if (lower === 'fillcolor') {
          return styleFill;
        }
        // fillColor2-8: use from style or fall back to default value, then styleFill
        const fillMatch = lower.match(/^fillcolor([2-8])$/);
        if (fillMatch) {
          const styleVal = ctx.style[`fillColor${fillMatch[1]}` as keyof typeof ctx.style] as string | undefined;
          return styleVal || defaultVal || styleFill;
        }
        // Unknown token with default - return default
        if (defaultVal) return defaultVal;
      }
      // Plain token format (legacy)
      const lower = val.toLowerCase().replace(/^\{\{|\}\}$/g, '');
      if (lower === 'strokecolor' || lower === 'strokecolor2') {
        return isRackStencil ? 'none' : styleStroke;
      }
      if (lower === 'fillcolor' || lower === 'fillcolor2' || lower === 'fillcolor3' || lower === 'fillcolor4') return styleFill;
      return val;
    };

    const transformPathData = (d: string): string => {
      const tokens = [...d.matchAll(/([a-zA-Z])|([-+]?\d*\.?\d+(?:e[-+]?\d+)?)/g)];
      let i = 0;
      let cmd = '';
      let cx = 0;
      let cy = 0;
      let sx = 0;
      let sy = 0;
      const out: string[] = [];
      const readNumber = () => parseFloat(tokens[i++][2]);
      const toAbs = (x: number, y: number, rel: boolean) => rel ? { x: cx + x, y: cy + y } : { x, y };
      const toOut = (x: number, y: number) => transformPoint(x, y, false);

      while (i < tokens.length) {
        const token = tokens[i];
        if (token[1]) {
          cmd = token[1];
          i++;
          if (cmd.toUpperCase() === 'Z') {
            out.push('Z');
            cx = sx;
            cy = sy;
          }
          continue;
        }

        const rel = cmd === cmd.toLowerCase();
        const upper = cmd.toUpperCase();

        switch (upper) {
          case 'M': {
            const x = readNumber();
            const y = readNumber();
            const abs = toAbs(x, y, rel);
            const pt = toOut(abs.x, abs.y);
            out.push('M', `${pt.x}`, `${pt.y}`);
            cx = abs.x;
            cy = abs.y;
            sx = abs.x;
            sy = abs.y;
            cmd = rel ? 'l' : 'L';
            break;
          }
          case 'L':
          case 'T': {
            const x = readNumber();
            const y = readNumber();
            const abs = toAbs(x, y, rel);
            const pt = toOut(abs.x, abs.y);
            out.push('L', `${pt.x}`, `${pt.y}`);
            cx = abs.x;
            cy = abs.y;
            break;
          }
          case 'H': {
            const x = readNumber();
            const abs = rel ? cx + x : x;
            const pt = toOut(abs, cy);
            out.push('L', `${pt.x}`, `${pt.y}`);
            cx = abs;
            break;
          }
          case 'V': {
            const y = readNumber();
            const abs = rel ? cy + y : y;
            const pt = toOut(cx, abs);
            out.push('L', `${pt.x}`, `${pt.y}`);
            cy = abs;
            break;
          }
          case 'C': {
            const x1 = readNumber();
            const y1 = readNumber();
            const x2 = readNumber();
            const y2 = readNumber();
            const x = readNumber();
            const y = readNumber();
            const a1 = toAbs(x1, y1, rel);
            const a2 = toAbs(x2, y2, rel);
            const a = toAbs(x, y, rel);
            const p1 = toOut(a1.x, a1.y);
            const p2 = toOut(a2.x, a2.y);
            const p = toOut(a.x, a.y);
            out.push('C', `${p1.x}`, `${p1.y}`, `${p2.x}`, `${p2.y}`, `${p.x}`, `${p.y}`);
            cx = a.x;
            cy = a.y;
            break;
          }
          case 'S': {
            const x2 = readNumber();
            const y2 = readNumber();
            const x = readNumber();
            const y = readNumber();
            const a2 = toAbs(x2, y2, rel);
            const a = toAbs(x, y, rel);
            const p2 = toOut(a2.x, a2.y);
            const p = toOut(a.x, a.y);
            out.push('S', `${p2.x}`, `${p2.y}`, `${p.x}`, `${p.y}`);
            cx = a.x;
            cy = a.y;
            break;
          }
          case 'Q': {
            const x1 = readNumber();
            const y1 = readNumber();
            const x = readNumber();
            const y = readNumber();
            const a1 = toAbs(x1, y1, rel);
            const a = toAbs(x, y, rel);
            const p1 = toOut(a1.x, a1.y);
            const p = toOut(a.x, a.y);
            out.push('Q', `${p1.x}`, `${p1.y}`, `${p.x}`, `${p.y}`);
            cx = a.x;
            cy = a.y;
            break;
          }
          case 'A': {
            const rx = readNumber();
            const ry = readNumber();
            const xAxisRotation = readNumber();
            const largeArc = readNumber();
            const sweep = readNumber();
            const x = readNumber();
            const y = readNumber();
            const a = toAbs(x, y, rel);
            void rx;
            void ry;
            void xAxisRotation;
            void largeArc;
            void sweep;
            const end = toOut(a.x, a.y);
            out.push('L', `${end.x}`, `${end.y}`);
            cx = a.x;
            cy = a.y;
            break;
          }
          default: {
            i++;
            break;
          }
        }
      }

      return out.join(' ');
    };

    const transformPointsAttr = (val: string): string => {
      const nums = val.trim().split(/[\s,]+/).map(n => parseFloat(n));
      const out: string[] = [];
      for (let idx = 0; idx + 1 < nums.length; idx += 2) {
        const pt = transformPoint(nums[idx], nums[idx + 1], false);
        out.push(`${pt.x},${pt.y}`);
      }
      return out.join(' ');
    };

    const transformElement = (el: Element): boolean => {
      if (el.hasAttribute('data-cell-id')) {
        el.removeAttribute('data-cell-id');
      }
      if (el.hasAttribute('transform')) {
        el.removeAttribute('transform');
      }

      const rawFill = el.getAttribute('fill') || '';
      const rawStroke = el.getAttribute('stroke') || '';


      if (el.hasAttribute('fill')) {
        el.setAttribute('fill', replaceColorToken(rawFill));
      }
      if (el.hasAttribute('stroke')) {
        el.setAttribute('stroke', replaceColorToken(rawStroke));
      }
      if (el.hasAttribute('fill')) {
        const fillValue = (el.getAttribute('fill') || '').trim();
        const fillUrlMatch = fillValue.match(/^url\(#([^\)]+)\)$/i);
        if (fillUrlMatch) {
          const rawGradientId = fillUrlMatch[1];
          if (/gradient-light-dark/i.test(rawGradientId)) {
            const fill2 = ctx.style.fillColor2 as string | undefined;
            const fill3 = ctx.style.fillColor3 as string | undefined;
            if (fill2 && fill3) {
              const start = this.normalizeColor(fill2);
              const end = this.normalizeColor(fill3);
              const gradientId = `drawio-svg-fixed-${this.normalizeColorId(start)}-${this.normalizeColorId(end)}`;
              this.ensureLinearGradient(gradientId, start, end, 's');
              el.setAttribute('fill', `url(#${gradientId})`);
            }
          }
        } else if (shapeName === 'mxgraph.infographic.circularCallout2') {
          const normalizedFill = fillValue.toLowerCase();
          const normalizedStyleFill = (styleFill || '').toLowerCase();
          const hasExplicitFill = ctx.style.fillColor !== undefined && ctx.style.fillColor !== 'none';
          if ((normalizedFill === '#000000' || normalizedFill === 'black')) {
            if (hasExplicitFill &&
                normalizedStyleFill &&
                normalizedStyleFill !== '#000000' &&
                normalizedStyleFill !== 'black' &&
                normalizedStyleFill !== 'none') {
              el.setAttribute('fill', styleFill);
            } else if (!hasExplicitFill && styleStroke && styleStroke !== 'none') {
              el.setAttribute('fill', styleStroke);
            }
          }
        } else if (exportOffsetX !== 0 || exportOffsetY !== 0) {
          const normalizedFill = fillValue.toLowerCase();
          const normalizedStyleFill = (styleFill || '').toLowerCase();
          const hasExplicitFill = ctx.style.fillColor !== undefined && ctx.style.fillColor !== 'none';
          if ((normalizedFill === '#000000' || normalizedFill === 'black')) {
            if (hasExplicitFill &&
                normalizedStyleFill &&
                normalizedStyleFill !== '#000000' &&
                normalizedStyleFill !== 'black' &&
                normalizedStyleFill !== 'none') {
              el.setAttribute('fill', styleFill);
            } else if (!hasExplicitFill && styleStroke && styleStroke !== 'none') {
              el.setAttribute('fill', styleStroke);
            }
          }
        }
      }
      if (el.hasAttribute('fill') && !el.hasAttribute('fill-opacity')) {
        const fill = (el.getAttribute('fill') || '').trim().toLowerCase();
        if (fill && fill !== 'none' && styleFillOpacity < 100) {
          el.setAttribute('fill-opacity', String(styleFillOpacity / 100));
        }
      }
      if (el.hasAttribute('stroke') && !el.hasAttribute('stroke-opacity')) {
        const stroke = (el.getAttribute('stroke') || '').trim().toLowerCase();
        if (stroke && stroke !== 'none' && styleStrokeOpacity < 100) {
          el.setAttribute('stroke-opacity', String(styleStrokeOpacity / 100));
        }
      }
      const shouldUseUnscaledStroke = exportOffsetX !== 0 || exportOffsetY !== 0;
      if (el.hasAttribute('stroke-width')) {
        const rawStrokeWidth = el.getAttribute('stroke-width') || '';
        let sw = parseFloat(rawStrokeWidth);
        if (!Number.isFinite(sw) && rawStrokeWidth.includes('{{strokeWidth}}')) {
          const styleStrokeWidth = parseFloat(ctx.style.strokeWidth as string) || 1;
          el.setAttribute('stroke-width', String(styleStrokeWidth));
        } else if (Number.isFinite(sw)) {
          const scaledStrokeWidth = shouldUseUnscaledStroke
            ? Math.round(sw * 100) / 100
            : Math.round(sw * scaleStroke * 100) / 100;
          el.setAttribute('stroke-width', String(scaledStrokeWidth));
        }
      } else if (shouldUseUnscaledStroke) {
        const stroke = (el.getAttribute('stroke') || '').trim().toLowerCase();
        if (stroke && stroke !== 'none') {
          const styleStrokeWidth = parseFloat(ctx.style.strokeWidth as string) || 1;
          el.setAttribute('stroke-width', String(styleStrokeWidth));
        }
      }
      if (el.hasAttribute('font-size')) {
        const fs = parseFloat(el.getAttribute('font-size') || '0');
        if (fs) el.setAttribute('font-size', String(fs * scaleStroke));
      }

      switch (el.tagName) {
        case 'path': {
          const d = el.getAttribute('d') || '';
          const fill = el.getAttribute('fill') || '';
          const stroke = el.getAttribute('stroke') || '';
          const fillId = this.normalizeColorId(fill);
          const strokeId = this.normalizeColorId(stroke);

          if (shapeName === 'mxgraph.citrix.desktop' && stroke === 'none' && /fillcolor/i.test(rawFill)) {
            return false;
          }

          if (shapeName === 'mxgraph.cisco.storage.cisco_file_engine' && fillId === 'ffffff' && strokeId === 'ffffff') {
            el.setAttribute('fill', styleFill);
          }

          if ((shapeName === 'mxgraph.ios7.misc.check' || shapeName === 'mxgraph.cisco.computers_and_peripherals.workstation') &&
              fill && fill !== 'none' && !/[Zz]/.test(d)) {
            el.setAttribute('fill', 'none');
          }

          el.setAttribute('d', transformPathData(d));
          if (shapeName === 'mxgraph.signs.travel.euro') {
            const currentFill = (el.getAttribute('fill') || '').toLowerCase();
            if (!currentFill || currentFill === 'none') {
              el.setAttribute('fill', styleFill);
            }
            el.setAttribute('stroke', 'none');
          }
          break;
        }
        case 'rect': {
          const x = parseFloat(el.getAttribute('x') || '0');
          const y = parseFloat(el.getAttribute('y') || '0');
          const width = parseFloat(el.getAttribute('width') || '0');
          const height = parseFloat(el.getAttribute('height') || '0');
          const pt = transformPoint(x, y, false);
          el.setAttribute('x', String(pt.x));
          el.setAttribute('y', String(pt.y));
          el.setAttribute('width', String(transformLengthX(width)));
          el.setAttribute('height', String(transformLengthY(height)));
          if (el.hasAttribute('rx')) {
            const rx = parseFloat(el.getAttribute('rx') || '0');
            el.setAttribute('rx', String(transformLengthX(rx)));
          }
          if (el.hasAttribute('ry')) {
            const ry = parseFloat(el.getAttribute('ry') || '0');
            el.setAttribute('ry', String(transformLengthY(ry)));
          }
          break;
        }
        case 'ellipse': {
          const cx = parseFloat(el.getAttribute('cx') || '0');
          const cy = parseFloat(el.getAttribute('cy') || '0');
          const rx = parseFloat(el.getAttribute('rx') || '0');
          const ry = parseFloat(el.getAttribute('ry') || '0');
          const pt = transformPoint(cx, cy, false);
          el.setAttribute('cx', String(pt.x));
          el.setAttribute('cy', String(pt.y));
          el.setAttribute('rx', String(transformLengthX(rx)));
          el.setAttribute('ry', String(transformLengthY(ry)));
          if (shapeName === 'mxgraph.bpmn.timer_start') {
            if (timerStartCircleIndex === 0) {
              el.setAttribute('fill', timerStartFill);
            }
            timerStartCircleIndex += 1;
          }
          break;
        }
        case 'circle': {
          const cx = parseFloat(el.getAttribute('cx') || '0');
          const cy = parseFloat(el.getAttribute('cy') || '0');
          const r = parseFloat(el.getAttribute('r') || '0');
          const pt = transformPoint(cx, cy, false);
          const rx = transformLengthX(r);
          const ry = transformLengthY(r);
          if (this.builder) {
            const ellipse = this.builder.createEllipse(pt.x, pt.y, rx, ry);
            for (let i = 0; i < el.attributes.length; i++) {
              const attr = el.attributes[i];
              if (attr.name === 'cx' || attr.name === 'cy' || attr.name === 'r') continue;
              ellipse.setAttribute(attr.name, attr.value);
            }
            if (shapeName === 'mxgraph.bpmn.timer_start') {
              if (timerStartCircleIndex === 0) {
                ellipse.setAttribute('fill', timerStartFill);
              }
              timerStartCircleIndex += 1;
            }
            if (el.parentNode) {
              el.parentNode.replaceChild(ellipse, el);
            }
            break;
          }
          break;
        }
        case 'line': {
          const x1 = parseFloat(el.getAttribute('x1') || '0');
          const y1 = parseFloat(el.getAttribute('y1') || '0');
          const x2 = parseFloat(el.getAttribute('x2') || '0');
          const y2 = parseFloat(el.getAttribute('y2') || '0');
          const p1 = transformPoint(x1, y1, false);
          const p2 = transformPoint(x2, y2, false);
          el.setAttribute('x1', String(p1.x));
          el.setAttribute('y1', String(p1.y));
          el.setAttribute('x2', String(p2.x));
          el.setAttribute('y2', String(p2.y));
          break;
        }
        case 'polygon':
        case 'polyline': {
          const points = el.getAttribute('points') || '';
          if (points) {
            el.setAttribute('points', transformPointsAttr(points));
          }
          break;
        }
        case 'image': {
          const x = parseFloat(el.getAttribute('x') || '0');
          const y = parseFloat(el.getAttribute('y') || '0');
          const width = parseFloat(el.getAttribute('width') || '0');
          const height = parseFloat(el.getAttribute('height') || '0');
          const pt = transformPoint(x, y, false);
          el.setAttribute('x', String(pt.x));
          el.setAttribute('y', String(pt.y));
          el.setAttribute('width', String(transformLengthX(width)));
          el.setAttribute('height', String(transformLengthY(height)));
          break;
        }
        case 'text': {
          const x = parseFloat(el.getAttribute('x') || '0');
          let y = parseFloat(el.getAttribute('y') || '0');
          const scaledFontSize = parseFloat(el.getAttribute('font-size') || '0');
          const rawFontSize = scaleStroke ? scaledFontSize / scaleStroke : scaledFontSize;
          const dominant = el.getAttribute('dominant-baseline');
          const isCiscoToken = shapeName === 'mxgraph.cisco.misc.token';
          if (dominant) {
            if (dominant === 'middle') {
              y += rawFontSize / (isCiscoToken ? 4 : 6);
            } else if (dominant === 'hanging') {
              y += rawFontSize - 1;
            } else if (dominant === 'auto') {
              y -= 1;
            }
            el.removeAttribute('dominant-baseline');
          } else {
            const textAnchor = el.getAttribute('text-anchor');
            if (textAnchor === 'middle' && !el.hasAttribute('dy')) {
              if (rawFontSize) {
                y += rawFontSize / (isCiscoToken ? 4 : 6);
              }
            }
          }
          const pt = transformPoint(x, y, false);
          let outY = pt.y;
          if (isCiscoToken && scaledFontSize) {
            outY += scaledFontSize / 6;
          }
          el.setAttribute('x', String(pt.x));
          el.setAttribute('y', String(outY));
          break;
        }
        default:
          break;
      }

      if (el.tagName === 'rect') {
        const fill = el.getAttribute('fill') || '';
        const stroke = el.getAttribute('stroke') || '';
        const fillOpacity = parseFloat(el.getAttribute('fill-opacity') || '1');
        const strokeOpacity = parseFloat(el.getAttribute('stroke-opacity') || '1');
        const w = parseFloat(el.getAttribute('width') || '0');
        const h = parseFloat(el.getAttribute('height') || '0');
        const isBlack = (v: string) => v === '#000000' || v === 'rgb(0, 0, 0)';
        if (w > 0 && h > 0 && fillOpacity < 1 && strokeOpacity < 1 && isBlack(fill) && isBlack(stroke)) {
          return false;
        }
      }

      for (let i = 0; i < el.children.length; i++) {
        if (!transformElement(el.children[i])) {
          el.children[i].remove();
          i--;
        }
      }
      return true;
    };

    const g = this.builder.createGroup();
    if (hasShadow && (shapeName === 'mxgraph.office.concepts.best_practices' || shapeName === 'mxgraph.office.concepts.help')) {
      const rect = this.builder.createRect(ctx.x, ctx.y, ctx.width, ctx.height, {
        fill: 'none',
        stroke: 'none',
        'pointer-events': 'all'
      });
      g.appendChild(rect);
    }
    for (let i = 0; i < svgEl.childNodes.length; i++) {
      const node = svgEl.childNodes[i];
      if (node.nodeType !== 1) continue;
      const imported = this.builder.doc.importNode(node, true) as Element;
      if (transformElement(imported)) {
        g.appendChild(imported);
      }
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
      const dataShape = shape && this.getStencilSvgFromResource(shape) ? shape : undefined;
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

    renderVertexLabel(
      {
        renderLabel: this.renderLabel.bind(this),
        renderSwimlaneLabel: this.renderSwimlaneLabel.bind(this),
      },
      buildLabelParams(x, y, width, height)
    );

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
        getStencilSvg: this.getStencilSvg.bind(this),
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
        getStencilSvg: this.getStencilSvg.bind(this),
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
    const originalStartPoint = { ...startPoint };
    const originalEndPoint = { ...endPoint };

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
