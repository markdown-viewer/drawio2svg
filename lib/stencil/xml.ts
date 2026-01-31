import { SvgBuilder } from '../svg/index.ts';
import { DEFAULT_FONT_FAMILY } from '../text/index.ts';

type StencilStyleState = {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number | string;
  fillOpacity: number;
  strokeOpacity: number;
  globalAlpha: number;
  dashed: boolean;
  dashPattern?: string;
  lineJoin?: string;
  lineCap?: string;
  miterLimit?: number;
  fontFamily: string;
  fontSize: number;
  fontStyle: number; // 0=normal, 1=bold, 2=italic, 3=bold+italic
  fontColor: string;
};

type PendingDrawable =
  | { type: 'path'; d: string }
  | { type: 'rect'; x: number; y: number; w: number; h: number; rx?: number; ry?: number }
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { type: 'text'; x: number; y: number; str: string; align: string; valign: string };

export type StencilShapeSvg = {
  name: string;
  width: number;
  height: number;
  svg: string;
};

// Statistics for unknown tags and attributes
export type StencilConversionStats = {
  unknownTags: Map<string, number>;
  unknownAttrs: Map<string, number>;
  totalShapes: number;
};

// Global stats collector (reset before each batch conversion)
let globalStats: StencilConversionStats | null = null;

function trackUnknownTag(tag: string): void {
  if (!globalStats) return;
  globalStats.unknownTags.set(tag, (globalStats.unknownTags.get(tag) || 0) + 1);
}

function trackUnknownAttr(tag: string, attr: string): void {
  if (!globalStats) return;
  const key = `${tag}@${attr}`;
  globalStats.unknownAttrs.set(key, (globalStats.unknownAttrs.get(key) || 0) + 1);
}

// Known attributes per tag for validation
const KNOWN_ATTRS: Record<string, Set<string>> = {
  shape: new Set(['name', 'w', 'h', 'aspect', 'strokewidth']),
  rect: new Set(['x', 'y', 'w', 'h', 'rx', 'ry']),
  roundrect: new Set(['x', 'y', 'w', 'h', 'arcsize']),
  ellipse: new Set(['x', 'y', 'w', 'h']),
  path: new Set([]),
  move: new Set(['x', 'y']),
  line: new Set(['x', 'y']),
  arc: new Set(['x', 'y', 'rx', 'ry', 'x-axis-rotation', 'large-arc-flag', 'sweep-flag']),
  curve: new Set(['x1', 'y1', 'x2', 'y2', 'x3', 'y3']),
  quad: new Set(['x1', 'y1', 'x2', 'y2']),
  close: new Set([]),
  fillcolor: new Set(['color', 'default', 'fillcolor2']),
  strokecolor: new Set(['color', 'default', 'primary']),
  fillstrokecolor: new Set(['color', 'default']), // Sets both fill and stroke color
  fillalpha: new Set(['alpha']),
  strokealpha: new Set(['alpha']),
  alpha: new Set(['alpha']),
  strokewidth: new Set(['width', 'fixed']),
  dashed: new Set(['dashed']),
  dashpattern: new Set(['pattern', 'dash']),
  linejoin: new Set(['join']),
  linecap: new Set(['cap']),
  miterlimit: new Set(['limit']),
  fontfamily: new Set(['family']),
  fontsize: new Set(['size']),
  fontstyle: new Set(['style']),
  fontcolor: new Set(['color', 'default']),
  text: new Set(['str', 'x', 'y', 'align', 'valign', 'localized', 'vertical', 'rotation']),
  constraint: new Set(['x', 'y', 'perimeter', 'name']),
  connections: new Set([]),
  save: new Set([]),
  restore: new Set([]),
  fill: new Set([]),
  stroke: new Set([]),
  fillstroke: new Set([]),
  background: new Set([]),
  foreground: new Set([]),
  shapes: new Set([]),
  include: new Set(['name']), // Include another shape
  image: new Set(['x', 'y', 'w', 'h', 'src', 'flipH', 'flipV']),
};

function validateAttrs(el: Element): void {
  if (!globalStats) return;
  const tag = el.tagName.toLowerCase();
  const known = KNOWN_ATTRS[tag];
  if (!known) return;
  
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    if (!known.has(attr.name.toLowerCase())) {
      trackUnknownAttr(tag, attr.name);
    }
  }
}

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

function normalizeStencilColor(color: string | null, state: StencilStyleState, defaultColor?: string): string {
  if (!color) return defaultColor ?? state.fillColor;
  const c = color.trim();
  if (c === '') return defaultColor ?? state.fillColor;
  // Color keywords from mxStencil.parseColor()
  if (c === 'fill' || c === 'fillColor') return state.fillColor;
  if (c === 'stroke' || c === 'strokeColor') return state.strokeColor;
  if (c === 'none' || c === 'transparent') return 'none';
  // fillColor2-8 -> placeholder with default fallback
  const fillMatch = c.match(/^fillColor(\d)$/);
  if (fillMatch) {
    return defaultColor ?? `{{fillColor${fillMatch[1]}}}`;
  }
  // strokeColor2-5 -> placeholder with default fallback
  const strokeMatch = c.match(/^strokeColor(\d)$/);
  if (strokeMatch) {
    return defaultColor ?? `{{strokeColor${strokeMatch[1]}}}`;
  }
  return c;
}

function buildStrokeDasharray(state: StencilStyleState): string | undefined {
  if (!state.dashed) return undefined;
  if (state.dashPattern && state.dashPattern.trim() !== '') {
    if (state.dashPattern.trim() === 'none') return undefined;
    return state.dashPattern;
  }
  return '3 3';
}

function buildPaintAttrs(
  state: StencilStyleState,
  paint: 'fillstroke' | 'stroke' | 'fill'
): Record<string, string | number> {
  const attrs: Record<string, string | number> = {};
  const effectiveAlpha = state.globalAlpha;
  
  if (paint === 'fillstroke' || paint === 'fill') {
    attrs.fill = state.fillColor;
    const fillOp = state.fillOpacity * effectiveAlpha;
    if (fillOp !== 1) attrs['fill-opacity'] = fillOp;
  } else {
    attrs.fill = 'none';
  }

  if (paint === 'fillstroke' || paint === 'stroke') {
    attrs.stroke = state.strokeColor;
    attrs['stroke-width'] = state.strokeWidth;
    const strokeOp = state.strokeOpacity * effectiveAlpha;
    if (strokeOp !== 1) attrs['stroke-opacity'] = strokeOp;
    const dash = buildStrokeDasharray(state);
    if (dash) attrs['stroke-dasharray'] = dash;
    if (state.lineJoin) attrs['stroke-linejoin'] = state.lineJoin;
    if (state.lineCap) attrs['stroke-linecap'] = state.lineCap;
    if (state.miterLimit !== undefined) attrs['stroke-miterlimit'] = state.miterLimit;
  } else {
    attrs.stroke = 'none';
  }

  return attrs;
}

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

function convertArcCommandsToCurves(d: string): string {
  if (!/[Aa]/.test(d)) return d;
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
        out.push('M', `${abs.x}`, `${abs.y}`);
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
        out.push('L', `${abs.x}`, `${abs.y}`);
        cx = abs.x;
        cy = abs.y;
        break;
      }
      case 'H': {
        const x = readNumber();
        const abs = rel ? cx + x : x;
        out.push('L', `${abs}`, `${cy}`);
        cx = abs;
        break;
      }
      case 'V': {
        const y = readNumber();
        const abs = rel ? cy + y : y;
        out.push('L', `${cx}`, `${abs}`);
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
        out.push('C', `${a1.x}`, `${a1.y}`, `${a2.x}`, `${a2.y}`, `${a.x}`, `${a.y}`);
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
        out.push('S', `${a2.x}`, `${a2.y}`, `${a.x}`, `${a.y}`);
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
        out.push('Q', `${a1.x}`, `${a1.y}`, `${a.x}`, `${a.y}`);
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
        const curves = arcToCurves(cx, cy, rx, ry, xAxisRotation, largeArc, sweep, a.x, a.y);
        if (curves && curves.length) {
          for (let ci = 0; ci < curves.length; ci += 6) {
            out.push('C', `${curves[ci]}`, `${curves[ci + 1]}`, `${curves[ci + 2]}`, `${curves[ci + 3]}`, `${curves[ci + 4]}`, `${curves[ci + 5]}`);
          }
        } else {
          out.push('L', `${a.x}`, `${a.y}`);
        }
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
}

function parsePathD(pathEl: Element): string {
  const parts: string[] = [];

  for (const el of childElements(pathEl)) {
    validateAttrs(el);
    switch (el.tagName) {
      case 'move': {
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        parts.push(`M ${x} ${y}`);
        break;
      }
      case 'line': {
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        parts.push(`L ${x} ${y}`);
        break;
      }
      case 'arc': {
        // Use SVG-arc-like attributes directly
        const rx = readNumAttr(el, 'rx', 0);
        const ry = readNumAttr(el, 'ry', 0);
        const xAxisRotation = readNumAttr(el, 'x-axis-rotation', 0);
        const largeArcFlag = readNumAttr(el, 'large-arc-flag', 0);
        const sweepFlag = readNumAttr(el, 'sweep-flag', 0);
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        parts.push(`A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`);
        break;
      }
      case 'curve': {
        // Cubic bezier curve: C x1 y1, x2 y2, x3 y3
        const x1 = readNumAttr(el, 'x1', 0);
        const y1 = readNumAttr(el, 'y1', 0);
        const x2 = readNumAttr(el, 'x2', 0);
        const y2 = readNumAttr(el, 'y2', 0);
        const x3 = readNumAttr(el, 'x3', 0);
        const y3 = readNumAttr(el, 'y3', 0);
        parts.push(`C ${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`);
        break;
      }
      case 'quad': {
        // Quadratic bezier curve: Q x1 y1, x2 y2
        const x1 = readNumAttr(el, 'x1', 0);
        const y1 = readNumAttr(el, 'y1', 0);
        const x2 = readNumAttr(el, 'x2', 0);
        const y2 = readNumAttr(el, 'y2', 0);
        parts.push(`Q ${x1} ${y1} ${x2} ${y2}`);
        break;
      }
      case 'close': {
        parts.push('Z');
        break;
      }
      // Style hints inside path - these are non-standard but appear in some stencils
      // They should be handled at the path level, not here, so we just ignore them
      case 'linejoin':
      case 'linecap':
      case 'strokewidth':
      case 'fillcolor':
      case 'strokecolor': {
        // Ignore style hints inside path - they're handled elsewhere
        break;
      }
      case 'ellipse': {
        // Some stencils put ellipse inside path - convert to arc commands
        // An ellipse at (x,y) with size (w,h) can be drawn as two arcs
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        const w = readNumAttr(el, 'w', 0);
        const h = readNumAttr(el, 'h', 0);
        const rx = w / 2;
        const ry = h / 2;
        const cx = x + rx;
        const cy = y + ry;
        // Draw ellipse as two arcs: move to left point, arc to right, arc back to left
        parts.push(`M ${cx - rx} ${cy}`);
        parts.push(`A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy}`);
        parts.push(`A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`);
        parts.push('Z');
        break;
      }
      default: {
        trackUnknownTag(el.tagName);
        break;
      }
    }
  }

  return convertArcCommandsToCurves(parts.join(' '));
}

// Placeholder strings for dynamic colors (to be replaced at render time)
const PLACEHOLDER_FILL = '{{fillColor}}';
const PLACEHOLDER_STROKE = '{{strokeColor}}';
const PLACEHOLDER_FONT = '{{fontColor}}';
const PLACEHOLDER_STROKE_WIDTH = '{{strokeWidth}}';

function renderStencilSection(
  sectionEl: Element,
  parent: Element,
  builder: SvgBuilder,
  initialStrokeWidth?: number | string,
  sharedState?: StencilStyleState,
  sharedStack?: StencilStyleState[],
  sharedPending?: PendingDrawable | null,
  flushAtEnd = true
): { state: StencilStyleState; stack: StencilStyleState[]; pending: PendingDrawable | null } {
  const stack: StencilStyleState[] = sharedStack ?? [];
  let state: StencilStyleState = sharedState ?? {
    fillColor: PLACEHOLDER_FILL,
    strokeColor: PLACEHOLDER_STROKE,
    strokeWidth: initialStrokeWidth ?? 1,
    fillOpacity: 1,
    strokeOpacity: 1,
    globalAlpha: 1,
    dashed: false,
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    fontStyle: 0,
    fontColor: PLACEHOLDER_FONT,
  };

  let pending: PendingDrawable | null = sharedPending ?? null;

  const flushPending = (paint: 'fillstroke' | 'stroke' | 'fill'): void => {
    if (!pending) return;
    const attrs = buildPaintAttrs(state, paint);
    if (pending.type === 'path') {
      const normalized = convertArcCommandsToCurves(pending.d);
      parent.appendChild(builder.createPath(normalized, attrs));
    } else if (pending.type === 'rect') {
      if (pending.rx) attrs.rx = pending.rx;
      if (pending.ry) attrs.ry = pending.ry;
      parent.appendChild(builder.createRect(pending.x, pending.y, pending.w, pending.h, attrs));
    } else if (pending.type === 'ellipse') {
      parent.appendChild(builder.createEllipse(pending.cx, pending.cy, pending.rx, pending.ry, attrs));
    } else if (pending.type === 'text') {
      // Render text element
      let textY = pending.y;
      if (pending.valign === 'middle') {
        textY += state.fontSize / 6;
      } else if (pending.valign === 'top') {
        textY += state.fontSize - 1;
      } else if (pending.valign === 'bottom') {
        textY -= 1;
      }
      const textAttrs: Record<string, string | number> = {
        x: pending.x,
        y: textY,
        fill: state.fontColor,
        'font-family': state.fontFamily,
        'font-size': state.fontSize,
      };
      if (pending.align === 'center') textAttrs['text-anchor'] = 'middle';
      else if (pending.align === 'right') textAttrs['text-anchor'] = 'end';
      if (state.fontStyle & 1) textAttrs['font-weight'] = 'bold';
      if (state.fontStyle & 2) textAttrs['font-style'] = 'italic';
      if (state.globalAlpha !== 1) textAttrs['opacity'] = state.globalAlpha;
      
      const textEl = builder.doc.createElementNS('http://www.w3.org/2000/svg', 'text');
      for (const [k, v] of Object.entries(textAttrs)) {
        textEl.setAttribute(k, String(v));
      }
      textEl.textContent = pending.str;
      parent.appendChild(textEl);
    }
    pending = null;
  };

  for (const el of childElements(sectionEl)) {
    validateAttrs(el);
    switch (el.tagName) {
      case 'save': {
        stack.push({ ...state });
        break;
      }
      case 'restore': {
        state = stack.pop() ?? state;
        break;
      }
      case 'fillcolor': {
        const defaultVal = el.getAttribute('default') ?? undefined;
        state = { ...state, fillColor: normalizeStencilColor(el.getAttribute('color'), state, defaultVal) };
        break;
      }
      case 'strokecolor': {
        const c = el.getAttribute('color');
        const defaultVal = el.getAttribute('default') ?? undefined;
        if (c) state = { ...state, strokeColor: normalizeStencilColor(c, state, defaultVal) };
        break;
      }
      case 'fillstrokecolor': {
        // Sets both fill and stroke to the same color
        const c = el.getAttribute('color');
        const defaultVal = el.getAttribute('default') ?? undefined;
        if (c) {
          const color = normalizeStencilColor(c, state, defaultVal);
          state = { ...state, fillColor: color, strokeColor: color };
        }
        break;
      }
      case 'fillalpha': {
        const a = readNumAttr(el, 'alpha', state.fillOpacity);
        state = { ...state, fillOpacity: Number.isFinite(a) ? a : state.fillOpacity };
        break;
      }
      case 'strokealpha': {
        const a = readNumAttr(el, 'alpha', state.strokeOpacity);
        state = { ...state, strokeOpacity: Number.isFinite(a) ? a : state.strokeOpacity };
        break;
      }
      case 'alpha': {
        // Global alpha affects both fill and stroke
        const a = readNumAttr(el, 'alpha', state.globalAlpha);
        state = { ...state, globalAlpha: Number.isFinite(a) ? a : state.globalAlpha };
        break;
      }
      case 'miterlimit': {
        const l = readNumAttr(el, 'limit', 4);
        state = { ...state, miterLimit: l };
        break;
      }
      case 'strokewidth': {
        const fallback = typeof state.strokeWidth === 'number' ? state.strokeWidth : 1;
        const w = readNumAttr(el, 'width', fallback);
        state = { ...state, strokeWidth: w };
        break;
      }
      case 'dashed': {
        const raw = el.getAttribute('dashed');
        state = { ...state, dashed: raw === '1' || raw === 'true' };
        break;
      }
      case 'dashpattern': {
        const p = el.getAttribute('pattern') ?? el.getAttribute('dash') ?? '';
        state = { ...state, dashPattern: p };
        break;
      }
      case 'linejoin': {
        const j = el.getAttribute('join');
        if (j) state = { ...state, lineJoin: j };
        break;
      }
      case 'linecap': {
        const c = el.getAttribute('cap');
        if (c) state = { ...state, lineCap: c };
        break;
      }
      case 'fontfamily': {
        const f = el.getAttribute('family');
        if (f) state = { ...state, fontFamily: f };
        break;
      }
      case 'fontsize': {
        const s = readNumAttr(el, 'size', state.fontSize);
        state = { ...state, fontSize: s };
        break;
      }
      case 'fontstyle': {
        const s = readNumAttr(el, 'style', state.fontStyle);
        state = { ...state, fontStyle: s };
        break;
      }
      case 'fontcolor': {
        const c = el.getAttribute('color');
        const defaultVal = el.getAttribute('default') ?? undefined;
        if (c) state = { ...state, fontColor: normalizeStencilColor(c, state, defaultVal) };
        else if (defaultVal) state = { ...state, fontColor: defaultVal };
        break;
      }

      case 'path': {
        pending = { type: 'path', d: parsePathD(el) };
        break;
      }
      // Path commands can appear directly in section (implicit path)
      case 'move':
      case 'line':
      case 'arc':
      case 'curve':
      case 'quad':
      case 'close': {
        // These are path commands appearing at section level - build implicit path
        // Collect consecutive path commands into a single path
        let d = '';
        
        // We need to iterate starting from current element
        // But since we're in a for-loop, we should just handle this single command
        // and let subsequent iterations handle the rest
        switch (el.tagName) {
          case 'move': {
            const x = readNumAttr(el, 'x', 0);
            const y = readNumAttr(el, 'y', 0);
            d = `M ${x} ${y}`;
            break;
          }
          case 'line': {
            const x = readNumAttr(el, 'x', 0);
            const y = readNumAttr(el, 'y', 0);
            d = `L ${x} ${y}`;
            break;
          }
          case 'arc': {
            const rx = readNumAttr(el, 'rx', 0);
            const ry = readNumAttr(el, 'ry', 0);
            const xAxisRotation = readNumAttr(el, 'x-axis-rotation', 0);
            const largeArcFlag = readNumAttr(el, 'large-arc-flag', 0);
            const sweepFlag = readNumAttr(el, 'sweep-flag', 0);
            const x = readNumAttr(el, 'x', 0);
            const y = readNumAttr(el, 'y', 0);
            d = `A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`;
            break;
          }
          case 'curve': {
            const x1 = readNumAttr(el, 'x1', 0);
            const y1 = readNumAttr(el, 'y1', 0);
            const x2 = readNumAttr(el, 'x2', 0);
            const y2 = readNumAttr(el, 'y2', 0);
            const x3 = readNumAttr(el, 'x3', 0);
            const y3 = readNumAttr(el, 'y3', 0);
            d = `C ${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`;
            break;
          }
          case 'quad': {
            const x1 = readNumAttr(el, 'x1', 0);
            const y1 = readNumAttr(el, 'y1', 0);
            const x2 = readNumAttr(el, 'x2', 0);
            const y2 = readNumAttr(el, 'y2', 0);
            d = `Q ${x1} ${y1} ${x2} ${y2}`;
            break;
          }
          case 'close': {
            d = 'Z';
            break;
          }
        }
        // Append to existing path or create new one
        if (pending?.type === 'path') {
          pending.d += ' ' + d;
        } else {
          pending = { type: 'path', d };
        }
        break;
      }
      case 'fill': {
        flushPending('fill');
        break;
      }
      case 'fillstroke': {
        flushPending('fillstroke');
        break;
      }
      case 'stroke': {
        flushPending('stroke');
        break;
      }

      case 'rect': {
        // In mxStencil, <rect> is a drawable primitive which is painted by <fill>/<stroke>/<fillstroke>
        if (el.attributes.length === 0) {
          // Empty <rect/> is a placeholder/no-op in mxStencil; render as a zero-size rect
          // with no paint to match the platform output and avoid affecting state.
          parent.appendChild(builder.createRect(0, 0, 0, 0, { fill: 'none', stroke: 'none' }));
          pending = null;
          break;
        }
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        const w = readNumAttr(el, 'w', 0);
        const h = readNumAttr(el, 'h', 0);
        const rx = el.hasAttribute('rx') ? readNumAttr(el, 'rx', 0) : undefined;
        const ry = el.hasAttribute('ry') ? readNumAttr(el, 'ry', 0) : undefined;
        pending = { type: 'rect', x, y, w, h, rx, ry };
        break;
      }
      case 'roundrect': {
        // Rounded rectangle with arcsize (percentage of min(w,h)/2)
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        const w = readNumAttr(el, 'w', 0);
        const h = readNumAttr(el, 'h', 0);
        const arcsize = readNumAttr(el, 'arcsize', 0);
        // arcsize is a percentage; calculate actual radius
        const r = Math.min(w, h) * (arcsize / 100) / 2;
        pending = { type: 'rect', x, y, w, h, rx: r, ry: r };
        break;
      }
      case 'ellipse': {
        // In mxStencil, <ellipse> is also painted by <fill>/<stroke>/<fillstroke>
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        const w = readNumAttr(el, 'w', 0);
        const h = readNumAttr(el, 'h', 0);
        const cx = x + w / 2;
        const cy = y + h / 2;
        const rx = w / 2;
        const ry = h / 2;
        pending = { type: 'ellipse', cx, cy, rx, ry };
        break;
      }
      case 'text': {
        const x = readNumAttr(el, 'x', 0);
        const y = readNumAttr(el, 'y', 0);
        const str = el.getAttribute('str') ?? '';
        const align = el.getAttribute('align') ?? 'left';
        const valign = el.getAttribute('valign') ?? 'top';
        pending = { type: 'text', x, y, str, align, valign };
        // Text is painted immediately (not deferred to fill/stroke)
        flushPending('fill');
        break;
      }

      // Connection points - metadata only, no rendering
      case 'connections':
      case 'constraint': {
        // These define connection points for edges, not visual elements
        break;
      }

      default: {
        trackUnknownTag(el.tagName);
        break;
      }
    }
  }

  // If a drawable is pending but no paint op followed, ignore it.
  if (flushAtEnd) {
    pending = null;
  }
  return { state, stack, pending };
}

export function convertStencilXmlToSvgs(xml: string, limit?: number, collectStats = false): StencilShapeSvg[] {
  // Initialize stats if requested
  if (collectStats) {
    globalStats = {
      unknownTags: new Map(),
      unknownAttrs: new Map(),
      totalShapes: 0,
    };
  } else {
    globalStats = null;
  }

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

  const result: StencilShapeSvg[] = [];
  for (const shapeEl of shapes) {
    validateAttrs(shapeEl);
    const name = shapeEl.getAttribute('name') ?? '';
    const width = readNumAttr(shapeEl, 'w', 100);
    const height = readNumAttr(shapeEl, 'h', 100);

    const strokeWidthAttr = (shapeEl.getAttribute('strokewidth') || '').trim();
    const initialStrokeWidth = strokeWidthAttr === 'inherit'
      ? PLACEHOLDER_STROKE_WIDTH
      : (strokeWidthAttr ? readNumAttr(shapeEl, 'strokewidth', 1) : 1);

    const builder = new SvgBuilder(width, height);
    builder.setDimensions(width, height, `0 0 ${width} ${height}`);

    const g = builder.createGroup();
    builder.root.appendChild(g);

    const bg = findDirectChild(shapeEl, 'background');
    const fg = findDirectChild(shapeEl, 'foreground');
    let sharedState: StencilStyleState | undefined;
    let sharedStack: StencilStyleState[] | undefined;
    let sharedPending: PendingDrawable | null = null;
    if (bg) {
      const result = renderStencilSection(
        bg,
        g,
        builder,
        initialStrokeWidth,
        sharedState,
        sharedStack,
        sharedPending,
        !fg
      );
      sharedState = result.state;
      sharedStack = result.stack;
      sharedPending = result.pending;
    }
    if (fg) {
      const result = renderStencilSection(
        fg,
        g,
        builder,
        initialStrokeWidth,
        sharedState,
        sharedStack,
        sharedPending,
        true
      );
      sharedState = result.state;
      sharedStack = result.stack;
      sharedPending = result.pending;
    }
    
    // Check for other direct children of shape (connections is metadata, others may need handling)
    for (const child of childElements(shapeEl)) {
      const tag = child.tagName;
      if (tag !== 'background' && tag !== 'foreground' && tag !== 'connections') {
        trackUnknownTag(`shape>${tag}`);
      }
    }

    result.push({ name, width, height, svg: builder.toString() });
    if (globalStats) globalStats.totalShapes++;
    if (limit !== undefined && result.length >= limit) break;
  }

  return result;
}

/**
 * Get the collected stats from the last conversion with collectStats=true
 */
export function getConversionStats(): StencilConversionStats | null {
  return globalStats;
}

/**
 * Print a summary of unknown tags and attributes
 */
export function printConversionStats(): void {
  if (!globalStats) {
    console.log('No stats collected. Call convertStencilXmlToSvgs with collectStats=true');
    return;
  }

  console.log('\n' + '='.repeat(60));
  console.log('STENCIL CONVERSION STATS');
  console.log('='.repeat(60));
  console.log(`Total shapes processed: ${globalStats.totalShapes}`);

  if (globalStats.unknownTags.size > 0) {
    console.log('\n📕 Unknown Tags:');
    const sorted = [...globalStats.unknownTags.entries()].sort((a, b) => b[1] - a[1]);
    for (const [tag, count] of sorted) {
      console.log(`  ${tag.padEnd(25)} ${count} occurrences`);
    }
  } else {
    console.log('\n✅ No unknown tags found!');
  }

  if (globalStats.unknownAttrs.size > 0) {
    console.log('\n📕 Unknown Attributes:');
    const sorted = [...globalStats.unknownAttrs.entries()].sort((a, b) => b[1] - a[1]);
    for (const [attr, count] of sorted) {
      console.log(`  ${attr.padEnd(35)} ${count} occurrences`);
    }
  } else {
    console.log('\n✅ No unknown attributes found!');
  }
  console.log('');
}
