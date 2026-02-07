/**
 * SVG Builder - DOM-based SVG construction
 * 
 * Uses DOMParser/XMLSerializer for reliable SVG generation.
 * Provides helper methods to create SVG elements with proper structure.
 */

import { measureMultilineText, measureTextLayout } from '../text/index.ts';
import { DEFAULT_FONT_FAMILY } from '../text/index.ts';
import { createPlaceholderInlineSvg } from '../renderer/placeholder-svg.ts';

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

function isMissingSapIcon(src: string): boolean {
  return /\b(?:about:\/\/img\/)?img\/lib\/sap\/\.svg$/i.test(src);
}

/**
 * SVG Document Builder
 * Creates and manages an SVG document using DOM APIs
 */
export class SvgBuilder {
  readonly doc: Document;
  readonly svg: Element;
  private defs: Element | null = null;
  private canvasRoot: Element;
  private canvasState: CanvasState;
  private readonly canvasStates: CanvasState[] = [];
  private canvasNode: Element | null = null;
  private canvasPathParts: string[] | null = null;
  private canvasGradientId = 0;
  private canvasClipId = 0;
  private canvasCurrentX = 0;
  private canvasCurrentY = 0;

  /**
   * Alias for svg property - returns the root SVG element
   */
  get root(): Element {
    return this.svg;
  }

  constructor(width?: number, height?: number) {
    // Create empty SVG document
    this.doc = new DOMParser().parseFromString(
      `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="${SVG_NS}" xmlns:xlink="${XLINK_NS}" version="1.1"></svg>`,
      'text/xml'
    );
    this.svg = this.doc.documentElement;
    this.canvasRoot = this.svg;
    
    // Set dimensions if provided
    if (width !== undefined && height !== undefined) {
      this.setDimensions(width, height);
    }

    this.canvasState = this.createCanvasState();
  }

  /**
   * Set SVG dimensions and viewBox
   */
  setDimensions(width: number, height: number, viewBox?: string): this {
    this.svg.setAttribute('width', `${width}px`);
    this.svg.setAttribute('height', `${height}px`);
    if (viewBox) {
      this.svg.setAttribute('viewBox', viewBox);
    }
    return this;
  }

  /**
   * Get or create the <defs> element
   */
  getDefs(): Element {
    if (!this.defs) {
      this.defs = this.createElement('defs');
      // Insert defs as first child
      if (this.svg.firstChild) {
        this.svg.insertBefore(this.defs, this.svg.firstChild);
      } else {
        this.svg.appendChild(this.defs);
      }
    }
    return this.defs;
  }

  /**
   * Create an SVG element
   */
  createElement(tagName: string): Element {
    return this.doc.createElementNS(SVG_NS, tagName);
  }

  /**
   * Create a group element with optional data-cell-id
   */
  createGroup(cellId?: string): Element {
    const g = this.createElement('g');
    if (cellId) {
      g.setAttribute('data-cell-id', cellId);
    }
    return g;
  }

  /**
   * Create a path element
   */
  createPath(d: string, attrs?: Record<string, string | number>): Element {
    const path = this.createElement('path');
    path.setAttribute('d', d);
    if (attrs) {
      this.setAttributes(path, attrs);
    }
    return path;
  }

  /**
   * Create a rect element
   */
  createRect(x: number, y: number, width: number, height: number, attrs?: Record<string, string | number>): Element {
    const rect = this.createElement('rect');
    rect.setAttribute('x', String(x));
    rect.setAttribute('y', String(y));
    rect.setAttribute('width', String(width));
    rect.setAttribute('height', String(height));
    if (attrs) {
      this.setAttributes(rect, attrs);
    }
    return rect;
  }

  /**
   * Create a circle element
   */
  createCircle(cx: number, cy: number, r: number, attrs?: Record<string, string | number>): Element {
    const circle = this.createElement('circle');
    circle.setAttribute('cx', String(cx));
    circle.setAttribute('cy', String(cy));
    circle.setAttribute('r', String(r));
    if (attrs) {
      this.setAttributes(circle, attrs);
    }
    return circle;
  }

  /**
   * Create an ellipse element
   */
  createEllipse(cx: number, cy: number, rx: number, ry: number, attrs?: Record<string, string | number>): Element {
    const ellipse = this.createElement('ellipse');
    ellipse.setAttribute('cx', String(cx));
    ellipse.setAttribute('cy', String(cy));
    ellipse.setAttribute('rx', String(rx));
    ellipse.setAttribute('ry', String(ry));
    if (attrs) {
      this.setAttributes(ellipse, attrs);
    }
    return ellipse;
  }

  /**
   * Create a line element
   */
  createLine(x1: number, y1: number, x2: number, y2: number, attrs?: Record<string, string | number>): Element {
    const line = this.createElement('line');
    line.setAttribute('x1', String(x1));
    line.setAttribute('y1', String(y1));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y2));
    if (attrs) {
      this.setAttributes(line, attrs);
    }
    return line;
  }

  /**
   * Create a text element
   */
  createText(x: number, y: number, content: string, attrs?: Record<string, string | number>): Element {
    const text = this.createElement('text');
    text.setAttribute('x', String(x));
    text.setAttribute('y', String(y));
    text.textContent = content;
    if (attrs) {
      this.setAttributes(text, attrs);
    }
    return text;
  }

  /**
   * Create a clipPath element and add to defs
   * If rect coordinates are provided, creates a rect child element inside the clipPath
   */
  createClipPath(id: string, x?: number, y?: number, width?: number, height?: number): Element {
    const clipPath = this.createElement('clipPath');
    clipPath.setAttribute('id', id);
    
    // If rect coordinates are provided, create a rect child
    if (x !== undefined && y !== undefined && width !== undefined && height !== undefined) {
      const rect = this.createRect(x, y, width, height);
      clipPath.appendChild(rect);
    }
    
    this.getDefs().appendChild(clipPath);
    return clipPath;
  }

  /**
   * Create a foreignObject element (for HTML content)
   */
  createForeignObject(x: number, y: number, width: number, height: number): Element {
    const fo = this.createElement('foreignObject');
    fo.setAttribute('x', String(x));
    fo.setAttribute('y', String(y));
    fo.setAttribute('width', String(width));
    fo.setAttribute('height', String(height));
    return fo;
  }

  /**
   * Create an image element
   */
  createImage(x: number, y: number, width: number, height: number, href: string, attrs?: Record<string, string | number>): Element {
    const image = this.createElement('image');
    image.setAttribute('x', String(x));
    image.setAttribute('y', String(y));
    image.setAttribute('width', String(width));
    image.setAttribute('height', String(height));
    // Use xlink:href for compatibility
    image.setAttributeNS(XLINK_NS, 'xlink:href', href);
    if (attrs) {
      this.setAttributes(image, attrs);
    }
    return image;
  }

  /**
   * Set multiple attributes on an element
   */
  setAttributes(el: Element, attrs: Record<string, string | number | undefined>): void {
    for (const [key, value] of Object.entries(attrs)) {
      if (value !== undefined && value !== null && value !== '') {
        el.setAttribute(key, String(value));
      }
    }
  }

  /**
   * Set style attribute (for CSS properties like filter)
   */
  setStyle(el: Element, styles: Record<string, string>): void {
    const styleStr = Object.entries(styles)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
    if (styleStr) {
      el.setAttribute('style', styleStr);
    }
  }

  /**
   * Set transform attribute
   */
  setTransform(el: Element, transforms: {
    translate?: { x: number; y: number };
    rotate?: { angle: number; cx?: number; cy?: number };
    scale?: number | { x: number; y: number };
  }): void {
    const parts: string[] = [];
    
    if (transforms.translate) {
      parts.push(`translate(${transforms.translate.x}, ${transforms.translate.y})`);
    }
    if (transforms.rotate) {
      const r = transforms.rotate;
      if (r.cx !== undefined && r.cy !== undefined) {
        parts.push(`rotate(${r.angle}, ${r.cx}, ${r.cy})`);
      } else {
        parts.push(`rotate(${r.angle})`);
      }
    }
    if (transforms.scale !== undefined) {
      if (typeof transforms.scale === 'number') {
        parts.push(`scale(${transforms.scale})`);
      } else {
        parts.push(`scale(${transforms.scale.x}, ${transforms.scale.y})`);
      }
    }
    
    if (parts.length > 0) {
      el.setAttribute('transform', parts.join(' '));
    }
  }

  /**
   * Apply the platform style transforms to an element
   */
  applyTransform(
    el: Element,
    options: {
      rotation?: number;
      flipH?: boolean;
      flipV?: boolean;
      direction?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      cx?: number;
      cy?: number;
    }
  ): void {
    const direction = (options.direction || '').toLowerCase();
    let rotation = options.rotation || 0;
    if (direction === 'north') rotation += 270;
    else if (direction === 'west') rotation += 180;
    else if (direction === 'south') rotation += 90;

    let cx = options.cx;
    let cy = options.cy;
    if (cx === undefined || cy === undefined) {
      if (
        options.x !== undefined &&
        options.y !== undefined &&
        options.width !== undefined &&
        options.height !== undefined
      ) {
        cx = options.x + options.width / 2;
        cy = options.y + options.height / 2;
      }
    }

    const flipH = options.flipH === true;
    const flipV = options.flipV === true;
    const hasFlip = flipH || flipV;

    const parts: string[] = [];
    if (cx !== undefined && cy !== undefined && (hasFlip || rotation !== 0)) {
      parts.push(`translate(${cx}, ${cy})`);
      if (hasFlip) {
        const sx = flipH ? -1 : 1;
        const sy = flipV ? -1 : 1;
        parts.push(`scale(${sx}, ${sy})`);
      }
      if (rotation !== 0) {
        parts.push(`rotate(${rotation})`);
      }
      parts.push(`translate(${-cx}, ${-cy})`);
    } else {
      if (hasFlip) {
        const sx = flipH ? -1 : 1;
        const sy = flipV ? -1 : 1;
        parts.push(`scale(${sx}, ${sy})`);
      }
      if (rotation !== 0) {
        parts.push(`rotate(${rotation})`);
      }
    }

    if (parts.length > 0) {
      el.setAttribute('transform', parts.join(' '));
    }
  }

  /**
   * Create a rounded rectangle path
   */
  createRoundedRectPath(x: number, y: number, width: number, height: number, r: number): string {
    const radius = Math.max(0, Math.min(r, Math.min(width, height) / 2));
    const x0 = x;
    const y0 = y;
    const x1 = x + width;
    const y1 = y + height;

    return [
      `M ${x0 + radius} ${y0}`,
      `L ${x1 - radius} ${y0}`,
      `Q ${x1} ${y0} ${x1} ${y0 + radius}`,
      `L ${x1} ${y1 - radius}`,
      `Q ${x1} ${y1} ${x1 - radius} ${y1}`,
      `L ${x0 + radius} ${y1}`,
      `Q ${x0} ${y1} ${x0} ${y1 - radius}`,
      `L ${x0} ${y0 + radius}`,
      `Q ${x0} ${y0} ${x0 + radius} ${y0}`,
      'Z'
    ].join(' ');
  }

  /**
   * Create polygon path from points
   */
  createPolygonPath(points: Array<{ x: number; y: number }>): string {
    if (!points.length) return '';
    const [first, ...rest] = points;
    const parts = [`M ${first.x} ${first.y}`];
    for (const pt of rest) {
      parts.push(`L ${pt.x} ${pt.y}`);
    }
    parts.push('Z');
    return parts.join(' ');
  }

  /**
   * Create arc path using SVG A command
   */
  createArcPath(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    startAngle: number,
    endAngle: number,
    sweep: 0 | 1 = 1
  ): string {
    const toRad = (deg: number): number => (deg * Math.PI) / 180;
    const start = toRad(startAngle);
    const end = toRad(endAngle);
    const sx = cx + rx * Math.cos(start);
    const sy = cy + ry * Math.sin(start);
    const ex = cx + rx * Math.cos(end);
    const ey = cy + ry * Math.sin(end);
    const delta = Math.abs(end - start);
    const largeArc = delta > Math.PI ? 1 : 0;
    return `M ${sx} ${sy} A ${rx} ${ry} 0 ${largeArc} ${sweep} ${ex} ${ey}`;
  }

  /**
   * Apply stroke-related attributes
   */
  applyStroke(
    el: Element,
    options: {
      color: string;
      width?: number;
      dashed?: boolean;
      dashPattern?: string;
      lineJoin?: string;
      lineCap?: string;
      opacity?: number;
    }
  ): void {
    if (options.color === 'none') {
      el.setAttribute('stroke', 'none');
      return;
    }

    el.setAttribute('stroke', options.color);
    if (options.width !== undefined) {
      el.setAttribute('stroke-width', String(options.width));
    }
    if (options.dashed) {
      const pattern = options.dashPattern || '3 3';
      el.setAttribute('stroke-dasharray', pattern);
    }
    if (options.lineJoin) {
      el.setAttribute('stroke-linejoin', options.lineJoin);
    }
    if (options.lineCap) {
      el.setAttribute('stroke-linecap', options.lineCap);
    }
    if (options.opacity !== undefined) {
      el.setAttribute('stroke-opacity', String(options.opacity));
    }
  }

  /**
   * Apply fill-related attributes
   */
  applyFill(
    el: Element,
    options: {
      color: string;
      opacity?: number;
      gradientId?: string;
    }
  ): void {
    if (options.gradientId) {
      el.setAttribute('fill', `url(#${options.gradientId})`);
    } else {
      el.setAttribute('fill', options.color);
    }
    if (options.opacity !== undefined) {
      el.setAttribute('fill-opacity', String(options.opacity));
    }
  }

  /**
   * Draw path with attributes
   */
  drawPath(d: string, attrs?: Record<string, string | number>): Element {
    return this.createPath(d, attrs);
  }

  /**
   * Draw rect with attributes
   */
  drawRect(x: number, y: number, width: number, height: number, attrs?: Record<string, string | number>): Element {
    return this.createRect(x, y, width, height, attrs);
  }

  /**
   * Draw ellipse with attributes
   */
  drawEllipse(cx: number, cy: number, rx: number, ry: number, attrs?: Record<string, string | number>): Element {
    return this.createEllipse(cx, cy, rx, ry, attrs);
  }

  /**
   * Optional shadow hook (no-op for now)
   */
  applyShadow(el: Element): Element {
    return el;
  }

  /**
   * Optional glass hook (no-op for now)
   */
  applyGlass(el: Element): Element {
    return el;
  }

  /**
   * Create an HTML element (for use inside foreignObject)
   * Uses XHTML namespace for proper SVG embedding
   */
  createHtmlElement(tagName: string): Element {
    return this.doc.createElementNS('http://www.w3.org/1999/xhtml', tagName);
  }

  /**
   * Wrap element with drop-shadow filter
   */
  wrapWithShadow(el: Element, offsetX: number = 2, offsetY: number = 3, blur: number = 2, color: string = 'rgba(0, 0, 0, 0.25)'): Element {
    const g = this.createElement('g');
    g.setAttribute('style', `filter: drop-shadow(${color} ${offsetX}px ${offsetY}px ${blur}px);`);
    g.appendChild(el);
    return g;
  }

  /**
   * Set canvas output root for the platform-style API
   */
  setCanvasRoot(root: Element | null): void {
    this.canvasRoot = root ?? this.svg;
  }

  /**
   * Reset canvas transform state (translate/scale/transform list)
   */
  resetCanvasTransform(): void {
    this.canvasState.dx = 0;
    this.canvasState.dy = 0;
    this.canvasState.scale = 1;
    this.canvasState.transform = [];
  }

  private createCanvasState(): CanvasState {
    return {
      dx: 0,
      dy: 0,
      scale: 1,
      alpha: 1,
      fillAlpha: 1,
      strokeAlpha: 1,
      fillColor: null,
      strokeColor: null,
      strokeWidth: 1,
      dashed: false,
      dashPattern: '3 3',
      lineCap: 'flat',
      lineJoin: 'miter',
      miterLimit: 10,
      fillStyle: null,
      fontColor: '#000000',
      fontFamily: DEFAULT_FONT_FAMILY,
      fontSize: 12,
      fontStyle: 0,
      fontBackgroundColor: null,
      fontBorderColor: null,
      shadow: false,
      shadowColor: 'rgba(0,0,0,0.25)',
      shadowAlpha: 1,
      shadowDx: 2,
      shadowDy: 3,
      transform: [],
      link: null,
      title: null,
    };
  }

  private cloneCanvasState(state: CanvasState): CanvasState {
    return {
      ...state,
      transform: [...state.transform],
      link: state.link ? { ...state.link } : null,
    };
  }

  private ensureCanvasPath(): boolean {
    if (!this.canvasPathParts) {
      return false;
    }
    if (!this.canvasNode || this.canvasNode.tagName !== 'path') {
      this.canvasNode = this.createElement('path');
    }
    return true;
  }

  private applyCanvasTransform(el: Element): void {
    if (this.canvasState.transform.length > 0) {
      el.setAttribute('transform', this.canvasState.transform.join(' '));
    }
  }

  private applyCanvasCommonStyles(_el: Element): void {
    // alpha is applied via fillAlpha and strokeAlpha multiplication (like the platform)
    // See applyCanvasStroke and applyCanvasFill
  }

  private applyCanvasStroke(el: Element): void {
    if (this.canvasState.strokeColor == null) {
      el.setAttribute('stroke', 'none');
    } else {
      el.setAttribute('stroke', this.canvasState.strokeColor);
      el.setAttribute('stroke-width', String(this.canvasState.strokeWidth));
      // the platform: stroke-opacity = alpha * strokeAlpha
      const strokeOpacity = this.canvasState.alpha * this.canvasState.strokeAlpha;
      if (strokeOpacity !== 1) {
        el.setAttribute('stroke-opacity', String(strokeOpacity));
      }
      if (this.canvasState.dashed) {
        const rawPattern = this.canvasState.dashPattern || '3 3';
        const trimmed = rawPattern.trim();
        let resolvedPattern = trimmed;
        if (trimmed === '3 3' && this.canvasState.strokeWidth !== 1) {
          const tokens = trimmed.split(/[ ,]+/).filter((token) => token.length > 0);
          const scaledTokens = tokens.map((token) => {
            const value = parseFloat(token);
            if (!Number.isFinite(value)) return token;
            const scaled = value * this.canvasState.strokeWidth;
            return Number.isFinite(scaled) ? String(scaled) : token;
          });
          resolvedPattern = scaledTokens.join(' ');
        }
        el.setAttribute('stroke-dasharray', resolvedPattern);
      }
      el.setAttribute('stroke-linecap', this.canvasState.lineCap);
      el.setAttribute('stroke-linejoin', this.canvasState.lineJoin);
      el.setAttribute('stroke-miterlimit', String(this.canvasState.miterLimit));
    }
  }

  private applyCanvasFill(el: Element): void {
    if (this.canvasState.fillColor == null) {
      el.setAttribute('fill', 'none');
    } else {
      el.setAttribute('fill', this.canvasState.fillColor);
      // the platform: fill-opacity = alpha * fillAlpha
      const fillOpacity = this.canvasState.alpha * this.canvasState.fillAlpha;
      if (fillOpacity !== 1) {
        el.setAttribute('fill-opacity', String(fillOpacity));
      }
    }
  }

  private createCanvasGradient(
    color1: string,
    color2: string,
    direction?: string,
    alpha1?: number,
    alpha2?: number
  ): string {
    const id = `mx-grad-${this.canvasGradientId++}`;
    const gradient = this.createElement('linearGradient');
    gradient.setAttribute('id', id);

    const dir = (direction || '').toLowerCase();
    if (dir === 'east') {
      gradient.setAttribute('x1', '0');
      gradient.setAttribute('y1', '0');
      gradient.setAttribute('x2', '1');
      gradient.setAttribute('y2', '0');
    } else if (dir === 'west') {
      gradient.setAttribute('x1', '1');
      gradient.setAttribute('y1', '0');
      gradient.setAttribute('x2', '0');
      gradient.setAttribute('y2', '0');
    } else if (dir === 'north') {
      gradient.setAttribute('x1', '0');
      gradient.setAttribute('y1', '1');
      gradient.setAttribute('x2', '0');
      gradient.setAttribute('y2', '0');
    } else {
      gradient.setAttribute('x1', '0');
      gradient.setAttribute('y1', '0');
      gradient.setAttribute('x2', '0');
      gradient.setAttribute('y2', '1');
    }

    const stop1 = this.createElement('stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', color1);
    if (alpha1 !== undefined) {
      stop1.setAttribute('stop-opacity', String(alpha1));
    }
    gradient.appendChild(stop1);

    const stop2 = this.createElement('stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', color2);
    if (alpha2 !== undefined) {
      stop2.setAttribute('stop-opacity', String(alpha2));
    }
    gradient.appendChild(stop2);

    this.getDefs().appendChild(gradient);
    return id;
  }

  private attachCanvasNode(el: Element): void {
    if (this.canvasState.title) {
      const title = this.createElement('title');
      title.textContent = this.canvasState.title;
      el.appendChild(title);
    }

    let target: Element = el;
    if (this.canvasState.shadow) {
      // Shadow rendering disabled to match the platform SVG export output (no drop-shadow filter).
    }
    if (this.canvasState.link) {
      const link = this.createElement('a');
      link.setAttributeNS(XLINK_NS, 'xlink:href', this.canvasState.link.href);
      if (this.canvasState.link.target) {
        link.setAttribute('target', this.canvasState.link.target);
      }
      link.appendChild(el);
      target = link;
    }

    this.canvasRoot.appendChild(target);
    this.canvasNode = null;
    this.canvasPathParts = null;
  }

  private finalizeCanvasPath(): void {
    if (this.canvasNode && this.canvasPathParts && this.canvasNode.tagName === 'path') {
      this.canvasNode.setAttribute('d', this.canvasPathParts.join(' '));
    }
  }

  private hasCanvasPathData(): boolean {
    return !!this.canvasPathParts && this.canvasPathParts.length > 0;
  }

  save(): void {
    this.canvasStates.push(this.cloneCanvasState(this.canvasState));
  }

  restore(): void {
    const prev = this.canvasStates.pop();
    if (prev) {
      this.canvasState = prev;
    }
  }

  translate(dx: number, dy: number): void {
    this.canvasState.dx += dx;
    this.canvasState.dy += dy;
  }

  scale(value: number): void {
    this.canvasState.scale *= value;
    this.canvasState.strokeWidth *= value;
  }

  rotate(theta: number, flipH?: boolean, flipV?: boolean, cx?: number, cy?: number): void {
    if (flipH || flipV) {
      const sx = flipH ? -1 : 1;
      const sy = flipV ? -1 : 1;
      this.canvasState.transform.push(`scale(${sx}, ${sy})`);
    }
    if (cx !== undefined && cy !== undefined) {
      this.canvasState.transform.push(`rotate(${theta}, ${cx}, ${cy})`);
    } else {
      this.canvasState.transform.push(`rotate(${theta})`);
    }
  }

  begin(): void {
    this.canvasNode = this.createElement('path');
    this.canvasPathParts = [];
    this.canvasCurrentX = 0;
    this.canvasCurrentY = 0;
  }

  moveTo(x: number, y: number): void {
    if (!this.ensureCanvasPath()) {
      return;
    }
    const sx = (x + this.canvasState.dx) * this.canvasState.scale;
    const sy = (y + this.canvasState.dy) * this.canvasState.scale;
    this.canvasPathParts?.push(`M ${sx} ${sy}`);
    this.canvasCurrentX = sx;
    this.canvasCurrentY = sy;
  }

  lineTo(x: number, y: number): void {
    if (!this.ensureCanvasPath()) {
      return;
    }
    const sx = (x + this.canvasState.dx) * this.canvasState.scale;
    const sy = (y + this.canvasState.dy) * this.canvasState.scale;
    this.canvasPathParts?.push(`L ${sx} ${sy}`);
    this.canvasCurrentX = sx;
    this.canvasCurrentY = sy;
  }

  quadTo(x1: number, y1: number, x2: number, y2: number): void {
    if (!this.ensureCanvasPath()) {
      return;
    }
    const sx1 = (x1 + this.canvasState.dx) * this.canvasState.scale;
    const sy1 = (y1 + this.canvasState.dy) * this.canvasState.scale;
    const sx2 = (x2 + this.canvasState.dx) * this.canvasState.scale;
    const sy2 = (y2 + this.canvasState.dy) * this.canvasState.scale;
    this.canvasPathParts?.push(`Q ${sx1} ${sy1} ${sx2} ${sy2}`);
    this.canvasCurrentX = sx2;
    this.canvasCurrentY = sy2;
  }

  curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
    if (!this.ensureCanvasPath()) {
      return;
    }
    const sx1 = (x1 + this.canvasState.dx) * this.canvasState.scale;
    const sy1 = (y1 + this.canvasState.dy) * this.canvasState.scale;
    const sx2 = (x2 + this.canvasState.dx) * this.canvasState.scale;
    const sy2 = (y2 + this.canvasState.dy) * this.canvasState.scale;
    const sx3 = (x3 + this.canvasState.dx) * this.canvasState.scale;
    const sy3 = (y3 + this.canvasState.dy) * this.canvasState.scale;
    this.canvasPathParts?.push(`C ${sx1} ${sy1} ${sx2} ${sy2} ${sx3} ${sy3}`);
    this.canvasCurrentX = sx3;
    this.canvasCurrentY = sy3;
  }

  arcTo(rx: number, ry: number, angle: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): void {
    if (!this.ensureCanvasPath()) {
      return;
    }
    const srx = rx * this.canvasState.scale;
    const sry = ry * this.canvasState.scale;
    const sx = (x + this.canvasState.dx) * this.canvasState.scale;
    const sy = (y + this.canvasState.dy) * this.canvasState.scale;
    const curves = this.arcToCurves(
      this.canvasCurrentX,
      this.canvasCurrentY,
      srx,
      sry,
      angle,
      largeArcFlag,
      sweepFlag,
      sx,
      sy
    );
    if (curves) {
      for (let i = 0; i < curves.length; i += 6) {
        this.canvasPathParts?.push(
          `C ${curves[i]} ${curves[i + 1]} ${curves[i + 2]} ${curves[i + 3]} ${curves[i + 4]} ${curves[i + 5]}`
        );
      }
    }
    this.canvasCurrentX = sx;
    this.canvasCurrentY = sy;
  }

  close(): void {
    if (!this.ensureCanvasPath()) {
      return;
    }
    this.canvasPathParts?.push('Z');
  }

  private arcToCurves(
    x0: number,
    y0: number,
    r1: number,
    r2: number,
    angle: number,
    largeArcFlag: number,
    sweepFlag: number,
    x: number,
    y: number
  ): number[] | null {
    let result: number[] | null = null;
    let dx = x - x0;
    let dy = y - y0;

    if (r1 === 0 || r2 === 0) {
      return result;
    }

    const fS = sweepFlag;
    const psai = angle;
    r1 = Math.abs(r1);
    r2 = Math.abs(r2);
    const ctx = -dx / 2;
    const cty = -dy / 2;
    const cpsi = Math.cos((psai * Math.PI) / 180);
    const spsi = Math.sin((psai * Math.PI) / 180);
    const rxd = cpsi * ctx + spsi * cty;
    const ryd = -1 * spsi * ctx + cpsi * cty;
    const rxdd = rxd * rxd;
    const rydd = ryd * ryd;
    const r1x = r1 * r1;
    const r2y = r2 * r2;
    const lamda = rxdd / r1x + rydd / r2y;
    let sds;

    if (lamda > 1) {
      r1 = Math.sqrt(lamda) * r1;
      r2 = Math.sqrt(lamda) * r2;
      sds = 0;
    } else {
      let seif = 1;
      if (largeArcFlag === fS) {
        seif = -1;
      }
      sds =
        seif *
        Math.sqrt((r1x * r2y - r1x * rydd - r2y * rxdd) / (r1x * rydd + r2y * rxdd));
    }

    const txd = (sds * r1 * ryd) / r2;
    const tyd = (-1 * sds * r2 * rxd) / r1;
    const tx = cpsi * txd - spsi * tyd + dx / 2;
    const ty = spsi * txd + cpsi * tyd + dy / 2;
    let rad = Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1) - Math.atan2(0, 1);
    let s1 = rad >= 0 ? rad : 2 * Math.PI + rad;
    rad =
      Math.atan2((-ryd - tyd) / r2, (-rxd - txd) / r1) -
      Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1);
    let dr = rad >= 0 ? rad : 2 * Math.PI + rad;

    if (fS === 0 && dr > 0) {
      dr -= 2 * Math.PI;
    } else if (fS !== 0 && dr < 0) {
      dr += 2 * Math.PI;
    }

    const sse = (dr * 2) / Math.PI;
    const seg = Math.ceil(sse < 0 ? -1 * sse : sse);
    const segr = dr / seg;
    const t = (8 / 3) * Math.sin(segr / 4) * Math.sin(segr / 4) / Math.sin(segr / 2);
    const cpsir1 = cpsi * r1;
    const cpsir2 = cpsi * r2;
    const spsir1 = spsi * r1;
    const spsir2 = spsi * r2;
    let mc = Math.cos(s1);
    let ms = Math.sin(s1);
    let x2 = -t * (cpsir1 * ms + spsir2 * mc);
    let y2 = -t * (spsir1 * ms - cpsir2 * mc);
    let x3 = 0;
    let y3 = 0;

    result = [];

    for (let n = 0; n < seg; ++n) {
      s1 += segr;
      mc = Math.cos(s1);
      ms = Math.sin(s1);

      x3 = cpsir1 * mc - spsir2 * ms + tx;
      y3 = spsir1 * mc + cpsir2 * ms + ty;
      const dx2 = -t * (cpsir1 * ms + spsir2 * mc);
      const dy2 = -t * (spsir1 * ms - cpsir2 * mc);

      const index = n * 6;
      result[index] = Number(x2 + x0);
      result[index + 1] = Number(y2 + y0);
      result[index + 2] = Number(x3 - dx2 + x0);
      result[index + 3] = Number(y3 - dy2 + y0);
      result[index + 4] = Number(x3 + x0);
      result[index + 5] = Number(y3 + y0);

      x2 = x3 + dx2;
      y2 = y3 + dy2;
    }

    return result;
  }

  addPoints(
    points: Array<{ x: number; y: number }>,
    rounded: boolean,
    arcSize: number,
    close: boolean,
    exclude?: number[],
    initialMove: boolean = true
  ): void {
    if (!points || points.length === 0) return;

    let pts = points;
    const pe = pts[pts.length - 1];

    if (close && rounded) {
      pts = pts.slice();
      const p0 = pts[0];
      const wp = { x: pe.x + (p0.x - pe.x) / 2, y: pe.y + (p0.y - pe.y) / 2 };
      pts.splice(0, 0, wp);
    }

    let pt = pts[0];
    let i = 1;

    if (initialMove) {
      this.moveTo(pt.x, pt.y);
    } else {
      this.lineTo(pt.x, pt.y);
    }

    const mod = (n: number, m: number): number => ((n % m) + m) % m;

    while (i < (close ? pts.length : pts.length - 1)) {
      let tmp = pts[mod(i, pts.length)];
      let dx = pt.x - tmp.x;
      let dy = pt.y - tmp.y;

      if (rounded && (dx !== 0 || dy !== 0) && (!exclude || exclude.indexOf(i - 1) < 0)) {
        let dist = Math.sqrt(dx * dx + dy * dy);
        const factor1 = Math.min(arcSize, dist / 2) / dist;
        const nx1 = dx * factor1;
        const ny1 = dy * factor1;

        const x1 = tmp.x + nx1;
        const y1 = tmp.y + ny1;
        this.lineTo(x1, y1);

        let next = pts[mod(i + 1, pts.length)];

        while (i < pts.length - 2 && Math.round(next.x - tmp.x) === 0 && Math.round(next.y - tmp.y) === 0) {
          next = pts[mod(i + 2, pts.length)];
          i++;
        }

        dx = next.x - tmp.x;
        dy = next.y - tmp.y;
        dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const factor2 = Math.min(arcSize, dist / 2) / dist;
        const nx2 = dx * factor2;
        const ny2 = dy * factor2;

        const x2 = tmp.x + nx2;
        const y2 = tmp.y + ny2;
        this.quadTo(tmp.x, tmp.y, x2, y2);
        tmp = { x: x2, y: y2 };
      } else {
        this.lineTo(tmp.x, tmp.y);
      }

      pt = tmp;
      i++;
    }

    if (close) {
      this.close();
    } else {
      this.lineTo(pe.x, pe.y);
    }
  }

  end(): void {
    // No-op for compatibility
  }

  rect(x: number, y: number, w: number, h: number): void {
    const sx = (x + this.canvasState.dx) * this.canvasState.scale;
    const sy = (y + this.canvasState.dy) * this.canvasState.scale;
    const sw = w * this.canvasState.scale;
    const sh = h * this.canvasState.scale;
    this.canvasNode = this.createRect(sx, sy, sw, sh);
    this.canvasPathParts = null;
  }

  roundrect(x: number, y: number, w: number, h: number, r: number, ry?: number): void {
    const sx = (x + this.canvasState.dx) * this.canvasState.scale;
    const sy = (y + this.canvasState.dy) * this.canvasState.scale;
    const sw = w * this.canvasState.scale;
    const sh = h * this.canvasState.scale;
    const sr = r * this.canvasState.scale;
    const sry = (ry ?? r) * this.canvasState.scale;
    const rect = this.createRect(sx, sy, sw, sh);
    rect.setAttribute('rx', String(sr));
    rect.setAttribute('ry', String(sry));
    this.canvasNode = rect;
    this.canvasPathParts = null;
  }

  ellipse(x: number, y: number, w: number, h: number): void {
    const cx = (x + w / 2 + this.canvasState.dx) * this.canvasState.scale;
    const cy = (y + h / 2 + this.canvasState.dy) * this.canvasState.scale;
    const rx = (w / 2) * this.canvasState.scale;
    const ry = (h / 2) * this.canvasState.scale;
    this.canvasNode = this.createEllipse(cx, cy, rx, ry);
    this.canvasPathParts = null;
  }

  image(x: number, y: number, w: number, h: number, src: string, aspect?: boolean, flipH?: boolean, flipV?: boolean, clipPath?: string): void {
    const state = this.canvasState;
    const x0 = x + state.dx;
    const y0 = y + state.dy;
    const sx = x0 * state.scale;
    const sy = y0 * state.scale;
    const sw = w * state.scale;
    const sh = h * state.scale;
    if (isMissingSapIcon(src)) {
      const inlineSvg = createPlaceholderInlineSvg(this, sx, sy, sw, sh);
      if (inlineSvg) {
        if (aspect === false) {
          inlineSvg.setAttribute('preserveAspectRatio', 'none');
        }
        if (clipPath) {
          inlineSvg.setAttribute('clip-path', `url(#${clipPath})`);
        }
        if (state.alpha < 1 || state.fillAlpha < 1) {
          inlineSvg.setAttribute('opacity', String(state.alpha * state.fillAlpha));
        }

        let transform = state.transform.join(' ');

        if (flipH || flipV) {
          const scaleX = flipH ? -1 : 1;
          const scaleY = flipV ? -1 : 1;
          let dx = 0;
          let dy = 0;

          if (flipH) {
            dx = -w - 2 * x0;
          }

          if (flipV) {
            dy = -h - 2 * y0;
          }

          transform += `${transform ? ' ' : ''}scale(${scaleX}, ${scaleY})translate(${dx * state.scale}, ${dy * state.scale})`;
        }

        if (transform) {
          inlineSvg.setAttribute('transform', transform);
        }
        this.attachCanvasNode(inlineSvg);
        this.canvasNode = null;
        this.canvasPathParts = null;
      }
      return;
    }
    const img = this.createImage(sx, sy, sw, sh, src);
    if (aspect === false) {
      img.setAttribute('preserveAspectRatio', 'none');
    }
    if (clipPath) {
      img.setAttribute('clip-path', `url(#${clipPath})`);
    }
    if (state.alpha < 1 || state.fillAlpha < 1) {
      img.setAttribute('opacity', String(state.alpha * state.fillAlpha));
    }

    let transform = state.transform.join(' ');

    if (flipH || flipV) {
      const scaleX = flipH ? -1 : 1;
      const scaleY = flipV ? -1 : 1;
      let dx = 0;
      let dy = 0;

      if (flipH) {
        dx = -w - 2 * x0;
      }

      if (flipV) {
        dy = -h - 2 * y0;
      }

      transform += `${transform ? ' ' : ''}scale(${scaleX}, ${scaleY})translate(${dx * state.scale}, ${dy * state.scale})`;
    }

    if (transform) {
      img.setAttribute('transform', transform);
    }
    this.attachCanvasNode(img);
    this.canvasNode = null;
    this.canvasPathParts = null;
  }

  text(
    x: number,
    y: number,
    w: number,
    h: number,
    str: string,
    align?: string,
    valign?: string,
    overflow?: string,
    clip?: boolean,
    rotation?: number,
    dir?: string
  ): void {
    if (str == null) return;

    const state = this.canvasState;
    const x0 = x + state.dx;
    const y0 = y + state.dy;
    const scale = state.scale;
    const lines = String(str).split('\n');

    const size = state.fontSize;
    const isBold = (state.fontStyle & 1) !== 0;
    const isItalic = (state.fontStyle & 2) !== 0;
    // Use measureTextLayout for precise dimensions
    const textLayoutResult = measureTextLayout(
      str,
      size,
      state.fontFamily,
      isBold ? 'bold' : 'normal',
      isItalic ? 'italic' : 'normal',
      undefined,
      false
    );
    const lineHeight = textLayoutResult.lineHeight;
    const textHeight = textLayoutResult.height;

    let cy = y0 + size - 1;
    const valignValue = valign || 'top';
    const overflowValue = overflow || '';

    if (valignValue === 'middle') {
      if (overflowValue === 'fill') {
        cy -= h / 2;
      } else {
        const dy = (clip && h > 0) ? Math.min(textHeight, h) / 2 : textHeight / 2;
        cy -= dy;
      }
    } else if (valignValue === 'bottom') {
      if (overflowValue === 'fill') {
        cy -= h;
      } else {
        const dy = (clip && h > 0) ? Math.min(textHeight, h) : textHeight;
        cy -= dy + 1;
      }
    }

    const group = this.createElement('g');
    group.setAttribute('fill', state.fontColor);
    group.setAttribute('font-family', state.fontFamily);
    group.setAttribute('font-size', `${size * scale}px`);

    if (state.fontStyle & 1) group.setAttribute('font-weight', 'bold');
    if (state.fontStyle & 2) group.setAttribute('font-style', 'italic');
    const textDecorations: string[] = [];
    if (state.fontStyle & 4) textDecorations.push('underline');
    if (state.fontStyle & 8) textDecorations.push('line-through');
    if (textDecorations.length > 0) {
      group.setAttribute('text-decoration', textDecorations.join(' '));
    }

    const alignValue = align || 'left';
    const anchor = alignValue === 'right' ? 'end' : alignValue === 'center' ? 'middle' : 'start';
    if (anchor !== 'start') group.setAttribute('text-anchor', anchor);

    if (dir && !dir.startsWith('vertical-')) {
      group.setAttribute('direction', dir);
    }

    if (rotation == null) {
      rotation = 0;
    }

    let transform = state.transform.join(' ');
    if (rotation !== 0) {
      const cx = x0 * scale;
      const cyRotate = y0 * scale;
      transform += `${transform ? ' ' : ''}rotate(${rotation}, ${cx}, ${cyRotate})`;
    }
    if (transform) {
      group.setAttribute('transform', transform);
    }

    if (state.alpha < 1) {
      group.setAttribute('opacity', String(state.alpha));
    }

    const baseX = x0 * scale;
    let lineY = cy * scale;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.length > 0 && line.trim().length > 0) {
        const textNode = this.createElement('text');
        textNode.setAttribute('x', String(baseX));
        textNode.setAttribute('y', String(lineY));
        textNode.textContent = line;
        group.appendChild(textNode);
      }

      lineY += lineHeight * scale;
    }

    const backgroundColor = state.fontBackgroundColor && state.fontBackgroundColor !== 'none'
      ? state.fontBackgroundColor
      : null;
    const borderColor = state.fontBorderColor && state.fontBorderColor !== 'none'
      ? state.fontBorderColor
      : null;

    if (backgroundColor || borderColor) {
      let bx = x0;
      let by = y0;
      let bw = w;
      let bh = overflowValue === 'fill' ? h : textHeight;

      if (overflowValue === 'fill' || overflowValue === 'width') {
        if (alignValue === 'center') {
          bx -= w / 2;
        } else if (alignValue === 'right') {
          bx -= w;
        }

        if (valignValue === 'middle') {
          by -= bh / 2;
        } else if (valignValue === 'bottom') {
          by -= bh;
        }

        bx = (bx + 1) * scale;
        by = by * scale;
        bw = (bw - 2) * scale;
        bh = (bh + 2) * scale;
      } else {
        const fontWeight = (state.fontStyle & 1) ? 'bold' : 'normal';
        const fontStyle = (state.fontStyle & 2) ? 'italic' : 'normal';
        const metrics = measureMultilineText(String(str), size, state.fontFamily, fontWeight, fontStyle, 1.2);
        bw = metrics.width;
        bh = metrics.height;

        if (alignValue === 'center') {
          bx -= bw / 2;
        } else if (alignValue === 'right') {
          bx -= bw;
        }

        if (valignValue === 'middle') {
          by -= bh / 2;
        } else if (valignValue === 'bottom') {
          by -= bh;
        }

        bx = (bx + 1) * scale;
        by = (by + 2) * scale;
        bw = bw * scale;
        bh = (bh + 1) * scale;
      }

      const rect = this.createRect(
        Math.floor(bx - 1),
        Math.floor(by - 1),
        Math.ceil(bw + 2),
        Math.ceil(bh)
      );
      rect.setAttribute('fill', backgroundColor ?? 'none');
      rect.setAttribute('stroke', borderColor ?? 'none');

      const strokeWidth = borderColor ? Math.max(1, scale) : 0;
      rect.setAttribute('stroke-width', String(strokeWidth));

      if (strokeWidth > 0 && Math.round(strokeWidth) % 2 === 1) {
        rect.setAttribute('transform', 'translate(0.5, 0.5)');
      }

      group.insertBefore(rect, group.firstChild);
    }

    if (clip && w > 0 && h > 0) {
      let cx = x0;
      let cyClip = y0;

      if (alignValue === 'center') {
        cx -= w / 2;
      } else if (alignValue === 'right') {
        cx -= w;
      }

      if (overflowValue !== 'fill') {
        if (valignValue === 'middle') {
          cyClip -= h / 2;
        } else if (valignValue === 'bottom') {
          cyClip -= h;
        }
      }

      const clipId = `mx-clip-${Math.round(cx * scale)}-${Math.round(cyClip * scale)}-${Math.round(w * scale)}-${Math.round(h * scale)}-${this.canvasClipId++}`;
      const clipPath = this.createElement('clipPath');
      clipPath.setAttribute('id', clipId);
      const rect = this.createRect(cx * scale - 2, cyClip * scale - 2, w * scale + 4, h * scale + 4);
      clipPath.appendChild(rect);
      this.getDefs().appendChild(clipPath);
      group.setAttribute('clip-path', `url(#${clipId})`);
    }

    // Directly append text group to canvasRoot without clearing current path state.
    // This allows text() to be called while building a path (e.g., in timeline shapes)
    // without losing the path data.
    this.canvasRoot.appendChild(group);
  }

  fill(): void {
    if (!this.canvasNode) return;
    if (this.canvasNode.tagName === 'path' && !this.hasCanvasPathData()) {
      this.canvasNode = null;
      this.canvasPathParts = null;
      return;
    }
    this.finalizeCanvasPath();
    // When only filling (no stroke), apply alpha as fill-opacity instead of overall opacity
    // to match the platform's SVG export behavior
    if (this.canvasState.alpha !== 1 && this.canvasState.fillAlpha === 1) {
      this.canvasState.fillAlpha = this.canvasState.alpha;
      this.canvasState.alpha = 1;
      this.applyCanvasCommonStyles(this.canvasNode);
      this.applyCanvasFill(this.canvasNode);
      this.canvasState.alpha = this.canvasState.fillAlpha;
      this.canvasState.fillAlpha = 1;
    } else {
      this.applyCanvasCommonStyles(this.canvasNode);
      this.applyCanvasFill(this.canvasNode);
    }
    this.canvasNode.setAttribute('stroke', 'none');
    this.applyCanvasTransform(this.canvasNode);
    this.attachCanvasNode(this.canvasNode);
  }

  stroke(): void {
    if (!this.canvasNode) return;
    if (this.canvasNode.tagName === 'path' && !this.hasCanvasPathData()) {
      this.canvasNode = null;
      this.canvasPathParts = null;
      return;
    }
    this.finalizeCanvasPath();
    // When only stroking (no fill), apply alpha as stroke-opacity instead of overall opacity
    // to match the platform's SVG export behavior
    if (this.canvasState.alpha !== 1 && this.canvasState.strokeAlpha === 1) {
      this.canvasState.strokeAlpha = this.canvasState.alpha;
      this.canvasState.alpha = 1;
      this.applyCanvasCommonStyles(this.canvasNode);
      this.applyCanvasStroke(this.canvasNode);
      this.canvasState.alpha = this.canvasState.strokeAlpha;
      this.canvasState.strokeAlpha = 1;
    } else {
      this.applyCanvasCommonStyles(this.canvasNode);
      this.applyCanvasStroke(this.canvasNode);
    }
    this.canvasNode.setAttribute('fill', 'none');
    this.applyCanvasTransform(this.canvasNode);
    this.attachCanvasNode(this.canvasNode);
  }

  fillAndStroke(): void {
    if (!this.canvasNode) return;
    if (this.canvasNode.tagName === 'path' && !this.hasCanvasPathData()) {
      this.canvasNode = null;
      this.canvasPathParts = null;
      return;
    }
    this.finalizeCanvasPath();
    this.applyCanvasCommonStyles(this.canvasNode);
    this.applyCanvasFill(this.canvasNode);
    this.applyCanvasStroke(this.canvasNode);
    this.applyCanvasTransform(this.canvasNode);
    this.attachCanvasNode(this.canvasNode);
  }

  setAlpha(value: number): void {
    this.canvasState.alpha = value;
  }

  getAlpha(): number {
    return this.canvasState.alpha;
  }

  setFillAlpha(value: number): void {
    this.canvasState.fillAlpha = value;
  }

  setStrokeAlpha(value: number): void {
    this.canvasState.strokeAlpha = value;
  }

  setFillColor(value: string | null): void {
    this.canvasState.fillColor = value === 'none' ? null : value;
  }

  getCurrentFillColor(): string | null {
    return this.canvasState.fillColor ?? null;
  }

  getCurrentStrokeColor(): string | null {
    return this.canvasState.strokeColor ?? null;
  }

  // Get current accumulated translate offsets (used by stencil rendering)
  getTranslateX(): number {
    return this.canvasState.dx;
  }

  getTranslateY(): number {
    return this.canvasState.dy;
  }

  setStrokeColor(value: string | null): void {
    this.canvasState.strokeColor = value === 'none' ? null : value;
  }

  setStrokeWidth(value: number): void {
    this.canvasState.strokeWidth = value;
  }

  setDashed(value: boolean, fixDash?: boolean): void {
    this.canvasState.dashed = value;
    if (fixDash !== undefined) {
      // Keep for signature parity
      void fixDash;
    }
  }

  setDashPattern(value: string): void {
    this.canvasState.dashPattern = value;
  }

  setLineCap(value: string): void {
    this.canvasState.lineCap = value;
  }

  setLineJoin(value: string): void {
    this.canvasState.lineJoin = value;
  }

  setMiterLimit(value: number): void {
    this.canvasState.miterLimit = value;
  }

  setFillStyle(value: string | null): void {
    this.canvasState.fillStyle = value;
  }

  setGradient(
    color1: string,
    color2: string,
    x: number,
    y: number,
    w: number,
    h: number,
    direction?: string,
    alpha1?: number,
    alpha2?: number
  ): void {
    void x;
    void y;
    void w;
    void h;
    if (color2 === 'none') {
      this.canvasState.fillColor = color1;
      this.canvasState.fillStyle = null;
      return;
    }
    const id = this.createCanvasGradient(color1, color2, direction, alpha1, alpha2);
    this.canvasState.fillColor = `url(#${id})`;
    this.canvasState.fillStyle = color2;
  }

  setShadow(enabled: boolean, style?: string): void {
    this.canvasState.shadow = enabled;
    if (style !== undefined) {
      // Keep for signature parity
      void style;
    }
  }

  setShadowColor(value: string): void {
    this.canvasState.shadowColor = value;
  }

  setShadowAlpha(value: number): void {
    this.canvasState.shadowAlpha = value;
  }

  setShadowOffset(dx: number, dy: number): void {
    this.canvasState.shadowDx = dx;
    this.canvasState.shadowDy = dy;
  }

  setFontColor(value: string): void {
    this.canvasState.fontColor = value;
  }

  setFontFamily(value: string): void {
    this.canvasState.fontFamily = value;
  }

  setFontSize(value: number): void {
    this.canvasState.fontSize = value;
  }

  setFontStyle(value: number): void {
    this.canvasState.fontStyle = value;
  }

  setFontBackgroundColor(value: string | null): void {
    this.canvasState.fontBackgroundColor = value;
  }

  setFontBorderColor(value: string | null): void {
    this.canvasState.fontBorderColor = value;
  }

  setTitle(title: string): void {
    this.canvasState.title = title;
  }

  setLink(link: string, target?: string): void {
    this.canvasState.link = link ? { href: link, target } : null;
  }

  /**
   * Append child element
   */
  append(parent: Element, child: Element): Element {
    parent.appendChild(child);
    return child;
  }

  /**
   * Append multiple children
   */
  appendAll(parent: Element, children: Element[]): void {
    for (const child of children) {
      parent.appendChild(child);
    }
  }

  /**
   * Serialize to string
   */
  toString(): string {
    const shouldFormat = (name: string): boolean => {
      return name !== 'xlink:href' && name !== 'href';
    };

    const formatNumberString = (value: string): string => {
      return value.replace(/-?\d+\.\d+(?:e[-+]?\d+)?/gi, (raw) => {
        if (/e[-+]?\d+/i.test(raw)) {
          return raw;
        }
        const num = Number(raw);
        if (!Number.isFinite(num)) return raw;
        const fraction = raw.split('.')[1] || '';
        if (fraction.length <= 3) return raw;
        const rounded = Math.round(num * 1000) / 1000;
        let out = rounded.toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
        if (out === '-0') out = '0';
        return out;
      });
    };

    const elements = this.doc.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (!el?.attributes) continue;
      for (let j = 0; j < el.attributes.length; j++) {
        const attr = el.attributes[j];
        if (!attr || !shouldFormat(attr.name)) continue;
        const formatted = formatNumberString(attr.value);
        if (formatted !== attr.value) {
          el.setAttribute(attr.name, formatted);
        }
      }
    }

    return new XMLSerializer().serializeToString(this.doc);
  }

}

type CanvasState = {
  dx: number;
  dy: number;
  scale: number;
  alpha: number;
  fillAlpha: number;
  strokeAlpha: number;
  fillColor: string | null;
  strokeColor: string | null;
  strokeWidth: number;
  dashed: boolean;
  dashPattern: string;
  lineCap: string;
  lineJoin: string;
  miterLimit: number;
  fillStyle: string | null;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: number;
  fontBackgroundColor: string | null;
  fontBorderColor: string | null;
  shadow: boolean;
  shadowColor: string;
  shadowAlpha: number;
  shadowDx: number;
  shadowDy: number;
  transform: string[];
  link: { href: string; target?: string } | null;
  title: string | null;
};

/**
 * Helper to build common SVG attribute objects
 */
export const SvgAttrs = {
  stroke(color: string, width?: number, dashArray?: string, miterlimit?: number, linecap?: string): Record<string, string | number> {
    const attrs: Record<string, string | number> = {};
    if (color === 'none') {
      attrs.stroke = 'none';
    } else {
      attrs.stroke = color;
      if (width !== undefined) attrs['stroke-width'] = width;
      if (dashArray) attrs['stroke-dasharray'] = dashArray;
      if (miterlimit !== undefined) attrs['stroke-miterlimit'] = miterlimit;
      if (linecap) attrs['stroke-linecap'] = linecap;
    }
    return attrs;
  },

  fill(color: string): Record<string, string> {
    return { fill: color };
  },

  font(family: string, size: number, color?: string, weight?: string): Record<string, string | number> {
    const attrs: Record<string, string | number> = {
      'font-family': `"${family}"`,
      'font-size': `${size}px`,
    };
    if (color) attrs.fill = color;
    if (weight) attrs['font-weight'] = weight;
    return attrs;
  },

  transform(rotate?: number, cx?: number, cy?: number, translate?: { x: number; y: number }): string {
    const parts: string[] = [];
    if (translate) {
      parts.push(`translate(${translate.x}, ${translate.y})`);
    }
    if (rotate !== undefined && rotate !== 0) {
      if (cx !== undefined && cy !== undefined) {
        parts.push(`rotate(${rotate}, ${cx}, ${cy})`);
      } else {
        parts.push(`rotate(${rotate})`);
      }
    }
    return parts.join(' ');
  },

  /**
   * Common pointer-events values
   */
  pointerEvents(value: 'all' | 'none' | 'stroke' | 'visible'): Record<string, string> {
    return { 'pointer-events': value };
  },

  /**
   * Combine multiple attribute objects
   */
  combine(...attrObjects: Record<string, string | number>[]): Record<string, string | number> {
    return Object.assign({}, ...attrObjects);
  },
};

