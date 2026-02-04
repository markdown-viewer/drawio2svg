import type { MxStyle } from '../../parser.ts';
import { measureMultilineText, measureTextLayout } from '../../text/index.ts';
import { DEFAULT_FONT_FAMILY } from '../../text/index.ts';

export interface TextBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function measureTextBoundsAtPosition(
  value: string,
  style: MxStyle,
  x: number,
  y: number,
  defaultFontSize: number,
  containerWidth?: number
): TextBounds {
  const fontSize = parseFloat(style.fontSize as string) || defaultFontSize;
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const fontStyleRaw = parseInt(style.fontStyle as string) || 0;
  const fontWeight = (fontStyleRaw & 1) !== 0 || style.fontStyle === 'bold' ? 'bold' : 'normal';
  const fontStyle = (fontStyleRaw & 2) !== 0 ? 'italic' : 'normal';

  const isHtml = style.html === '1' || style.html === true;
  const textValue = isHtml
    ? value
        .replace(/&nbsp;/g, '\u00A0')
        .replace(/&#10;|&#x0?A;/gi, '\n')
        .replace(/&#13;|&#x0?D;/gi, '\r')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
    : value;

  // Use measureTextLayout when wrap is enabled and container width is provided
  const whiteSpaceWrap = style.whiteSpace === 'wrap';
  let textWidth: number;
  let textHeight: number;
  
  if (whiteSpaceWrap && containerWidth !== undefined && containerWidth > 0) {
    const layout = measureTextLayout(textValue, fontSize, fontFamily, fontWeight, fontStyle, containerWidth, isHtml);
    textWidth = layout.width;
    textHeight = layout.height;
  } else {
    const result = measureMultilineText(textValue, fontSize, fontFamily, fontWeight, fontStyle, 1.2, isHtml);
    textWidth = result.width;
    textHeight = result.height;
  }
  
  const halfWidth = textWidth / 2;
  const halfHeight = textHeight / 2;

  return {
    minX: x - halfWidth,
    maxX: x + halfWidth,
    minY: y - halfHeight,
    maxY: y + halfHeight
  };
}
