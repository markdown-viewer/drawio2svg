/**
 * Stencil module
 * 
 * Provides stencil bundle management and XML-to-SVG conversion utilities.
 */

export {
  type StencilBundle,
  type StencilGroupSource,
  type StencilColorStyle,
  applyStencilColors,
  createStencilBundle,
  createStencilBundleFromCompressedGroups
} from './bundle.ts';

export {
  type StencilShapeSvg,
  type StencilConversionStats,
  convertStencilXmlToSvgs,
  getConversionStats as getStencilConversionStats,
  printConversionStats as printStencilConversionStats
} from './xml.ts';
