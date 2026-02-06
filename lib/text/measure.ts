/**
 * Text measurement utilities
 * 
 * In browser environment: Uses DOM for text measurement
 * In server environment: Requires a TextMeasureProvider to be set via setTextMeasureProvider()
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Text layout measurement result
 */
export interface TextLayoutResult {
  width: number;
  height: number;
  lineCount: number;
  lineHeight: number;
}

/**
 * Interface for custom text measurement provider
 * 
 * Implementations can use various backends:
 * - DOM (browser)
 * - Headless WebView (fibjs)
 * - Pre-calculated metrics (fallback)
 */
export interface TextMeasureProvider {
  /**
   * Measure text dimensions
   * @param text - Text to measure (can be single or multi-line)
   * @param fontSize - Font size in pixels
   * @param fontFamily - Font family name
   * @param fontWeight - Font weight ('normal' | 'bold')
   * @param fontStyle - Font style ('normal' | 'italic')
   * @returns Object with width and height in pixels
   */
  measureText(
    text: string,
    fontSize: number,
    fontFamily: string,
    fontWeight?: string,
    fontStyle?: string,
    isHtml?: boolean
  ): { width: number; height: number };

  /**
   * Measure text layout with line information
   * @param text - Text to measure
   * @param fontSize - Font size in pixels
   * @param fontFamily - Font family name
   * @param fontWeight - Font weight
   * @param fontStyle - Font style
   * @param containerWidth - Optional container width for wrapping calculation
   * @param isHtml - Whether text contains HTML
   * @returns Layout info with width, height, line count and line height
   */
  measureTextLayout?(
    text: string,
    fontSize: number,
    fontFamily: string,
    fontWeight?: string,
    fontStyle?: string,
    containerWidth?: number,
    isHtml?: boolean
  ): TextLayoutResult;
}

// ============================================================================
// Provider Configuration
// ============================================================================

/**
 * Global text measurement provider instance
 * When null, uses default DOM measurement
 */
let textMeasureProvider: TextMeasureProvider | null = null;

/**
 * Set global text measurement provider
 * @param provider - Custom provider or null to reset to default
 */
export function setTextMeasureProvider(provider: TextMeasureProvider | null): void {
  textMeasureProvider = provider;
}

/**
 * Get current text measurement provider
 * @returns Current provider or null if using default
 */
export function getTextMeasureProvider(): TextMeasureProvider | null {
  return textMeasureProvider;
}

/**
 * Reset to default text measurement (DOM)
 */
export function resetTextMeasureProvider(): void {
  textMeasureProvider = null;
}

// ============================================================================
// Internal Utilities
// ============================================================================

import { measureText as measureTextWithDom } from './webview-measure.ts';
import { DEFAULT_FONT_FAMILY } from './constants.ts';

// Detect if we're in a browser environment with DOM support
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// Reusable DOM element for measurement (browser only)
let measureDiv: HTMLDivElement | null = null;

/**
 * Initialize the measurement div (browser only)
 */
function initMeasureDiv(): HTMLDivElement | null {
  if (!isBrowser) return null;

  if (!measureDiv) {
    measureDiv = document.createElement('div');
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    document.body.appendChild(measureDiv);
  }
  return measureDiv;
}

/**
 * Measure text dimensions
 * 
 * @param text - Text to measure (can include HTML tags, which will be stripped)
 * @param fontSize - Font size in pixels
 * @param fontFamily - Font family name
 * @param fontWeight - Font weight ('normal', 'bold', '700', etc.)
 * @param fontStyle - Font style ('normal', 'italic')
 * @returns Object with width and height
 */
export function measureText(
  text: string,
  fontSize: number,
  fontFamily: string = DEFAULT_FONT_FAMILY,
  fontWeight: string = 'normal',
  fontStyle: string = 'normal',
  isHtml: boolean = false
): { width: number; height: number } {
  if (!text) {
    return { width: 0, height: fontSize };
  }
  
  let result: { width: number; height: number };
  
  // Use custom provider if set
  if (textMeasureProvider) {
    result = textMeasureProvider.measureText(text, fontSize, fontFamily, fontWeight, fontStyle, isHtml);
  } else {
    // Default implementation: use DOM-based measurement when available
    const div = initMeasureDiv();
    if (div) {
      result = measureTextWithDom(div, text, fontSize, fontFamily, fontWeight, fontStyle, isHtml);
    } else {
      throw new Error(
        'Text measurement failed: DOM is not available. ' +
        'Please set a TextMeasureProvider using setTextMeasureProvider() for server-side rendering.'
      );
    }
  }
  
  return result;
}

/**
 * Measure multi-line text dimensions
 * 
 * @param text - Text with potential line breaks (can include HTML)
 * @param fontSize - Font size in pixels
 * @param fontFamily - Font family name
 * @param fontWeight - Font weight
 * @param fontStyle - Font style
 * @param lineHeight - Line height multiplier (default 1.2)
 * @returns Object with total width (max line width) and height
 */
export function measureMultilineText(
  text: string,
  fontSize: number,
  fontFamily: string = DEFAULT_FONT_FAMILY,
  fontWeight: string = 'normal',
  fontStyle: string = 'normal',
  lineHeight: number = 1.2,
  isHtml: boolean = false
): { width: number; height: number } {
  void lineHeight;
  // Directly measure the text (provider handles HTML rendering)
  return measureText(text, fontSize, fontFamily, fontWeight, fontStyle, isHtml);
}

import { measureTextLayout as measureTextLayoutWithDom } from './webview-measure.ts';

/**
 * Measure text layout with line information
 * 
 * @param text - Text to measure (can include HTML)
 * @param fontSize - Font size in pixels
 * @param fontFamily - Font family name
 * @param fontWeight - Font weight
 * @param fontStyle - Font style
 * @param containerWidth - Optional container width for wrapping calculation
 * @param isHtml - Whether text contains HTML
 * @returns Layout info with width, height, line count and line height
 */
export function measureTextLayout(
  text: string,
  fontSize: number,
  fontFamily: string = DEFAULT_FONT_FAMILY,
  fontWeight: string = 'normal',
  fontStyle: string = 'normal',
  containerWidth?: number,
  isHtml: boolean = false
): TextLayoutResult {
  const normalizedText = isHtml
    ? text.replace(/(?:<br\s*\/?>|&#10;|&#x0*a;|\r|\n)+$/gi, '')
    : text.replace(/[\r\n]+$/g, '');
  const sourceText = normalizedText;
  if (!sourceText) {
    const defaultLineHeight = Math.round(fontSize * 1.2);
    return { width: 0, height: defaultLineHeight, lineCount: 1, lineHeight: defaultLineHeight };
  }

  let result: TextLayoutResult;

  // Use custom provider if set and supports measureTextLayout
  if (textMeasureProvider && textMeasureProvider.measureTextLayout) {
    result = textMeasureProvider.measureTextLayout(sourceText, fontSize, fontFamily, fontWeight, fontStyle, containerWidth, isHtml);
  } else {
    // Default implementation: use DOM-based measurement when available
    const div = initMeasureDiv();
    if (div) {
      result = measureTextLayoutWithDom(div, sourceText, fontSize, fontFamily, fontWeight, fontStyle, containerWidth, isHtml);
    } else {
      throw new Error(
        'Text layout measurement failed: DOM is not available. ' +
        'Please set a TextMeasureProvider using setTextMeasureProvider() for server-side rendering.'
      );
    }
  }

  return result;
}

/**
 * Check if browser measurement is available
 */
export function isBrowserMeasurementAvailable(): boolean {
  return isBrowser;
}
