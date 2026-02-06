import type { MxStyle } from '../../parser.ts';
import { measureMultilineText, measureTextLayout, type TextLayoutResult } from '../../text/index.ts';
import { DEFAULT_FONT_FAMILY } from '../../text/index.ts';

export interface TextSize {
  width: number;
  height: number;
}

/**
 * Unified text layout info returned by getTextLayoutInfo().
 * Wraps TextLayoutResult for future extensibility (e.g. firstLineBaseline).
 */
export type TextLayoutInfo = TextLayoutResult;

export function measureMultilineTextSize(
  value: string,
  style: MxStyle,
  defaultFontSize: number
): TextSize {
  const fontSize = parseFloat(style.fontSize as string) || defaultFontSize;
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const fontStyleNum = parseInt(style.fontStyle as string) || 0;
  const fontWeight = (fontStyleNum & 1) !== 0 ? 'bold' : 'normal';
  const fontStyle = (fontStyleNum & 2) !== 0 ? 'italic' : 'normal';

  const isHtml = style.html === '1' || style.html === true;

  // Let the provider handle text decoding and HTML rendering
  return measureMultilineText(value, fontSize, fontFamily, fontWeight, fontStyle, 1.2, isHtml);
}

export function measureMultilineTextLayout(
  value: string,
  style: MxStyle,
  defaultFontSize: number,
  containerWidth?: number
): TextLayoutResult {
  const fontSize = parseFloat(style.fontSize as string) || defaultFontSize;
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const fontStyleNum = parseInt(style.fontStyle as string) || 0;
  const fontWeight = (fontStyleNum & 1) !== 0 ? 'bold' : 'normal';
  const fontStyle = (fontStyleNum & 2) !== 0 ? 'italic' : 'normal';

  const isHtml = style.html === '1' || style.html === true;

  return measureTextLayout(value, fontSize, fontFamily, fontWeight, fontStyle, containerWidth, isHtml);
}

/**
 * Unified entry point for text layout measurement via WebView.
 * Extracts font parameters from MxStyle and delegates to measureTextLayout.
 * 
 * Use this instead of ad-hoc HTML regex inference for lineCount, textWidth, textHeight.
 * 
 * @param value - Raw text/HTML content
 * @param style - MxCell style object
 * @param containerWidth - Optional container width for wrap calculation
 * @param defaultFontSize - Default font size if not specified in style (default: 12)
 */
export function getTextLayoutInfo(
  value: string,
  style: MxStyle,
  containerWidth?: number,
  defaultFontSize: number = 12
): TextLayoutInfo {
  return measureMultilineTextLayout(value, style, defaultFontSize, containerWidth);
}
