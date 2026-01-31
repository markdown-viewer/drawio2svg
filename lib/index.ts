/**
 * Diagram to SVG Converter
 * 
 * Main entry point for the library
 */

export { parse, DrawioParser, type ParsedDrawio, type MxCell, type MxGeometry } from './parser.ts';
export { SvgRenderer, type RenderOptions } from './renderer.ts';
export { convert } from './convert.ts';
export { createStencilBundle, createStencilBundleFromCompressedGroups, type StencilBundle, type StencilGroupSource } from './stencil/index.ts';
export { decompress } from './decompress.ts';
export {
  type TextMeasureProvider,
  setTextMeasureProvider,
  getTextMeasureProvider,
  resetTextMeasureProvider
} from './text/index.ts';
