/**
 * Main conversion function
 * 
 * Converts diagram XML to SVG in one call.
 */

import { DrawioParser } from './parser.ts';
import { SvgRenderer, type RenderOptions } from './renderer.ts';

/**
 * Convert a diagram XML string to SVG
 * 
 * @param drawioXml - The diagram XML content
 * @param options - Rendering options
 * @returns SVG string
 */
export function convert(drawioXml: string, options: RenderOptions = {}): string {
  const parser = new DrawioParser();
  const parsed = parser.parse(drawioXml);
  
  const renderer = new SvgRenderer(options);
  return renderer.render(parsed);
}
