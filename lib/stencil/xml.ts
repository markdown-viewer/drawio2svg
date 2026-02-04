/**
 * Stencil XML to JSON V2 Converter
 * 
 * Converts draw.io stencil XML format to a compact JSON representation
 * that can be directly rendered without SVG parsing.
 */

import { DEFAULT_FONT_FAMILY } from '../text/index.ts';

// ============================================================================
// Type Definitions
// ============================================================================

/** Connection point on a stencil shape */
export interface Constraint {
  x: number;
  y: number;
  name?: string;
  perimeter?: boolean;
}

/** Path command types */
export type PathCmd =
  | ['M', number, number]                                           // move
  | ['L', number, number]                                           // line
  | ['C', number, number, number, number, number, number]           // cubic bezier
  | ['Q', number, number, number, number]                           // quadratic bezier
  | ['A', number, number, number, number, number, number, number]   // arc
  | ['Z'];                                                          // close

/** Drawing operation types */
export type DrawOp =
  // Path
  | { path: PathCmd[] }
  // Basic shapes
  | { rect: [number, number, number, number] }                      // x, y, w, h
  | { roundRect: [number, number, number, number, number] }         // x, y, w, h, arcSize
  | { ellipse: [number, number, number, number] }                   // x, y, w, h
  | { text: { x: number; y: number; str: string; align?: string; valign?: string } }
  // Paint operations
  | 'fillStroke'
  | 'fill'
  | 'stroke'
  // Style operations
  | { fillColor: string; default?: string }
  | { strokeColor: string; default?: string }
  | { strokeWidth: number }
  | { alpha: number }
  | { fillAlpha: number }
  | { strokeAlpha: number }
  | { dashed: boolean; pattern?: string }
  | { lineJoin: string }
  | { lineCap: string }
  | { miterLimit: number }
  // Font operations
  | { fontFamily: string }
  | { fontSize: number }
  | { fontStyle: number }
  | { fontColor: string; default?: string }
  // State operations
  | 'save'
  | 'restore';

/** V2 Stencil shape definition */
export interface StencilShape {
  name: string;
  width: number;
  height: number;
  aspect?: 'fixed' | 'variable';
  strokeWidth?: number | 'inherit';
  background?: DrawOp[];
  foreground: DrawOp[];
  constraints?: Constraint[];
}

// ============================================================================
// Helper Functions
// ============================================================================

function childElements(parent: Element): Element[] {
  const result: Element[] = [];
  for (let i = 0; i < parent.childNodes.length; i++) {
    const node = parent.childNodes[i];
    if (node && node.nodeType === 1) {
      result.push(node as unknown as Element);
    }
  }
  return result;
}

function findDirectChild(parent: Element, tagName: string): Element | null {
  for (const el of childElements(parent)) {
    if (el.tagName === tagName) return el;
  }
  return null;
}

function readNumAttr(el: Element, name: string, fallback: number): number {
  const raw = el.getAttribute(name);
  if (raw === null || raw === '') return fallback;
  const v = parseFloat(raw);
  return Number.isFinite(v) ? v : fallback;
}

function normalizeColorToken(color: string | null, defaultColor?: string): string {
  if (!color) return defaultColor ?? 'fillColor';
  const c = color.trim();
  if (c === '') return defaultColor ?? 'fillColor';
  
  // Direct keywords
  if (c === 'fill' || c === 'fillColor') return 'fillColor';
  if (c === 'stroke' || c === 'strokeColor') return 'strokeColor';
  if (c === 'none' || c === 'transparent') return 'none';
  
  // Keep other values as-is (hex colors, fillColor2-8, strokeColor2-5, etc.)
  return c;
}

// ============================================================================
// Path Parsing
// ============================================================================

function parsePathCommands(pathEl: Element): PathCmd[] {
  const commands: PathCmd[] = [];

  for (const el of childElements(pathEl)) {
    switch (el.tagName) {
      case 'move': {
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        commands.push(['M', x, y]);
        break;
      }
      case 'line': {
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        commands.push(['L', x, y]);
        break;
      }
      case 'arc': {
        const rx = readNumAttr(el, 'rx', 0);
        const ry = readNumAttr(el, 'ry', 0);
        const rotation = readNumAttr(el, 'x-axis-rotation', 0);
        const largeArc = readNumAttr(el, 'large-arc-flag', 0);
        const sweep = readNumAttr(el, 'sweep-flag', 0);
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        commands.push(['A', rx, ry, rotation, largeArc, sweep, x, y]);
        break;
      }
      case 'curve': {
        const x1 = readNumAttr(el, 'x1', 0);
        const y1 = readNumAttr(el, 'y1', 0);
        const x2 = readNumAttr(el, 'x2', 0);
        const y2 = readNumAttr(el, 'y2', 0);
        const x3 = readNumAttr(el, 'x3', 0);
        const y3 = readNumAttr(el, 'y3', 0);
        commands.push(['C', x1, y1, x2, y2, x3, y3]);
        break;
      }
      case 'quad': {
        const x1 = readNumAttr(el, 'x1', 0);
        const y1 = readNumAttr(el, 'y1', 0);
        const x2 = readNumAttr(el, 'x2', 0);
        const y2 = readNumAttr(el, 'y2', 0);
        commands.push(['Q', x1, y1, x2, y2]);
        break;
      }
      case 'close': {
        commands.push(['Z']);
        break;
      }
      case 'ellipse': {
        // Ellipse inside path - convert to arc commands
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        const w = readNumAttr(el, 'w', 0);
        const h = readNumAttr(el, 'h', 0);
        const rx = w / 2;
        const ry = h / 2;
        const cx = x + rx;
        const cy = y + ry;
        commands.push(['M', cx - rx, cy]);
        commands.push(['A', rx, ry, 0, 1, 0, cx + rx, cy]);
        commands.push(['A', rx, ry, 0, 1, 0, cx - rx, cy]);
        commands.push(['Z']);
        break;
      }
      // Ignore style hints inside path
      case 'linejoin':
      case 'linecap':
      case 'strokewidth':
      case 'fillcolor':
      case 'strokecolor':
        break;
    }
  }

  return commands;
}

// ============================================================================
// Section Parsing
// ============================================================================

type PendingShape =
  | { type: 'path'; commands: PathCmd[] }
  | { type: 'rect'; x: number; y: number; w: number; h: number; arcSize?: number }
  | { type: 'ellipse'; x: number; y: number; w: number; h: number }
  | { type: 'text'; x: number; y: number; str: string; align: string; valign: string };

interface ParseSectionResult {
  ops: DrawOp[];
  pendingShape: PendingShape | null;
}

function parseSection(sectionEl: Element, inheritedPending?: PendingShape | null): ParseSectionResult {
  const ops: DrawOp[] = [];
  let pending: PendingShape | null = inheritedPending ?? null;

  const flushPending = (paint: 'fillStroke' | 'stroke' | 'fill'): void => {
    if (!pending) return;
    
    switch (pending.type) {
      case 'path':
        ops.push({ path: pending.commands });
        break;
      case 'rect':
        if (pending.arcSize !== undefined) {
          ops.push({ roundRect: [pending.x, pending.y, pending.w, pending.h, pending.arcSize] });
        } else {
          ops.push({ rect: [pending.x, pending.y, pending.w, pending.h] });
        }
        break;
      case 'ellipse':
        ops.push({ ellipse: [pending.x, pending.y, pending.w, pending.h] });
        break;
      case 'text':
        ops.push({ text: { x: pending.x, y: pending.y, str: pending.str, align: pending.align, valign: pending.valign } });
        break;
    }
    ops.push(paint);
    pending = null;
  };

  for (const el of childElements(sectionEl)) {
    switch (el.tagName) {
      // State operations
      case 'save':
        ops.push('save');
        break;
      case 'restore':
        ops.push('restore');
        break;

      // Color operations
      case 'fillcolor': {
        const color = normalizeColorToken(el.getAttribute('color'));
        const defaultVal = el.getAttribute('default') ?? undefined;
        if (defaultVal) {
          ops.push({ fillColor: color, default: defaultVal });
        } else {
          ops.push({ fillColor: color });
        }
        break;
      }
      case 'strokecolor': {
        const color = normalizeColorToken(el.getAttribute('color'));
        const defaultVal = el.getAttribute('default') ?? undefined;
        if (defaultVal) {
          ops.push({ strokeColor: color, default: defaultVal });
        } else {
          ops.push({ strokeColor: color });
        }
        break;
      }
      case 'fillstrokecolor': {
        const color = normalizeColorToken(el.getAttribute('color'));
        const defaultVal = el.getAttribute('default') ?? undefined;
        // Set both fill and stroke
        if (defaultVal) {
          ops.push({ fillColor: color, default: defaultVal });
          ops.push({ strokeColor: color, default: defaultVal });
        } else {
          ops.push({ fillColor: color });
          ops.push({ strokeColor: color });
        }
        break;
      }

      // Alpha operations
      // NOTE: In draw.io's mxStencil.js, both 'fillalpha' and 'strokealpha' call canvas.setAlpha()
      // instead of canvas.setFillAlpha()/setStrokeAlpha(). This appears to be a bug in draw.io,
      // but we need to replicate this behavior for compatibility.
      // See: mxStencil.js line 940-950 where all three ops call canvas.setAlpha(node.getAttribute('alpha'))
      case 'fillalpha':
      case 'strokealpha':
      case 'alpha': {
        const a = readNumAttr(el, 'alpha', 1);
        ops.push({ alpha: a });
        break;
      }

      // Stroke style operations
      case 'strokewidth': {
        const w = readNumAttr(el, 'width', 1);
        ops.push({ strokeWidth: w });
        break;
      }
      case 'dashed': {
        const raw = el.getAttribute('dashed');
        ops.push({ dashed: raw === '1' || raw === 'true' });
        break;
      }
      case 'dashpattern': {
        // IMPORTANT: mxStencil.js only reads "pattern" attribute, NOT "dash" attribute!
        // This means <dashpattern dash="8 8"/> is IGNORED by draw.io (uses default 3 3)
        // while <dashpattern pattern="1 1"/> is applied.
        // See: mxClient.js line ~483: c.getAttribute("pattern") only
        const p = el.getAttribute('pattern');
        if (p && p !== 'none') {
          // Only apply custom pattern when "pattern" attribute is used
          ops.push({ dashed: true, pattern: p });
        } else {
          // "dash" attribute is ignored by mxStencil, just enable dashed mode
          // The actual dashpattern will be the default "3 3"
          ops.push({ dashed: true });
        }
        break;
      }
      case 'linejoin': {
        const j = el.getAttribute('join');
        if (j) ops.push({ lineJoin: j });
        break;
      }
      case 'linecap': {
        const c = el.getAttribute('cap');
        if (c) ops.push({ lineCap: c });
        break;
      }
      case 'miterlimit': {
        const l = readNumAttr(el, 'limit', 4);
        ops.push({ miterLimit: l });
        break;
      }

      // Font operations
      case 'fontfamily': {
        const f = el.getAttribute('family');
        if (f) ops.push({ fontFamily: f });
        break;
      }
      case 'fontsize': {
        const s = readNumAttr(el, 'size', 12);
        ops.push({ fontSize: s });
        break;
      }
      case 'fontstyle': {
        const s = readNumAttr(el, 'style', 0);
        ops.push({ fontStyle: s });
        break;
      }
      case 'fontcolor': {
        const color = normalizeColorToken(el.getAttribute('color'));
        const defaultVal = el.getAttribute('default') ?? undefined;
        if (defaultVal) {
          ops.push({ fontColor: color, default: defaultVal });
        } else {
          ops.push({ fontColor: color });
        }
        break;
      }

      // Path element
      case 'path': {
        // Check for special case: <path><ellipse.../></path>
        // This should be treated as a standalone ellipse, not converted to arc commands
        const pathChildren = childElements(el);
        if (pathChildren.length === 1 && pathChildren[0].tagName === 'ellipse') {
          const ellipseEl = pathChildren[0];
          const x = readNumAttr(ellipseEl, 'x', 0);
          const y = readNumAttr(ellipseEl, 'y', 0);
          const w = readNumAttr(ellipseEl, 'w', 0);
          const h = readNumAttr(ellipseEl, 'h', 0);
          pending = { type: 'ellipse', x, y, w, h };
        } else {
          pending = { type: 'path', commands: parsePathCommands(el) };
        }
        break;
      }

      // Inline path commands (implicit path)
      case 'move':
      case 'line':
      case 'arc':
      case 'curve':
      case 'quad':
      case 'close': {
        let cmd: PathCmd;
        switch (el.tagName) {
          case 'move':
            cmd = ['M', readNumAttr(el, 'x', 0), readNumAttr(el, 'y', 0)];
            break;
          case 'line':
            cmd = ['L', readNumAttr(el, 'x', 0), readNumAttr(el, 'y', 0)];
            break;
          case 'arc':
            cmd = ['A',
              readNumAttr(el, 'rx', 0),
              readNumAttr(el, 'ry', 0),
              readNumAttr(el, 'x-axis-rotation', 0),
              readNumAttr(el, 'large-arc-flag', 0),
              readNumAttr(el, 'sweep-flag', 0),
              readNumAttr(el, 'x', 0),
              readNumAttr(el, 'y', 0)
            ];
            break;
          case 'curve':
            cmd = ['C',
              readNumAttr(el, 'x1', 0), readNumAttr(el, 'y1', 0),
              readNumAttr(el, 'x2', 0), readNumAttr(el, 'y2', 0),
              readNumAttr(el, 'x3', 0), readNumAttr(el, 'y3', 0)
            ];
            break;
          case 'quad':
            cmd = ['Q',
              readNumAttr(el, 'x1', 0), readNumAttr(el, 'y1', 0),
              readNumAttr(el, 'x2', 0), readNumAttr(el, 'y2', 0)
            ];
            break;
          case 'close':
          default:
            cmd = ['Z'];
            break;
        }
        if (pending?.type === 'path') {
          pending.commands.push(cmd);
        } else {
          pending = { type: 'path', commands: [cmd] };
        }
        break;
      }

      // Paint operations
      case 'fill':
        flushPending('fill');
        break;
      case 'fillstroke':
        flushPending('fillStroke');
        break;
      case 'stroke':
        flushPending('stroke');
        break;

      // Shape elements
      case 'rect': {
        // Empty <rect/> creates a 0x0 rect at (0,0) - this is used for stroke-only bounding box
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        const w = readNumAttr(el, 'w', 0);
        const h = readNumAttr(el, 'h', 0);
        pending = { type: 'rect', x, y, w, h };
        break;
      }
      case 'roundrect': {
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        const w = readNumAttr(el, 'w', 0);
        const h = readNumAttr(el, 'h', 0);
        const arcSize = readNumAttr(el, 'arcsize', 0);
        pending = { type: 'rect', x, y, w, h, arcSize };
        break;
      }
      case 'ellipse': {
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        const w = readNumAttr(el, 'w', 0);
        const h = readNumAttr(el, 'h', 0);
        pending = { type: 'ellipse', x, y, w, h };
        break;
      }
      case 'text': {
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        const str = el.getAttribute('str') ?? '';
        const align = el.getAttribute('align') ?? 'left';
        const valign = el.getAttribute('valign') ?? 'top';
        pending = { type: 'text', x, y, str, align, valign };
        // Text is painted immediately
        flushPending('fill');
        break;
      }

      // Ignored elements
      case 'connections':
      case 'constraint':
        break;
    }
  }

  return { ops, pendingShape: pending };
}

// ============================================================================
// Connection Point Parsing
// ============================================================================

function parseConnections(connectionsEl: Element): Constraint[] {
  const constraints: Constraint[] = [];
  
  for (const el of childElements(connectionsEl)) {
    if (el.tagName === 'constraint') {
      const x = readNumAttr(el, 'x', 0);
      const y = readNumAttr(el, 'y', 0);
      const name = el.getAttribute('name') ?? undefined;
      const perimeter = el.getAttribute('perimeter') === '1';
      
      const constraint: Constraint = { x, y };
      if (name) constraint.name = name;
      if (perimeter) constraint.perimeter = true;
      
      constraints.push(constraint);
    }
  }
  
  return constraints;
}

// ============================================================================
// Inline Stencil Parsing (for shape=stencil(...) format)
// ============================================================================

/**
 * Parse a single inline stencil from XML string.
 * Used for shape=stencil(base64data) format where the stencil definition
 * is embedded directly in the cell style.
 * 
 * @param xml - Decompressed XML string containing a single <shape> element
 * @returns StencilShape object or null if parsing fails
 */
export function parseInlineStencil(xml: string): StencilShape | null {
  const DOMParserImpl = globalThis.DOMParser;
  if (!DOMParserImpl) {
    return null;
  }
  
  try {
    const parser = new DOMParserImpl();
    const doc = parser.parseFromString(xml, 'text/xml');
    const shapeEl = doc.documentElement;
    
    // Inline stencil has <shape> as root element (not <shapes>)
    if (!shapeEl || shapeEl.tagName !== 'shape') {
      return null;
    }
    
    const name = shapeEl.getAttribute('name') ?? 'inline';
    const width = readNumAttr(shapeEl, 'w', 100);
    const height = readNumAttr(shapeEl, 'h', 100);
    
    // Parse aspect
    const aspectAttr = shapeEl.getAttribute('aspect');
    const aspect = aspectAttr === 'fixed' ? 'fixed' : undefined;
    
    // Parse strokeWidth
    const strokeWidthAttr = (shapeEl.getAttribute('strokewidth') || '').trim();
    let strokeWidth: number | 'inherit' | undefined;
    if (strokeWidthAttr === 'inherit') {
      strokeWidth = 'inherit';
    } else if (strokeWidthAttr) {
      const sw = parseFloat(strokeWidthAttr);
      if (Number.isFinite(sw) && sw !== 1) {
        strokeWidth = sw;
      }
    }
    
    // Parse sections
    const bgEl = findDirectChild(shapeEl, 'background');
    const fgEl = findDirectChild(shapeEl, 'foreground');
    const connEl = findDirectChild(shapeEl, 'connections');
    
    const bgResult = bgEl ? parseSection(bgEl) : { ops: [], pendingShape: null };
    const fgResult = fgEl ? parseSection(fgEl, bgResult.pendingShape) : { ops: [], pendingShape: null };
    
    const foreground = [...bgResult.ops, ...fgResult.ops];
    const constraints = connEl ? parseConnections(connEl) : undefined;
    
    const shape: StencilShape = {
      name,
      width,
      height,
      foreground,
    };
    
    if (aspect) shape.aspect = aspect;
    if (strokeWidth !== undefined) shape.strokeWidth = strokeWidth;
    if (constraints && constraints.length > 0) shape.constraints = constraints;
    
    return shape;
  } catch (e) {
    return null;
  }
}

// ============================================================================
// Main Conversion Function
// ============================================================================

export function convertStencilXmlToShapes(xml: string, limit?: number): StencilShape[] {
  const DOMParserImpl = globalThis.DOMParser;
  if (!DOMParserImpl) {
    throw new Error('DOMParser is not available. Please run this conversion with fibjs (global DOMParser).');
  }
  
  const parser = new DOMParserImpl();
  const doc = parser.parseFromString(xml, 'text/xml');
  const root = doc.documentElement;
  
  if (!root || root.tagName !== 'shapes') {
    throw new Error('Invalid stencil XML: root <shapes> not found');
  }

  const shapes: Element[] = [];
  for (const el of childElements(root)) {
    if (el.tagName === 'shape') shapes.push(el);
  }

  const result: StencilShape[] = [];
  
  for (const shapeEl of shapes) {
    const name = shapeEl.getAttribute('name') ?? '';
    const width = readNumAttr(shapeEl, 'w', 100);
    const height = readNumAttr(shapeEl, 'h', 100);
    
    // Parse aspect
    const aspectAttr = shapeEl.getAttribute('aspect');
    const aspect = aspectAttr === 'fixed' ? 'fixed' : undefined;
    
    // Parse strokeWidth
    const strokeWidthAttr = (shapeEl.getAttribute('strokewidth') || '').trim();
    let strokeWidth: number | 'inherit' | undefined;
    if (strokeWidthAttr === 'inherit') {
      strokeWidth = 'inherit';
    } else if (strokeWidthAttr) {
      const sw = parseFloat(strokeWidthAttr);
      if (Number.isFinite(sw) && sw !== 1) {
        strokeWidth = sw;
      }
    }
    
    // Parse sections
    // In draw.io stencil format:
    // - <background> defines shapes but doesn't paint them
    // - <foreground> starts with fillstroke/fill/stroke to paint the background shape
    // - Then foreground can define and paint additional shapes
    // We parse background first, then pass its pending shape to foreground
    const bgEl = findDirectChild(shapeEl, 'background');
    const fgEl = findDirectChild(shapeEl, 'foreground');
    const connEl = findDirectChild(shapeEl, 'connections');
    
    // Parse background and get any pending shape
    const bgResult = bgEl ? parseSection(bgEl) : { ops: [], pendingShape: null };
    
    // Parse foreground, passing the pending shape from background
    // This allows foreground's first paint op to draw the background shape
    const fgResult = fgEl ? parseSection(fgEl, bgResult.pendingShape) : { ops: [], pendingShape: null };
    
    // Combine ops: background ops (style changes, etc.) + foreground ops (including the painted background shape)
    const foreground = [...bgResult.ops, ...fgResult.ops];
    
    const constraints = connEl ? parseConnections(connEl) : undefined;
    
    // Build shape object
    // Note: We no longer need separate background array since it's merged into foreground
    const shape: StencilShape = {
      name,
      width,
      height,
      foreground,
    };
    
    if (aspect) shape.aspect = aspect;
    if (strokeWidth !== undefined) shape.strokeWidth = strokeWidth;
    if (constraints && constraints.length > 0) shape.constraints = constraints;
    
    result.push(shape);
    
    if (limit !== undefined && result.length >= limit) break;
  }

  return result;
}
