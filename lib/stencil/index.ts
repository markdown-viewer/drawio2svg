/**
 * Stencil module
 * 
 * Provides stencil bundle management and XML-to-JSON conversion utilities.
 */

// Re-export with V2 suffix for backward compatibility during transition
export {
  type StencilShape,
  convertStencilXmlToShapes,
  parseInlineStencil
} from './xml.ts';

export {
  type StencilBundle,
  type StencilGroupSource,
  createStencilBundle,
  createStencilBundleFromCompressedGroups
} from './bundle.ts';
