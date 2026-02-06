/**
 * Diagram XML Parser
 * 
 * Parses diagram files into a structured format.
 * Supports both compressed (deflate+base64) and plain XML formats.
 */

import { inflate } from 'pako';

/** Geometry information for a cell */
export interface MxGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  relative?: boolean;
  /** Alternate bounds for table cell spans */
  alternateBounds?: { x: number; y: number; width: number; height: number };
  /** Source point for edges */
  sourcePoint?: { x: number; y: number };
  /** Target point for edges */
  targetPoint?: { x: number; y: number };
  /** Waypoints for edge routing */
  points?: Array<{ x: number; y: number }>;
  /** Offset for labels */
  offset?: { x: number; y: number };
}

/** Parsed style as key-value pairs */
export interface MxStyle {
  [key: string]: string | boolean | number;
}

/** A cell (shape or edge) in the diagram */
export interface MxCell {
  id: string;
  value?: string;
  style: MxStyle;
  parent?: string;
  source?: string;
  target?: string;
  vertex?: boolean;
  edge?: boolean;
  collapsed?: boolean;
  visible?: boolean;
  geometry?: MxGeometry;
}

/** Graph model settings */
export interface MxGraphModel {
  dx: number;
  dy: number;
  grid: boolean;
  gridSize: number;
  pageWidth: number;
  pageHeight: number;
}

/** A single diagram/page */
export interface Diagram {
  id: string;
  name: string;
  model: MxGraphModel;
  cells: MxCell[];
}

/** Complete parsed diagram file */
export interface ParsedDrawio {
  diagrams: Diagram[];
}

/**
 * Parse style string into key-value pairs
 * e.g., "shape=ellipse;fillColor=#FF0000" → { shape: "ellipse", fillColor: "#FF0000" }
 *
 * Named styles are defined in drawio's default-style2 theme.
 * See: temp/drawio-dev/src/main/webapp/js/viewer-static.min.js
 * Graph.prototype.defaultThemes["default-style2"] = mxUtils.parseXml('<mxStylesheet>...</mxStylesheet>')
 */
const DEFAULT_VERTEX_STYLE: MxStyle = {};

const DEFAULT_EDGE_STYLE: MxStyle = {};

/**
 * Named style registry based on drawio's default-style2 theme.
 * When a style token without '=' is encountered (e.g., "ellipse;fillColor=red"),
 * we look up the token in this registry and merge all its properties.
 *
 * Source: Graph.prototype.defaultThemes["default-style2"] in viewer-static.min.js
 */
const STYLE_REGISTRY: Record<string, MxStyle> = {
  // Base styles
  defaultVertex: DEFAULT_VERTEX_STYLE,
  defaultEdge: DEFAULT_EDGE_STYLE,

  // Text style: no fill, align left
  text: {
    shape: 'text',
    fillColor: 'none',
    gradientColor: 'none',
    strokeColor: 'none',
    align: 'left',
    verticalAlign: 'top',
  },

  // Edge label: extends text
  edgeLabel: {
    fillColor: 'none',
    gradientColor: 'none',
    strokeColor: 'none',
    align: 'left',
    verticalAlign: 'top',
    fontSize: 11,
  },

  // Label style: bold text with icon space
  label: {
    shape: 'label',
    fontStyle: 1,
    align: 'left',
    verticalAlign: 'middle',
    spacing: 2,
    spacingLeft: 52,
    imageWidth: 42,
    imageHeight: 42,
    rounded: 1,
  },

  // Icon style: extends label, centered
  icon: {
    shape: 'label',
    fontStyle: 0,
    align: 'center',
    imageAlign: 'center',
    verticalLabelPosition: 'bottom',
    verticalAlign: 'top',
    spacingTop: 6,
    spacing: 0,
    spacingLeft: 0,
    imageWidth: 48,
    imageHeight: 48,
    rounded: 1,
  },

  // Swimlane style
  swimlane: {
    shape: 'swimlane',
    fontSize: 12,
    fontStyle: 1,
    startSize: 23,
  },

  // Group style: invisible container
  group: {
    verticalAlign: 'top',
    fillColor: 'none',
    strokeColor: 'none',
    gradientColor: 'none',
    pointerEvents: 0,
  },

  // Shape styles with perimeters
  ellipse: {
    shape: 'ellipse',
    perimeter: 'ellipsePerimeter',
  },

  rhombus: {
    shape: 'rhombus',
    perimeter: 'rhombusPerimeter',
  },

  triangle: {
    shape: 'triangle',
    perimeter: 'trianglePerimeter',
  },

  // Line style: thick stroke
  line: {
    shape: 'line',
    strokeWidth: 4,
    verticalAlign: 'top',
  },

  // Image style
  image: {
    shape: 'image',
    verticalAlign: 'top',
    verticalLabelPosition: 'bottom',
  },

  // Round image: extends image with ellipse perimeter
  roundImage: {
    shape: 'image',
    verticalAlign: 'top',
    verticalLabelPosition: 'bottom',
    perimeter: 'ellipsePerimeter',
  },

  // Rhombus image: extends image with rhombus perimeter
  rhombusImage: {
    shape: 'image',
    verticalAlign: 'top',
    verticalLabelPosition: 'bottom',
    perimeter: 'rhombusPerimeter',
  },

  // Arrow shape style
  // Note: fillColor='default' in drawio means use the default fill color (white)
  arrow: {
    shape: 'arrow',
    edgeStyle: 'none',
    fillColor: '#ffffff',
  },

  // Fancy style: shadow and glass
  fancy: {
    shadow: '1',
    glass: '1',
  },

  // Color styles with fancy (shadow + glass)
  gray: {
    shadow: '1',
    glass: '1',
    gradientColor: '#B3B3B3',
    fillColor: '#F5F5F5',
    strokeColor: '#666666',
  },

  blue: {
    shadow: '1',
    glass: '1',
    gradientColor: '#7EA6E0',
    fillColor: '#DAE8FC',
    strokeColor: '#6C8EBF',
  },

  green: {
    shadow: '1',
    glass: '1',
    gradientColor: '#97D077',
    fillColor: '#D5E8D4',
    strokeColor: '#82B366',
  },

  turquoise: {
    gradientColor: '#67AB9F',
    fillColor: '#D5E8D4',
    strokeColor: '#6A9153',
  },

  yellow: {
    shadow: '1',
    glass: '1',
    gradientColor: '#FFD966',
    fillColor: '#FFF2CC',
    strokeColor: '#D6B656',
  },

  orange: {
    gradientColor: '#FFA500',
    fillColor: '#FFCD28',
    strokeColor: '#D79B00',
  },

  red: {
    shadow: '1',
    gradientColor: '#EA6B66',
    fillColor: '#F8CECC',
    strokeColor: '#B85450',
  },

  pink: {
    gradientColor: '#B5739D',
    fillColor: '#E6D0DE',
    strokeColor: '#996185',
  },

  // purple only sets shadow, not colors (matching old behavior)
  purple: {
    shadow: '1',
  },

  // Plain color styles (no shadow/glass)
  'plain-gray': {
    gradientColor: '#B3B3B3',
    fillColor: '#F5F5F5',
    strokeColor: '#666666',
  },

  'plain-blue': {
    gradientColor: '#7EA6E0',
    fillColor: '#DAE8FC',
    strokeColor: '#6C8EBF',
  },

  'plain-green': {
    gradientColor: '#97D077',
    fillColor: '#D5E8D4',
    strokeColor: '#82B366',
  },

  'plain-turquoise': {
    gradientColor: '#67AB9F',
    fillColor: '#D5E8D4',
    strokeColor: '#6A9153',
  },

  'plain-yellow': {
    gradientColor: '#FFD966',
    fillColor: '#FFF2CC',
    strokeColor: '#D6B656',
  },

  'plain-orange': {
    gradientColor: '#FFA500',
    fillColor: '#FFCD28',
    strokeColor: '#D79B00',
  },

  'plain-red': {
    gradientColor: '#EA6B66',
    fillColor: '#F8CECC',
    strokeColor: '#B85450',
  },

  'plain-pink': {
    gradientColor: '#B5739D',
    fillColor: '#E6D0DE',
    strokeColor: '#996185',
  },

  'plain-purple': {
    gradientColor: '#8C6C9C',
    fillColor: '#E1D5E7',
    strokeColor: '#9673A6',
  },
};

function resolveStyleString(styleStr: string | null, isEdge: boolean): MxStyle {
  const baseStyle = isEdge ? DEFAULT_EDGE_STYLE : DEFAULT_VERTEX_STYLE;
  let style: MxStyle | null = null;

  if (styleStr && styleStr.length > 0) {
    const parts = styleStr.split(';');
    style = styleStr.charAt(0) !== ';' ? { ...baseStyle } : {};
    let imageToken = false;

    for (const rawPart of parts) {
      if (!rawPart) continue;
      const pos = rawPart.indexOf('=');

      if (pos >= 0) {
        const key = rawPart.substring(0, pos);
        const value = rawPart.substring(pos + 1);

        if (key === 'image' && imageToken) {
          style.shape = 'image';
        }

        style[key] = value;
      } else {
        const name = rawPart;

        if (name === 'image') {
          imageToken = true;
          style.shape = 'image';
          continue;
        }

        // Look up named style in registry (based on drawio's default-style2 theme)
        const namedStyle = STYLE_REGISTRY[name];
        if (namedStyle) {
          // Merge all properties from named style (only if not already set)
          for (const key in namedStyle) {
            if (style[key] === undefined) {
              style[key] = namedStyle[key];
            }
          }
          // Set the token as a flag for backward compatibility
          style[name] = true;
        } else {
          // Unknown token, just set it as a flag
          style[name] = true;
        }
      }
    }
  } else {
    style = { ...baseStyle };
  }

  return style;
}

/**
 * Parse geometry element
 */
function parseGeometry(geoEl: any): MxGeometry | undefined {
  if (!geoEl) return undefined;

  const geo: MxGeometry = {
    x: parseFloat(geoEl.getAttribute('x')) || 0,
    y: parseFloat(geoEl.getAttribute('y')) || 0,
    width: parseFloat(geoEl.getAttribute('width')) || 0,
    height: parseFloat(geoEl.getAttribute('height')) || 0,
    relative: geoEl.getAttribute('relative') === '1',
  };

  // Parse child elements (points, sourcePoint, targetPoint, offset)
  const children = geoEl.childNodes;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.nodeType !== 1) continue; // Skip non-element nodes

    const tag = child.nodeName;
    if (tag === 'mxPoint') {
      const as = child.getAttribute('as');
      const point = {
        x: parseFloat(child.getAttribute('x')) || 0,
        y: parseFloat(child.getAttribute('y')) || 0,
      };
      if (as === 'sourcePoint') geo.sourcePoint = point;
      else if (as === 'targetPoint') geo.targetPoint = point;
      else if (as === 'offset') geo.offset = point;
      else {
        if (!geo.points) geo.points = [];
        geo.points.push(point);
      }
    } else if (tag === 'Array' && child.getAttribute('as') === 'points') {
      geo.points = [];
      const pointEls = child.getElementsByTagName('mxPoint');
      for (let j = 0; j < pointEls.length; j++) {
        geo.points.push({
          x: parseFloat(pointEls[j].getAttribute('x')) || 0,
          y: parseFloat(pointEls[j].getAttribute('y')) || 0,
        });
      }
    } else if (tag === 'mxRectangle' && child.getAttribute('as') === 'alternateBounds') {
      geo.alternateBounds = {
        x: parseFloat(child.getAttribute('x')) || 0,
        y: parseFloat(child.getAttribute('y')) || 0,
        width: parseFloat(child.getAttribute('width')) || 0,
        height: parseFloat(child.getAttribute('height')) || 0,
      };
    }
  }

  return geo;
}

/**
 * Parse an mxCell element
 * @param cellEl - The mxCell element
 * @param userObjectEl - Optional UserObject wrapper element that may contain the ID
 */
type CellParseContext = {
  wrapperById: Map<string, any>;
  cellById: Map<string, any>;
  autoIdCounter: number;
  placeholderDate?: Date;
};

function getPlaceholderDate(context?: CellParseContext): Date {
  // Use current date by default
  return context?.placeholderDate ?? new Date();
}

// Format date using local timezone
function formatDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function pad2(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

// Format time using local timezone
function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const period = hours >= 12 ? 'PM' : 'AM';

  hours %= 12;
  if (hours === 0) hours = 12;

  return `${hours}:${pad2(minutes)}:${pad2(seconds)} ${period}`;
}

function formatTimestamp(date: Date): string {
  return `${formatDate(date)}, ${formatTime(date)}`;
}

function parseCell(cellEl: any, userObjectEl?: any, context?: CellParseContext): MxCell {
  // Some exports wrap mxCell in <UserObject> without an id on mxCell
  // Get ID from: mxCell itself, or UserObject parent, or parentElement
  const cellElId = cellEl.getAttribute('id');
  const userObjectId = userObjectEl?.getAttribute('id');
  let inferredId = cellElId || userObjectId || '';
  if (!inferredId && context) {
    inferredId = `__auto_${context.autoIdCounter++}__`;
  }

  const rawStyle = cellEl.getAttribute('style');

  const cell: MxCell = {
    id: inferredId,
    style: {},
  };

  // Get value from: mxCell value, UserObject label, or parent label
  let value = cellEl.getAttribute('value') || userObjectEl?.getAttribute('label') || cellEl.parentElement?.getAttribute('label');
  
  // Replace placeholders in UserObject/object labels
  if (value && userObjectEl) {
    const placeholdersAttr = userObjectEl.getAttribute('placeholders');
    if (placeholdersAttr === '1') {
      const resolvePlaceholder = (attrName: string): string | null => {
        if (userObjectEl.hasAttribute(attrName)) {
          return userObjectEl.getAttribute(attrName);
        }

        if (!context) return null;
        const visited = new Set<string>();
        let parentId = cellEl.getAttribute('parent');

        while (parentId && !visited.has(parentId)) {
          visited.add(parentId);

          const parentWrapper = context.wrapperById.get(parentId);
          if (parentWrapper && parentWrapper.hasAttribute(attrName)) {
            return parentWrapper.getAttribute(attrName);
          }

          const parentCell = context.cellById.get(parentId);
          if (!parentCell) break;
          parentId = parentCell.getAttribute('parent');
        }

        const rootWrapper = context.wrapperById.get('0');
        if (rootWrapper && rootWrapper.hasAttribute(attrName)) {
          return rootWrapper.getAttribute(attrName);
        }

        if (attrName === 'date') {
          return formatDate(getPlaceholderDate(context));
        }

        if (attrName === 'time') {
          return formatTime(getPlaceholderDate(context));
        }

        if (attrName === 'timestamp') {
          return formatTimestamp(getPlaceholderDate(context));
        }

        return null;
      };

      // Replace %attribute% with actual attribute values from wrappers
      value = value.replace(/%(\w+)%/g, (match: string, attrName: string) => {
        return resolvePlaceholder(attrName) ?? match;
      });
    }
  }
  
  if (value) cell.value = value;

  const parent = cellEl.getAttribute('parent');
  if (parent) cell.parent = parent;

  const source = cellEl.getAttribute('source');
  if (source) cell.source = source;

  const target = cellEl.getAttribute('target');
  if (target) cell.target = target;

  if (cellEl.getAttribute('vertex') === '1') cell.vertex = true;
  if (cellEl.getAttribute('edge') === '1') cell.edge = true;

  const collapsedAttr = cellEl.getAttribute('collapsed');
  if (collapsedAttr === '1' || collapsedAttr === 'true') {
    cell.collapsed = true;
  }

  const visibleAttr = cellEl.getAttribute('visible');
  if (visibleAttr === '0' || visibleAttr === 'false') {
    cell.visible = false;
  } else if (visibleAttr === '1' || visibleAttr === 'true') {
    cell.visible = true;
  }

  cell.style = resolveStyleString(rawStyle, cell.edge === true);

  const link = cellEl.getAttribute('link') || userObjectEl?.getAttribute('link') || cellEl.parentElement?.getAttribute('link');
  if (link) {
    cell.style.link = link;
  }

  // Parse geometry
  const geoEls = cellEl.getElementsByTagName('mxGeometry');
  if (geoEls.length > 0) {
    cell.geometry = parseGeometry(geoEls[0]);
  }

  return cell;
}

/**
 * Decompress diagram content
 * Uses: base64 → inflate (raw deflate) → URL decode
 */
function decompressContent(compressed: string): string {
  try {
    // Base64 decode
    const binary = atob(compressed);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Inflate (raw deflate, no header)
    const inflated = inflate(bytes, { raw: true });

    // Decode as UTF-8
    const decoder = new TextDecoder('utf-8');
    const xml = decoder.decode(inflated);

    // URL decode
    return decodeURIComponent(xml);
  } catch (e) {
    // If decompression fails, assume it's plain XML
    return compressed;
  }
}

/**
 * Parse a diagram XML string
 */
export function parse(xmlString: string): ParsedDrawio {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(xmlString, 'text/xml');
  const diagrams: Diagram[] = [];
  const placeholderDate = parseRootPlaceholderDate(doc);

  // Find all diagram elements
  const diagramEls = doc.getElementsByTagName('diagram');

  for (let i = 0; i < diagramEls.length; i++) {
    const diagramEl = diagramEls[i];
    const diagram = parseDiagram(diagramEl, domParser, placeholderDate);
    if (diagram) {
      diagrams.push(diagram);
    }
  }

  return { diagrams };
}

/**
 * Parse a single diagram element
 */
function parseDiagram(diagramEl: Element, domParser: DOMParser, placeholderDate?: Date): Diagram | null {
  const id = diagramEl.getAttribute('id') || `diagram-${Date.now()}`;
  const name = diagramEl.getAttribute('name') || 'Page-1';

  // Get diagram content - might be compressed or contain mxGraphModel directly
  let modelEl: Element | null = null;

  // Check for direct mxGraphModel child
  const directModel = diagramEl.getElementsByTagName('mxGraphModel');
  if (directModel.length > 0) {
    modelEl = directModel[0];
  } else {
    // Content is compressed - get text content and decompress
    const textContent = diagramEl.textContent?.trim();
    if (textContent) {
      const decompressed = decompressContent(textContent);
      const contentDoc = domParser.parseFromString(decompressed, 'text/xml');
      const models = contentDoc.getElementsByTagName('mxGraphModel');
      if (models.length > 0) {
        modelEl = models[0];
      }
    }
  }

  if (!modelEl) {
    return null;
  }

  // Parse graph model attributes
  const model: MxGraphModel = {
    dx: parseFloat(modelEl.getAttribute('dx') || '0'),
    dy: parseFloat(modelEl.getAttribute('dy') || '0'),
    grid: modelEl.getAttribute('grid') === '1',
    gridSize: parseFloat(modelEl.getAttribute('gridSize') || '10'),
    pageWidth: parseFloat(modelEl.getAttribute('pageWidth') || '850'),
    pageHeight: parseFloat(modelEl.getAttribute('pageHeight') || '1100'),
  };

  // Parse all cells - need to handle direct mxCell and wrapper elements
  const cells: MxCell[] = [];
  const processedCells = new Set(); // Track processed cells to avoid duplicates
  const wrapperById = new Map<string, any>();
  const cellById = new Map<string, any>();
  const context: CellParseContext = {
    wrapperById,
    cellById,
    autoIdCounter: 0,
    placeholderDate,
  };
  
  // First, find all wrapper elements (<UserObject> and <object>) that contain mxCell
  const userObjectEls = modelEl.getElementsByTagName('UserObject');
  const objectEls = modelEl.getElementsByTagName('object');
  const wrapperEls: any[] = [];
  for (let i = 0; i < userObjectEls.length; i++) wrapperEls.push(userObjectEls[i]);
  for (let i = 0; i < objectEls.length; i++) wrapperEls.push(objectEls[i]);

  for (let i = 0; i < wrapperEls.length; i++) {
    const wrapperEl = wrapperEls[i];
    const cellEls = wrapperEl.getElementsByTagName('mxCell');
    if (cellEls.length > 0) {
      const cellEl = cellEls[0]; // Wrapper wraps one mxCell
      const cellElId = cellEl.getAttribute('id');
      const wrapperId = wrapperEl.getAttribute('id');
      const inferredId = cellElId || wrapperId || '';

      if (inferredId) {
        wrapperById.set(inferredId, wrapperEl);
        cellById.set(inferredId, cellEl);
      }

      cells.push(parseCell(cellEl, wrapperEl, context));
      processedCells.add(cellEl);
    }
  }
  
  // Then, find all standalone mxCell elements (not wrapped in UserObject)
  const allCellEls = modelEl.getElementsByTagName('mxCell');
  
  for (let i = 0; i < allCellEls.length; i++) {
    const cellEl = allCellEls[i];
    if (!processedCells.has(cellEl)) {
      const cellId = cellEl.getAttribute('id');
      if (cellId && !cellById.has(cellId)) {
        cellById.set(cellId, cellEl);
      }
      cells.push(parseCell(cellEl, undefined, context));
    }
  }

  return { id, name, model, cells };
}

function parseRootPlaceholderDate(doc: Document): Date | undefined {
  const root = doc.documentElement;
  if (!root) return undefined;

  const modified = root.getAttribute('modified') || root.getAttribute('created');
  if (!modified) return undefined;

  const parsed = new Date(modified);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return parsed;
}

// Keep class for backward compatibility
/**
 * @deprecated Use `parse()` function instead
 */
export class DrawioParser {
  parse(xmlString: string): ParsedDrawio {
    return parse(xmlString);
  }
}
