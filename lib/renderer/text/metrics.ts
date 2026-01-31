import type { MxStyle } from '../../parser.ts';
import { measureMultilineText, measureTextLayout, type TextLayoutResult } from '../../text/index.ts';
import { DEFAULT_FONT_FAMILY } from '../../text/index.ts';

export interface TextSize {
  width: number;
  height: number;
}

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
