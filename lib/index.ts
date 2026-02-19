/**
 * Diagram to SVG Converter
 * 
 * Main entry point for the library
 */

export { parse, DrawioParser, type ParsedDrawio, type MxCell, type MxGeometry } from './parser.ts';
export { SvgRenderer, type RenderOptions } from './renderer.ts';
export { convert } from './convert.ts';
export { 
  createStencilBundle, 
  createStencilBundleFromCompressedGroups, 
  convertStencilXmlToShapes,
  parseInlineStencil,
  type StencilBundle, 
  type StencilGroupSource,
  type StencilShape,
  type DrawOp,
  type PathCmd
} from './stencil/index.ts';
export { decompress } from './decompress.ts';
export { SvgBuilder, SvgAttrs } from './svg/index.ts';
export { lineIntersection } from './edge-router/utils.ts';
export { finalizeAbsolutePoints } from './renderer/edge/points.ts';
export { normalizeImageUrl } from './renderer/image-url.ts';
export {
  type TextMeasureProvider,
  setTextMeasureProvider,
  getTextMeasureProvider,
  resetTextMeasureProvider
} from '@markdown-viewer/text-measure';
