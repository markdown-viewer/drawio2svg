import type { MxStyle } from '../../parser.ts';
import type { TextRenderContext } from './labels.ts';
import { measureText, DEFAULT_FONT_FAMILY } from '@markdown-viewer/text-measure';

interface EdgeChildLabelParams {
  value?: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  style: MxStyle;
}

export function renderEdgeChildLabel(
  ctx: TextRenderContext,
  params: EdgeChildLabelParams
): void {
  const { builder, currentGroup } = ctx;
  if (!builder || !currentGroup) {
    return;
  }

  const { value, x, y, style } = params;
  const useHtmlRendering = (style.html as string) === '1';

  if (!useHtmlRendering) {
    if (!value) {
      return;
    }

    // Type 1: Source/target labels - pure SVG text
    // Note: x, y from getAbsolutePosition already include geo.offset
    const fontSize = parseFloat(style.fontSize as string) || 12;
    const fontStyle = parseInt(style.fontStyle as string) || 0;
    const isBold = (fontStyle & 1) !== 0;
    const isItalic = (fontStyle & 2) !== 0;
    const isUnderline = (fontStyle & 4) !== 0;
    const align = (style.align as string) || 'left';
    const verticalAlign = (style.verticalAlign as string) || 'middle';

    // Text position calculation:
    // - x: already includes edge point + offset.x
    //   Use the platform-like adjustments: +2 for left, 0 for center, -1 for right
    // - y: edge point + offset.y, adjust for text baseline by vertical alignment
    let textX = x;
    if (align === 'right') {
      textX = x - 1;
    } else if (align === 'left') {
      textX = x + 2;
    }

    let textY = y - fontSize / 2 + 1.5;
    if (verticalAlign === 'top') {
      textY = y + fontSize + 6;
    } else if (verticalAlign === 'bottom') {
      textY = y - 4;
    }

    const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
    const fontColor = ctx.normalizeColor((style.fontColor as string) || '#000000');
    const labelBackgroundColor = ctx.normalizeColor((style.labelBackgroundColor as string) || 'none');

    // Create nested groups structure
    const outerG = builder.createGroup();
    const innerG = builder.createGroup();
    innerG.setAttribute('fill', fontColor);
    innerG.setAttribute('font-family', `"${fontFamily}"`);
    // Map DrawIO align to SVG text-anchor
    if (align === 'right') {
      innerG.setAttribute('text-anchor', 'end');
    } else if (align === 'center') {
      innerG.setAttribute('text-anchor', 'middle');
    }
    // No text-anchor for left (default is start)
    innerG.setAttribute('font-size', `${fontSize}px`);
    if (isBold) innerG.setAttribute('font-weight', 'bold');
    if (isItalic) innerG.setAttribute('font-style', 'italic');
    if (isUnderline) innerG.setAttribute('text-decoration', 'underline');

    // Optional background rect (edge child labels with labelBackgroundColor)
    if (labelBackgroundColor && labelBackgroundColor !== 'none') {
      const isHtml = style.html === '1' || style.html === true;
      const textMetrics = measureText(
        value,
        fontSize,
        fontFamily,
        isBold ? 'bold' : 'normal',
        isItalic ? 'italic' : 'normal',
        isHtml
      );
      const rectWidth = Math.round(textMetrics.width + 2);
      const rectHeight = Math.round(textMetrics.height + 1);
      const rectX = align === 'right'
        ? Math.round(textX + 2 - rectWidth)
        : Math.round(textX);
      const rectY = Math.round(textY - (fontSize - 1));
      const rectEl = builder.createRect(rectX, rectY, rectWidth, rectHeight);
      rectEl.setAttribute('fill', labelBackgroundColor);
      rectEl.setAttribute('stroke', 'none');
      rectEl.setAttribute('stroke-width', '0');
      innerG.appendChild(rectEl);
    }

    const textEl = builder.createText(textX, textY, ctx.escapeXml(value));
    innerG.appendChild(textEl);
    outerG.appendChild(innerG);
    currentGroup.appendChild(outerG);
    return;
  }

  // Type 2: Center labels - foreignObject with 1px x 1px layout
  // Use edge label layout: width=1px, height=1px with margin-left and padding-top for positioning
  // This is similar to edge labels but for edge child labels
  if (!value) {
    return;
  }

  const fontSize = parseFloat(style.fontSize as string) || 12;
  const fontStyle = parseInt(style.fontStyle as string) || 0;
  const isBold = (fontStyle & 1) !== 0;
  const isItalic = (fontStyle & 2) !== 0;
  const isUnderline = (fontStyle & 4) !== 0;
  const fontColor = ctx.normalizeColor((style.fontColor as string) || '#000000');
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const rawLabelBackgroundColor = (style.labelBackgroundColor as string) || '';
  const resolvedLabelBackgroundColor = rawLabelBackgroundColor === '' || rawLabelBackgroundColor === 'default'
    ? '#ffffff'
    : rawLabelBackgroundColor;
  const labelBackgroundColor = ctx.normalizeColor(resolvedLabelBackgroundColor);
  const whiteSpaceWrap = style.whiteSpace === 'wrap';
  const align = (style.align as string) || 'center';
  const verticalAlign = (style.verticalAlign as string) || 'middle';
  const isTextShape = style.text === true || style.text === '1' || style.shape === 'text';
  const spacingTop = parseFloat(style.spacingTop as string) || 0;
  const spacingBottom = parseFloat(style.spacingBottom as string) || 0;
  const spacingLeft = parseFloat(style.spacingLeft as string) || 0;
  const spacingRight = parseFloat(style.spacingRight as string) || 0;

  // Convert value to XHTML
  const content = ctx.convertToXhtml(value);

  // Map verticalAlign to CSS flex alignment
  let alignItems: string;
  switch (verticalAlign) {
    case 'top':
      alignItems = 'flex-start';
      break;
    case 'bottom':
      alignItems = 'flex-end';
      break;
    case 'middle':
    default:
      alignItems = 'center';
      break;
  }

  // Map horizontal align to CSS flex justification
  let justifyContent: string;
  switch (align) {
    case 'left':
      justifyContent = 'flex-start';
      break;
    case 'right':
      justifyContent = 'flex-end';
      break;
    case 'center':
    default:
      justifyContent = 'center';
      break;
  }

  // For edge child labels, use 1px x 1px layout with margin-left and padding-top
  // Note: x, y from getAbsolutePosition already include geo.offset
  let marginLeft = Math.round(x) + 1;
  if (align === 'left') {
    marginLeft += spacingLeft;
  } else if (align === 'right') {
    marginLeft -= spacingRight;
  }
  let paddingTop = Math.round(y) + 1;
  if (verticalAlign === 'top') {
    paddingTop = Math.round(y + 7 + spacingTop);
  } else if (verticalAlign === 'bottom') {
    paddingTop = Math.round(y - 3 - spacingBottom);
  } else if (isTextShape && spacingBottom > 0) {
    paddingTop = Math.round(y - fontSize) + 1;
  }

  // Handle rotation for edge child labels
  const rotation = parseFloat(style.rotation as string) || 0;
  const rotationCenterX = x + 1;
  const rotationCenterY = y + 1;
  const rotateStr = rotation !== 0 ? `rotate(${rotation} ${rotationCenterX} ${rotationCenterY})` : '';

  // Create nested groups structure
  const outerG = builder.createGroup();
  const innerG = builder.createGroup();
  if (rotateStr) {
    innerG.setAttribute('transform', rotateStr);
  }

  // Create foreignObject
  const fo = builder.doc.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  fo.setAttribute('style', 'overflow: visible; text-align: left;');
  fo.setAttribute('pointer-events', 'none');
  fo.setAttribute('width', '100%');
  fo.setAttribute('height', '100%');

  // Create outer div with flex layout (1px x 1px)
  const outerDiv = builder.doc.createElementNS('http://www.w3.org/1999/xhtml', 'div');
  outerDiv.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  outerDiv.setAttribute('style',
    `display: flex; align-items: unsafe ${alignItems}; justify-content: unsafe ${justifyContent}; ` +
    `width: 1px; height: 1px; padding-top: ${paddingTop}px; margin-left: ${marginLeft}px;`
  );

  // Create middle div for text alignment
  const middleDiv = builder.doc.createElementNS('http://www.w3.org/1999/xhtml', 'div');
  middleDiv.setAttribute('style', `box-sizing: border-box; font-size: 0px; text-align: ${align};`);
  const bgColorStyle = labelBackgroundColor !== 'none' ? `background-color: ${labelBackgroundColor}; ` : '';
  middleDiv.setAttribute('data-drawio-colors', `color: ${fontColor}; ${bgColorStyle}`);

  // Create inner div with text styles
  const innerDiv = builder.doc.createElementNS('http://www.w3.org/1999/xhtml', 'div');
  const textStyle = [
    'display: inline-block',
    `font-size: ${fontSize}px`,
    `font-family: "${fontFamily}"`,
    `color: ${fontColor}`,
    'line-height: 1.2',
    'pointer-events: all',
    bgColorStyle,
    `font-weight: ${isBold ? 'bold' : 'normal'}`,
    `font-style: ${isItalic ? 'italic' : 'normal'}`,
    `text-decoration: ${isUnderline ? 'underline' : 'none'}`,
    `white-space: ${whiteSpaceWrap ? 'normal' : 'nowrap'}`,
    ...(whiteSpaceWrap ? ['word-wrap: normal'] : [])
  ].join('; ') + ';';
  innerDiv.setAttribute('style', textStyle);
  ctx.setXhtmlContent(innerDiv, content);

  // Assemble DOM structure
  middleDiv.appendChild(innerDiv);
  outerDiv.appendChild(middleDiv);
  fo.appendChild(outerDiv);
  innerG.appendChild(fo);
  outerG.appendChild(innerG);
  currentGroup.appendChild(outerG);
}
