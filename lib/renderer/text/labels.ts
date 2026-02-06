import type { MxStyle } from '../../parser.ts';
import type { SvgBuilder } from '../../svg/index.ts';
import type { LabelOverrides } from '../shape-registry.ts';
import { measureText, measureMultilineText, measureTextLayout } from '../../text/index.ts';
import { DEFAULT_FONT_FAMILY } from '../../text/index.ts';
import { getLabelBounds } from './label-bounds.ts';

export interface ClipPathRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Type for getting label overrides from handler
export type GetLabelOverridesFn = (shape: string | undefined) => LabelOverrides | null;

export interface TextRenderContext {
  builder: SvgBuilder | null;
  currentGroup: Element | null;
  clipPaths: Map<string, ClipPathRect>;
  normalizeColor: (color: string) => string;
  escapeXml: (value: string) => string;
  convertToXhtml: (value: string) => string;
  setXhtmlContent: (element: Element, xhtmlContent: string) => void;
  // Optional: get label overrides from shape handler
  getLabelOverrides?: GetLabelOverridesFn;
}

/**
 * Determine if a cell should use HTML labels (foreignObject) or native SVG text
 * Follows the platform logic: only use HTML when html='1' or whiteSpace='wrap'
 */
export function isHtmlLabel(style: MxStyle): boolean {
  return style.html === '1' || style.whiteSpace === 'wrap';
}

/**
 * Render native SVG text element with proper positioning and clipping
 * Used when isHtmlLabel() returns false
 */
export function renderNativeTextLabel(
  ctx: TextRenderContext,
  value: string,
  x: number, y: number, width: number, height: number,
  style: MxStyle
): void {
  if (!value || !ctx.builder || !ctx.currentGroup) {
    return;
  }

  const builder = ctx.builder;

  const fontSize = parseFloat(style.fontSize as string) || 12;
  const fontColor = ctx.normalizeColor((style.fontColor as string) || '#000000');
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const hasFontStyle = style.fontStyle !== undefined;
  const fontStyle = parseInt(style.fontStyle as string) || 0;
  const shape = (style.shape as string) || '';

  const isLabelShape = style.label === true || style.label === '1';
  const spacingTop = parseFloat(style.spacingTop as string) || 0;
  const spacingBottom = parseFloat(style.spacingBottom as string) || 0;
  const hasSpacingOverrides =
    style.spacing !== undefined ||
    style.spacingTop !== undefined ||
    style.spacingBottom !== undefined;
  const baseSpacing = style.spacing !== undefined
    ? (parseFloat(style.spacing as string) || 0)
    : 2;
  const effectiveSpacingTop = baseSpacing + (Number.isFinite(spacingTop) ? spacingTop : 0);
  const effectiveSpacingBottom = baseSpacing + (Number.isFinite(spacingBottom) ? spacingBottom : 0);

  // Font style flags: 1=bold, 2=italic, 4=underline
  const isBold = (fontStyle & 1) !== 0 || (!hasFontStyle && isLabelShape);
  const isItalic = (fontStyle & 2) !== 0;
  const isUnderline = (fontStyle & 4) !== 0;

  // Text alignment
  const isTextShape = style.text === true || style.text === '1' || style.shape === 'text';
  const hasInlineImage = Boolean(style.image);
  const align = (style.align as string) || (isTextShape || (isLabelShape && hasInlineImage) ? 'left' : 'center');
  const verticalAlign = (style.verticalAlign as string) || (isTextShape ? 'top' : 'middle');
  const labelPosition = style.labelPosition as string | undefined;
  const verticalLabelPosition = style.verticalLabelPosition as string | undefined;
  const isHorizontalLabel = style.horizontal !== 0 && style.horizontal !== '0' && style.horizontal !== false;
  // Skip rotation when label is at external positions (left/right/top/bottom)
  // External labels should remain horizontal regardless of shape rotation
  const skipHorizontalRotation = labelPosition === 'left' || labelPosition === 'right'
    || verticalLabelPosition === 'top' || verticalLabelPosition === 'bottom';
  const labelOverrides = ctx.getLabelOverrides?.(shape);

  // Apply getLabelBounds if available (adjust bounds for markers, etc.)
  const boundedLbl = style.boundedLbl === '1' || style.boundedLbl === true;
  const isCenteredLabel = (!labelPosition || labelPosition === 'center')
    && (!verticalLabelPosition || verticalLabelPosition === 'middle');
  
  let labelX = x;
  let labelY = y;
  let labelW = width;
  let labelH = height;
  
  if (labelOverrides?.getLabelBounds && isCenteredLabel && (boundedLbl || labelOverrides.alwaysUseLabelBounds)) {
    const bounds = labelOverrides.getLabelBounds(style, x, y, width, height);
    labelX = bounds.x;
    labelY = bounds.y;
    labelW = bounds.width;
    labelH = bounds.height;
  }

  // Calculate text position based on alignment
  let textX: number;
  let textAnchor: string;

  switch (align) {
    case 'left':
      // Universal spacingLeft handling per the platform's getSpacing() logic
      if (style.spacingLeft) {
        const spacingLeft = parseFloat(style.spacingLeft as string) || 0;
        textX = labelX + spacingLeft + 1.5; // Match the platform positioning
      } else if (style.shape === 'note') {
        textX = labelX + 2;
      } else if (isTextShape) {
        textX = labelX + 2;
      } else {
        textX = labelX + 4; // Small padding from left edge for regular shapes
      }
      textAnchor = 'start';
      break;
    case 'right':
      if (style.spacingRight) {
        const spacingRight = parseFloat(style.spacingRight as string) || 0;
        textX = x + width - spacingRight - 2;
      } else {
        textX = x + width - (isTextShape ? 2 : 4); // Small padding from right edge
      }
      textAnchor = 'end';
      break;
    case 'center':
    default:
      textX = x + width / 2;
      if (style.spacingLeft) {
        const spacingLeft = parseFloat(style.spacingLeft as string) || 0;
        if (spacingLeft !== 0) {
          textX += spacingLeft / 2;
        }
      }
      textAnchor = 'middle';
      break;
  }

  // External label positioning (native text)
  if (labelPosition === 'left') {
    textX = x - 2;
    textAnchor = 'end';
  } else if (labelPosition === 'right') {
    textX = x + width + 2;
    textAnchor = 'start';
  } else if (verticalLabelPosition === 'top' || verticalLabelPosition === 'bottom') {
    if (align === 'left') {
      textX = x;
      textAnchor = 'start';
    } else if (align === 'right') {
      textX = x + width;
      textAnchor = 'end';
    } else {
      textX = x + width / 2;
      textAnchor = 'middle';
    }
  }

  // Use fixed line height formula matching drawio's LINE_HEIGHT constant (1.2)
  // instead of measured lineHeight for consistent positioning
  const measuredLineHeight = Math.round(fontSize * 1.2);

  // Split text into lines for SVG text element rendering (SVG text doesn't support auto line breaks)
  const rawValue = value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&#x0*a;|&#10;/gi, '\n');
  const lines = rawValue.split(/\r\n|\r|\n/);
  // Count trailing empty lines for vertical centering when label bounds
  // are not reduced by markers. When markers reduce labelH, trailing
  // empty lines should not be counted as they overlap with marker space.
  const hasLabelReduction = labelH < height - 1;
  const lineCount = hasLabelReduction ? (() => {
    const trimmed = [...lines];
    while (trimmed.length > 1 && trimmed[trimmed.length - 1] === '') {
      trimmed.pop();
    }
    return trimmed.length;
  })() : lines.length;

  // Create text group with styling
  const textGroup = builder.createGroup();
  textGroup.setAttribute('fill', fontColor);
  textGroup.setAttribute('font-family', `"${fontFamily}"`);
  textGroup.setAttribute('font-size', `${fontSize}px`);

  if (isBold) textGroup.setAttribute('font-weight', 'bold');
  if (isItalic) textGroup.setAttribute('font-style', 'italic');
  if (isUnderline) textGroup.setAttribute('text-decoration', 'underline');

  // Handle text overflow with clipPath if needed
  if (style.overflow === 'hidden') {
    let clipX, clipY, clipWidth, clipHeight;

    // Universal spacingLeft handling for clip bounds (per the platform spacing logic)
    if (style.spacingLeft) {
      const spacingLeft = parseFloat(style.spacingLeft as string) || 0;
      clipX = x + spacingLeft;
      clipY = y;
      clipWidth = width - spacingLeft;
      clipHeight = height;
    } else {
      // Default clipping for other shapes
      clipX = x + 4;
      clipY = y + 5;
      clipWidth = width - 4;
      clipHeight = height;
    }

    const clipId = `mx-clip-${clipX}-${clipY}-${clipWidth}-${clipHeight}-0`;

    // Register clipPath for defs
    ctx.clipPaths.set(clipId, { x: clipX, y: clipY, width: clipWidth, height: clipHeight });
    textGroup.setAttribute('clip-path', `url(#${clipId})`);
  }

  textGroup.setAttribute('text-anchor', textAnchor);

  const rawLabelBackgroundColor = (style.labelBackgroundColor as string) || '';
  const isDefaultLabelBackground = rawLabelBackgroundColor === 'default';
  const hasExplicitLabelBackground = rawLabelBackgroundColor !== '' && rawLabelBackgroundColor !== 'none' && !isDefaultLabelBackground;
  const isImageShape = style.shape === 'image';
  const useDefaultImageBackground = (!hasExplicitLabelBackground || isDefaultLabelBackground) && isImageShape;
  const hasLabelBackground = hasExplicitLabelBackground || useDefaultImageBackground;
  const labelBackgroundColor = hasExplicitLabelBackground
    ? ctx.normalizeColor(rawLabelBackgroundColor)
    : (useDefaultImageBackground ? '#ffffff' : '');

  // Handle rotation for native text labels
  let rotation = parseFloat(style.rotation as string) || 0;
  if (skipHorizontalRotation) {
    rotation = 0;
  }
  if (!isHorizontalLabel && rotation === 0 && !skipHorizontalRotation) {
    rotation -= 90;
  }

  if (lineCount > 1) {
    const lineHeight = measuredLineHeight;
    const totalHeight = lineCount * measuredLineHeight;
    let startY: number;

    if (verticalLabelPosition === 'top') {
      startY = labelY - 6 - (lineCount - 1) * lineHeight;
    } else if (verticalLabelPosition === 'bottom') {
      startY = labelY + labelH + fontSize + 6;
    } else {
      switch (verticalAlign) {
        case 'top': {
          const topOffset = 6;
          startY = labelY + fontSize + topOffset + spacingTop;
          break;
        }
        case 'bottom':
          startY = labelY + labelH - (lineCount - 1) * lineHeight - 4;
          break;
        case 'middle':
        default: {
          startY = labelY + (labelH - totalHeight) / 2 + fontSize;
          if (isTextShape && spacingTop !== 0) {
            const extraSpace = labelH - totalHeight;
            if (extraSpace <= fontSize * 1.5) {
              startY += spacingTop / 2;
            }
          }
          break;
        }
      }
    }

    const overridePaddingTop = labelOverrides?.getPaddingTop?.({
      valign: verticalAlign,
      labelPosition,
      fontSize,
      labelY: labelY,
      labelH: labelH
    });
    if (overridePaddingTop !== undefined) {
      startY = overridePaddingTop;
    }

    lines.forEach((line, index) => {
      const textY = startY + index * lineHeight;
      if (hasLabelBackground && index === 0) {
        const isHtml = style.html === '1' || style.html === true;
        const { width: textWidth, height: textHeight } = measureMultilineText(
          rawValue,
          fontSize,
          fontFamily,
          isBold ? 'bold' : 'normal',
          isItalic ? 'italic' : 'normal',
          1.2,
          isHtml
        );
        const rectW = Math.round(textWidth + 2);
        const rectH = Math.round(textHeight + 1);
        let rectX = textX;
        if (textAnchor === 'middle') rectX = Math.round(textX - rectW / 2);
        else if (textAnchor === 'end') rectX = Math.round(textX - rectW);
        else rectX = Math.round(textX);
        const rectY = Math.floor(textY - fontSize + 2.5);
        const rectEl = builder.createRect(rectX, rectY, rectW, rectH);
        rectEl.setAttribute('fill', labelBackgroundColor);
        rectEl.setAttribute('stroke', 'none');
        textGroup.appendChild(rectEl);
      }
      const textEl = builder.createText(textX, textY, ctx.escapeXml(line));
      textGroup.appendChild(textEl);
    });
  } else {
    let textY: number;
    if (verticalLabelPosition === 'top') {
      textY = y - 6;
    } else if (verticalLabelPosition === 'bottom') {
      textY = y + height + fontSize + 6;
    } else {
      switch (verticalAlign) {
        case 'top': {
          const topOffset = 6;
          textY = y + fontSize + topOffset + spacingTop;
          break;
        }
        case 'bottom':
          textY = y + height - 4; // Small padding from bottom
          break;
        case 'middle':
        default:
          // Vertical centering formula: textY = y + height/2 + fontSize/2 - 1
          // Combined with labelBounds: bounds.y = state.y + height/2 (margin.y = -0.5)
          if (style.shape === 'partialRectangle') {
            // Special adjustment for partialRectangle to match the platform
            textY = y + height / 2 + fontSize / 3 + 0.5;
          } else if (isTextShape) {
            // Match the platform text baseline for centered text shapes
            textY = y + height / 2 + fontSize / 2 - 1 + spacingTop / 2;
          } else if (hasSpacingOverrides) {
            // Match the platform spacing behavior when spacing styles are present
            textY = y + height / 2 + fontSize / 2 - 1 + (effectiveSpacingTop - effectiveSpacingBottom) / 2;
          } else {
            // Standard the platform middle alignment formula
            textY = y + height / 2 + fontSize / 2 - 1;
            if (spacingTop !== 0) {
              textY += spacingTop / 2;
            }
          }
          break;
      }
    }


    if (rotation !== 0 && isTextShape) {
      const centerY = y + height / 2;
      let centerX = x + width / 2;
      if (verticalAlign === 'middle') {
        textX = centerX + spacingTop / 2;
        textY = centerY + fontSize / 2 - 1;
      } else if (verticalAlign === 'top') {
        textX = centerX + spacingTop / 2 - (fontSize / 2 - 0.5);
        textY = centerY + fontSize - 1;
      } else if (verticalAlign === 'bottom') {
        textX = centerX + spacingTop / 2 + (fontSize / 2 - 0.5);
        textY = centerY + 1;
      }
      centerX = textX;
      textGroup.setAttribute('transform', `rotate(${rotation},${centerX},${centerY})`);
    } else if (rotation !== 0) {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      textGroup.setAttribute('transform', `rotate(${rotation},${centerX},${centerY})`);
    }

    if (hasLabelBackground) {
      const isHtml = style.html === '1' || style.html === true;
      const { width: textWidth, height: textHeight } = measureText(
        lines[0],
        fontSize,
        fontFamily,
        isBold ? 'bold' : 'normal',
        isItalic ? 'italic' : 'normal',
        isHtml
      );
      const rectW = Math.round(textWidth + 2);
      const rectH = Math.round(textHeight + 1);
      let rectX = textX;
      if (textAnchor === 'middle') rectX = Math.round(textX - rectW / 2);
      else if (textAnchor === 'end') rectX = Math.round(textX - rectW);
      else rectX = Math.round(textX);
      const rectY = Math.floor(textY - fontSize + 2.5);
      const rectEl = builder.createRect(rectX, rectY, rectW, rectH);
      rectEl.setAttribute('fill', labelBackgroundColor);
      rectEl.setAttribute('stroke', 'none');
      textGroup.appendChild(rectEl);
    }

    // Create text element
    const textEl = builder.createText(textX, textY, ctx.escapeXml(lines[0]));
    textGroup.appendChild(textEl);
  }
  ctx.currentGroup.appendChild(textGroup);
}

/**
 * Render HTML label using foreignObject - original implementation
 */
export function renderHtmlLabel(
  ctx: TextRenderContext,
  value: string,
  x: number, y: number, width: number, height: number,
  style: MxStyle
): void {
  const isTextShape = style.text === true || style.text === '1' || style.shape === 'text';
  const isHtml = (style.html as string) === '1';

  // Special handling for overflow=hidden: use native SVG text with clip-path
  // This is used in ERD tables (partialRectangle) and UML diagrams
  const isPartialRectangle = style.shape === 'partialRectangle';
  if (style.overflow === 'hidden' && !isHtml && isPartialRectangle) {
    renderLabelWithClipPath(ctx, value, x, y, width, height, style);
    return;
  }

  const fontSize = parseFloat(style.fontSize as string) || 12;
  const fontColor = ctx.normalizeColor((style.fontColor as string) || '#000000');
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const hasFontStyle = style.fontStyle !== undefined;
  const fontStyle = parseInt(style.fontStyle as string) || 0;
  const isLabelShape = style.label === true || style.label === '1';

  // Font style flags: 1=bold, 2=italic, 4=underline
  const isBold = (fontStyle & 1) !== 0 || (!hasFontStyle && isLabelShape);
  const isItalic = (fontStyle & 2) !== 0;
  const isUnderline = (fontStyle & 4) !== 0;

  // Text alignment
  const hasInlineImage = Boolean(style.image);
  const align = (style.align as string) || (isTextShape || (isLabelShape && hasInlineImage) ? 'left' : 'center');
  const valign = (style.verticalAlign as string) || (isTextShape ? 'top' : 'middle');

  // Build style strings
  const fontWeight = isBold ? 'bold' : 'normal';
  const fontStyleCss = isItalic ? 'italic' : 'normal';
  const textDecoration = isUnderline ? 'underline' : 'none';

  // Justify content (horizontal)
  let justifyContent = 'center';
  if (align === 'left') justifyContent = 'flex-start';
  else if (align === 'right') justifyContent = 'flex-end';

  // Align items (vertical) - the platform uses 'unsafe center' etc.
  let alignItems = 'center';
  if (valign === 'top') alignItems = 'flex-start';
  else if (valign === 'bottom') alignItems = 'flex-end';

  // Spacing/padding from style
  const spacing = parseFloat(style.spacing as string) || 0;
  const spacingTop = parseFloat(style.spacingTop as string) || 0;
  const spacingBottom = parseFloat(style.spacingBottom as string) || 0;
  // For label shape with image on left, the x coordinate is already adjusted by vertex-label.ts
  // to account for image space. In this case, spacingLeft should not be applied again.
  const imageAlign = (style.imageAlign as string) || 'left';
  const isLabelShapeWithLeftImage = (style.shape === 'label' || style.label === true || style.label === '1')
    && style.image && imageAlign === 'left';
  const spacingLeft = isLabelShapeWithLeftImage ? 0 : (parseFloat(style.spacingLeft as string) || 0);
  const spacingRight = parseFloat(style.spacingRight as string) || 0;

  const isLineShape = style.line === true || style.line === '1' || style.shape === 'line';
  const isEdgeLabel = style.edgeLabel === true || style.edgeLabel === '1';
  const textDirection = style.textDirection as string | undefined;
  const isVerticalTextDirection = !!textDirection && textDirection.startsWith('vertical-');
  // Handle external label positions
  const labelPosition = style.labelPosition as string;
  const verticalLabelPosition = style.verticalLabelPosition as string;

  const rawLabelBackgroundColor = (style.labelBackgroundColor as string) || '';
  const isDefaultLabelBackground = rawLabelBackgroundColor === 'default';
  const hasExplicitLabelBackground = rawLabelBackgroundColor !== ''
    && rawLabelBackgroundColor !== 'none'
    && !isDefaultLabelBackground;
  const isImageShape = style.shape === 'image';
  const useDefaultImageBackground = (!hasExplicitLabelBackground || isDefaultLabelBackground) && isImageShape;
  const useDefaultLineLabelBackground = !hasExplicitLabelBackground && isLineShape && (labelPosition === 'left' || labelPosition === 'right');
  const useDefaultLabelBackground = isDefaultLabelBackground;
  const hasLabelBackground = hasExplicitLabelBackground
    || useDefaultImageBackground
    || useDefaultLineLabelBackground
    || useDefaultLabelBackground;
  const labelBackgroundColor = hasExplicitLabelBackground
    ? ctx.normalizeColor(rawLabelBackgroundColor)
    : ((useDefaultImageBackground || useDefaultLineLabelBackground || useDefaultLabelBackground) ? '#ffffff' : '');
  const dataDrawioBackground = hasLabelBackground
    ? (hasExplicitLabelBackground ? rawLabelBackgroundColor : '#ffffff')
    : '';

  // Adjust label bounds for special shapes with boundedLbl
  // These shapes have internal areas that constrain where text can appear
  let labelY = y;
  let labelH = height;
  let labelX = x;
  let labelW = width;

  const shape = (style.shape as string) || '';
  const boundedLbl = style.boundedLbl === '1' || style.boundedLbl === true;

  // Query handler for label overrides
  const labelOverrides = ctx.getLabelOverrides?.(shape);

  // the platform only calls shape.getLabelBounds when labelPosition=center and verticalLabelPosition=middle
  // See mxCellRenderer.getLabelBounds lines 1186-1192
  const isCenteredLabel = (!labelPosition || labelPosition === 'center')
    && (!verticalLabelPosition || verticalLabelPosition === 'middle');

  if (labelOverrides) {
    // Apply getLabelBounds only for centered labels (matching the platform behavior)
    if (labelOverrides.getLabelBounds && isCenteredLabel && (boundedLbl || labelOverrides.alwaysUseLabelBounds)) {
      const bounds = labelOverrides.getLabelBounds(style, x, y, width, height);
      labelX = bounds.x;
      labelY = bounds.y;
      labelW = bounds.width;
      labelH = bounds.height;
    }
    // Apply inset-based overrides (doubleEllipse, process, cylinder, datastore)
    else if (labelOverrides.getInset) {
      // Check if this shape requires boundedLbl flag
      const shouldApplyInset = labelOverrides.alwaysUseLabelBounds || 
        (labelOverrides.requiresBoundedLbl ? boundedLbl : true);
      
      if (shouldApplyInset) {
        const inset = labelOverrides.getInset(style, width, height);
        if (inset.left) labelX = x + inset.left;
        if (inset.top) labelY = y + inset.top;
        if (inset.left || inset.right) labelW = width - (inset.left || 0) - (inset.right || 0);
        if (inset.top || inset.bottom) labelH = height - (inset.top || 0) - (inset.bottom || 0);
      }
    } else if (labelOverrides.inset) {
      const inset = labelOverrides.inset;
      if (inset.left) labelX = x + inset.left;
      if (inset.right) labelW = Math.max(0, width - (inset.left || 0) - (inset.right || 0));
    }
  }

  // Check if text wrapping is enabled
  const whiteSpaceWrap = style.whiteSpace === 'wrap';
  const isOverflowFill = style.overflow === 'fill';

  // Convert value to XHTML early for layout decisions
  const content = ctx.convertToXhtml(value);
  const lineBreakMatches = content.match(/<br\s*\/?>/gi);
  const htmlLineCount = (lineBreakMatches ? lineBreakMatches.length : 0) + 1;
  const isTableHtml = /<table/i.test(content) || isOverflowFill;

  // This is the key insight: padding-top determines vertical position
  let marginLeft = labelX + 1;
  let labelWidth = labelW - 2;
  let labelHeight = 1;  // Always 1px - the platform pattern
  let paddingTop = 0;

  // Calculate padding-top based on vertical alignment
  // These formulas are derived from the platform generated SVG analysis:
  // - top:    y + spacing + spacingTop + fontSize/2 + 1
  // - middle: y + height/2 + (spacingTop - spacingBottom)/2
  // - bottom: y + height - spacing - spacingBottom - 3
  if (valign === 'top') {
    if (style.overflow === 'fill') {
      paddingTop = Math.round(labelY + spacingTop);
    } else if (!whiteSpaceWrap && style.overflow !== 'hidden') {
      if (spacing > 0) {
        paddingTop = Math.round(labelY + spacing + spacingTop + fontSize / 2 - 2);
      } else {
        paddingTop = Math.round(labelY + spacingTop + 7);
      }
    } else if (whiteSpaceWrap) {
      const baseOffset = isTextShape && style.overflow === 'hidden' && spacing > 0 ? 5 : 7;
      paddingTop = Math.round(labelY + spacing + spacingTop + baseOffset);
    } else {
      paddingTop = Math.round(labelY + spacing + spacingTop + fontSize / 2 - 2);
    }
  } else if (valign === 'middle') {
    paddingTop = Math.round(labelY + labelH / 2 + (spacingTop - spacingBottom) / 2);
  } else if (valign === 'bottom') {
    paddingTop = Math.round(labelY + labelH - spacing - spacingBottom - 3);
  } else {
    // Default to middle
    paddingTop = Math.round(labelY + labelH / 2);
  }

  // Handle line shape with vertical direction (north/south) and verticalAlign=top
  // For vertical lines, verticalAlign=top means the label appears below the line
  // This is because the line is rendered at the center, but vertically oriented
  const direction = style.direction as string;
  const isVerticalLine = isLineShape && (direction === 'north' || direction === 'south');
  if (isVerticalLine && valign === 'top') {
    // For vertical line with verticalAlign=top, position label below the line
    // The label should start at y + height + offset
    paddingTop = Math.round(labelY + labelH);
  }

  // Apply handler-provided paddingTop override
  if (labelOverrides?.getPaddingTop) {
    const overridePaddingTop = labelOverrides.getPaddingTop({
      valign,
      labelPosition,
      fontSize,
      labelY,
      labelH
    });
    if (overridePaddingTop !== undefined) {
      paddingTop = overridePaddingTop;
    }
  }

  // Note: arrows2.arrow with external label position and horizontal=0 is now handled
  // by getLabelBounds which implements the platform's isPaintBoundsInverted logic

  // Calculate label width and margin-left
  // Platform formulas differ based on whether spacing > 0:
  // - spacing=0: width = shapeWidth - 2 - spacingLeft, marginLeft = x + 1 + alignOffset + spacingLeft
  // - spacing>0: width = shapeWidth - 2*spacing + 2 - spacingLeft, marginLeft = x + spacing - 1 + alignOffset + spacingLeft
  // where alignOffset: left=+1, center=0, right=-1
  let alignOffset = 0;
  if (align === 'left') alignOffset = 1;
  else if (align === 'right') alignOffset = -1;

  if (spacing > 0) {
    // With spacing: special formula
    marginLeft = labelX + spacing - 1 + alignOffset + spacingLeft;
    labelWidth = labelW - 2 * spacing + 2 - spacingLeft - spacingRight;
  } else {
    // Without spacing: simple formula
    marginLeft = labelX + 1 + alignOffset + spacingLeft;
    labelWidth = labelW - 2 - spacingLeft - spacingRight;
  }

  const isHorizontalLabel = style.horizontal !== 0 && style.horizontal !== '0' && style.horizontal !== false;
  // Skip rotation when label is at external positions (left/right/top/bottom)
  // External labels should remain horizontal regardless of shape rotation
  const skipHorizontalRotation = labelPosition === 'left' || labelPosition === 'right'
    || verticalLabelPosition === 'top' || verticalLabelPosition === 'bottom';
  if (!isHorizontalLabel && !skipHorizontalRotation && whiteSpaceWrap) {
    let rotatedLabelWidth = Math.max(0, labelH - 2 - spacingTop - spacingBottom);
    let verticalOffsetX = 0;
    if (spacingTop < 0 && spacingRight < 0) {
      const fontAdjust = Math.max(0, Math.round(fontSize / 2) - 1);
      rotatedLabelWidth = Math.max(0, labelH - 2 - spacingTop - spacingBottom + spacingRight / 2 - fontAdjust);
      verticalOffsetX = spacingTop / 2;
      labelWidth = Math.round(rotatedLabelWidth);
      marginLeft = Math.round(labelX + labelW / 2 + verticalOffsetX - labelWidth / 2);
    } else {
      labelWidth = rotatedLabelWidth;
      marginLeft = labelX + labelW / 2 - labelWidth / 2;
    }
  }

  if (!isHorizontalLabel && !skipHorizontalRotation && whiteSpaceWrap && verticalLabelPosition !== 'top' && verticalLabelPosition !== 'bottom') {
    paddingTop = Math.round(labelY + labelH / 2 + (spacingRight - spacingLeft) / 2);
  }

  // Single-line labels (no wrap) use 1px width/height and centered/edge alignment
  if ((isHorizontalLabel || skipHorizontalRotation)
    && !whiteSpaceWrap
    && style.overflow !== 'fill'
    && style.overflow !== 'hidden'
    && !isTableHtml
  ) {
    const baseMarginLeft = marginLeft;
    const baseLabelWidth = labelWidth;
    labelWidth = 1;
    labelHeight = 1;
    if (align === 'center') {
      marginLeft = baseMarginLeft + baseLabelWidth / 2;
    } else if (align === 'right') {
      marginLeft = labelX + labelW - 2 + spacingLeft;
    } else {
      marginLeft = baseMarginLeft;
    }
  }

  // Vertical single-line labels (horizontal=0) use 1px width/height and centered padding
  const isVerticalSingleLine = !isHorizontalLabel
    && !skipHorizontalRotation
    && !whiteSpaceWrap
    && style.overflow !== 'fill'
    && style.overflow !== 'hidden'
    && !isTableHtml;
  if (isVerticalSingleLine) {
    labelWidth = 1;
    labelHeight = 1;
    if (isTextShape) {
      if (align === 'center' && valign === 'middle') {
        marginLeft = Math.round(labelX + labelW / 2);
      } else {
        marginLeft = Math.round(labelX + 7);
      }
      if (align === 'center') {
        paddingTop = Math.round(labelY + labelH / 2);
      } else {
        paddingTop = Math.round(labelY + labelH - 2);
      }
    } else {
      const centerX = labelX + labelW / 2;
      marginLeft = centerX;
      paddingTop = Math.round(labelY + labelH / 2);
    }
  }

  // For horizontal=0 with external label positions, use the platform's getLabelBounds algorithm
  // This handles isPaintBoundsInverted which swaps offsets and dimensions
  const hasExternalLabelPosition = labelPosition === 'left' || labelPosition === 'right' ||
    verticalLabelPosition === 'top' || verticalLabelPosition === 'bottom';
  if (!isHorizontalLabel && hasExternalLabelPosition && !whiteSpaceWrap) {
    const labelBounds = getLabelBounds({
      cellX: x,
      cellY: y,
      cellWidth: width,
      cellHeight: height,
      style,
      align,
      valign,
      spacingLeft,
      spacingRight,
      spacingTop,
      spacingBottom,
    });
    marginLeft = Math.round(labelBounds.x);
    paddingTop = Math.round(labelBounds.y);
    labelWidth = 1;
    labelHeight = 1;
  }

  // Handle external label positions (labels outside the shape)
  // Skip if already handled by getLabelBounds above
  const skipExternalLabelCalc = !isHorizontalLabel && hasExternalLabelPosition && !whiteSpaceWrap;
  if (labelPosition === 'left' && !skipExternalLabelCalc) {
    // Label is to the left of the shape
    if (width === 0 && height === 0 && !whiteSpaceWrap) {
      labelWidth = 1;
      labelHeight = 1;
      marginLeft = x + spacingLeft + 4;
    } else if (whiteSpaceWrap) {
      labelWidth = width + 2;
      marginLeft = x - labelWidth - 2 - spacingRight;
    } else {
      labelWidth = 1;
      labelHeight = 1;
      marginLeft = x - 2 - spacingRight;
    }
    if (verticalLabelPosition !== 'top' && verticalLabelPosition !== 'bottom') {
      if (valign === 'top') {
        paddingTop = Math.round(y + 7 + spacingTop);
      } else if (valign === 'bottom') {
        paddingTop = Math.round(y + height - spacingBottom - 3);
      } else {
        paddingTop = y + height / 2 + (spacingTop - spacingBottom) / 2;  // Vertical center with spacing
      }
    }
  } else if (labelPosition === 'right' && !skipExternalLabelCalc) {
    // Label is to the right of the shape
    if (width === 0 && height === 0 && !whiteSpaceWrap && align === 'right') {
      labelWidth = 1;
      labelHeight = 1;
      marginLeft = x - spacingRight - 1;
    } else {
      if (whiteSpaceWrap) {
        labelWidth = width + 2;
      } else {
        labelWidth = 1;
        labelHeight = 1;
      }
      const isPart = style.part === '1' || style.part === 1 || style.part === true;
      const rightSpacingLeft = isImageShape && align === 'center' && spacingLeft > 0
        ? (htmlLineCount > 1 ? spacingLeft + 3 : Math.max(0, spacingLeft - (fontSize + 2 + (isPart ? 2 : 0))))
        : spacingLeft;
      marginLeft = x + width + 2 + rightSpacingLeft;
    }
    if (verticalLabelPosition !== 'top' && verticalLabelPosition !== 'bottom') {
      if (valign === 'top') {
        paddingTop = Math.round(y + 7 + spacingTop);
      } else if (valign === 'bottom') {
        paddingTop = Math.round(y + height - spacingBottom - 3);
      } else {
        paddingTop = y + height / 2 + (spacingTop - spacingBottom) / 2;  // Vertical center with spacing
      }
    }
  }

  if (
    isLineShape &&
    (labelPosition === 'left' || labelPosition === 'right') &&
    verticalLabelPosition !== 'top' &&
    verticalLabelPosition !== 'bottom'
  ) {
    paddingTop = Math.round(y + height / 2 + (spacingTop - spacingBottom) / 2 + 4);
  }

  if (verticalLabelPosition === 'top' && !skipExternalLabelCalc) {
    // Label is above the shape
    const hasExternalHorizontal = labelPosition === 'left' || labelPosition === 'right';
    if (!hasExternalHorizontal) {
      if (whiteSpaceWrap) {
        // With wrap: use full width mode
        marginLeft = x + 1;
        labelWidth = width - 2;
      } else {
        // Without wrap: use width: 1px centered mode
        labelWidth = 1;
        labelHeight = 1;
        if (align === 'center') {
          marginLeft = x + width / 2;
        }
      }
    }
    if (!whiteSpaceWrap && align === 'center' && spacingLeft !== 0) {
      marginLeft = Math.round(marginLeft + spacingLeft / 2);
    }
    paddingTop = Math.round(y - 3);  // Position near top of shape
    if (hasExternalHorizontal && width === 0 && height === 0) {
      paddingTop = Math.round(y + 1);
    }
  } else if (verticalLabelPosition === 'bottom' && !skipExternalLabelCalc) {
    // Label is below the shape
    const hasExternalHorizontal = labelPosition === 'left' || labelPosition === 'right';
    if (!hasExternalHorizontal) {
      if (whiteSpaceWrap) {
        // With wrap: use full width mode
        marginLeft = x + 1;
        labelWidth = width - 2;
      } else {
        // Without wrap: use width: 1px centered mode
        labelWidth = 1;
        labelHeight = 1;
        if (align === 'center') {
          marginLeft = x + width / 2;
        }
      }
    }
    if (!whiteSpaceWrap && align === 'center' && spacingLeft !== 0) {
      marginLeft = Math.round(marginLeft + spacingLeft / 2);
    }
    if (valign === 'middle' && htmlLineCount > 1 && !whiteSpaceWrap && !isTableHtml) {
      paddingTop = Math.round(y + height + (htmlLineCount - 1) * fontSize + spacingTop);
    } else {
      const edgeLabelOffset = isEdgeLabel && valign === 'top' && !whiteSpaceWrap && !isTableHtml
        ? Math.round(fontSize / 2 + 10)
        : 7;
      paddingTop = Math.round(y + height + edgeLabelOffset + spacingTop);  // Position below shape
    }
  }

  if (isVerticalTextDirection && (labelPosition === 'left' || labelPosition === 'right')) {
    labelWidth = 1;
    labelHeight = Math.max(0, height - 4);
    marginLeft = labelPosition === 'left'
      ? x - 2 - spacingRight
      : x + width + 2 + spacingLeft;
    paddingTop = y + 2 + spacingTop;
    alignItems = 'flex-start';
    justifyContent = 'center';
  }

  // Use the value directly (may contain HTML)
  // Convert HTML void elements to XHTML self-closing format for XML compatibility
  if (isTableHtml) {
    labelWidth = labelW + 2;
    labelHeight = labelH;
    marginLeft = labelX - 1;
    paddingTop = Math.round(labelY);
  }

  // Handle rotation for the label
  let rotation = parseFloat(style.rotation as string) || 0;
  const shapeRotation = rotation;  // Save original shape rotation for external label positioning
  // For external labels (left/right/top/bottom), the label itself still rotates with the shape,
  // but the label position must be calculated relative to the rotated shape bounds
  const hasExternalLabelPos = labelPosition === 'left' || labelPosition === 'right' ||
    verticalLabelPosition === 'top' || verticalLabelPosition === 'bottom';

  // When shape has rotation and label is at external position AND label is horizontal (no horizontal=0),
  // rotate label position around shape center.
  // Skip for horizontal=0 labels since they use getLabelBounds which already handles rotation.
  if (isHorizontalLabel && hasExternalLabelPos && !isTextShape && shapeRotation !== 0) {
    const shapeCenterX = x + width / 2;
    const shapeCenterY = y + height / 2;
    const rad = shapeRotation * Math.PI / 180;
    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);
    // Rotate the label position (marginLeft, paddingTop) around shape center
    const labelX = marginLeft;
    const labelY = paddingTop;
    const rotatedX = shapeCenterX + (labelX - shapeCenterX) * cosR - (labelY - shapeCenterY) * sinR;
    const rotatedY = shapeCenterY + (labelX - shapeCenterX) * sinR + (labelY - shapeCenterY) * cosR;
    marginLeft = rotatedX;
    paddingTop = rotatedY;
  }
  // For horizontal=0 (vertical text) with external label positions, skip the shape rotation
  // since getLabelBounds already handles the positioning
  if (!isHorizontalLabel && hasExternalLabelPos && !isTextShape) {
    rotation = 0;
  }
  if (!isHorizontalLabel && rotation === 0 && !skipHorizontalRotation) {
    rotation -= 90;
  }
  let centerX = x + width / 2;
  let centerY = y + height / 2;
  if (isVerticalSingleLine) {
    centerX = marginLeft;
    centerY = paddingTop;
  }
  if (!isHorizontalLabel && !skipHorizontalRotation && whiteSpaceWrap && !isVerticalSingleLine) {
    centerX = marginLeft + labelWidth / 2;
    centerY = paddingTop;
  }
  // For external labels with shape rotation (horizontal labels only), use rotated position as rotation center
  if (isHorizontalLabel && hasExternalLabelPos && !isTextShape && shapeRotation !== 0) {
    centerX = marginLeft;
    centerY = paddingTop;
  }
  if (rotation !== 0 && isTextShape && isHorizontalLabel && align !== 'center') {
    const rad = rotation * Math.PI / 180;
    const baseX = marginLeft;
    const baseY = paddingTop;
    const rotatedX = centerX + (baseX - centerX) * Math.cos(rad) - (baseY - centerY) * Math.sin(rad);
    const rotatedY = centerY + (baseX - centerX) * Math.sin(rad) + (baseY - centerY) * Math.cos(rad);
    marginLeft = Math.round(rotatedX);
    paddingTop = Math.round(rotatedY);
    centerX = rotatedX;
    centerY = rotatedY;
  }
  const rotateStr = rotation !== 0 ? `rotate(${rotation} ${centerX} ${centerY})` : '';

  // DOM building using builder methods
  if (ctx.builder && ctx.currentGroup) {
    // Create outer group
    const outerG = ctx.builder.createGroup();

    // Create inner group with transform
    const innerG = ctx.builder.createGroup();
    if (rotateStr) {
      innerG.setAttribute('transform', rotateStr);
    }

    // Create foreignObject
    const fo = ctx.builder.doc.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    fo.setAttribute('style', 'overflow: visible; text-align: left;');
    fo.setAttribute('pointer-events', 'none');
    fo.setAttribute('width', '100%');
    fo.setAttribute('height', '100%');

    // Create outer div with flex layout
    const outerDiv = ctx.builder.doc.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    outerDiv.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    outerDiv.setAttribute('style',
      `display: flex; align-items: unsafe ${alignItems}; justify-content: unsafe ${justifyContent}; ` +
      `${isVerticalTextDirection ? `writing-mode: ${textDirection};` : ''}` +
      `width: ${labelWidth}px; height: ${labelHeight}px; padding-top: ${paddingTop}px; margin-left: ${marginLeft}px;`
    );

    // Create middle div for text alignment
    const middleDiv = ctx.builder.doc.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    const middleDivStyles = [
      'box-sizing: border-box',
      'font-size: 0px',
      `text-align: ${align}`
    ];
    if (isTableHtml) {
      middleDivStyles.push(`width: ${labelW}px`);
      middleDivStyles.push(`height: ${labelH}px`);
      middleDivStyles.push('overflow: hidden');
    }
    middleDiv.setAttribute('style', middleDivStyles.join('; ') + ';');
    const dataDrawioColors = `color: ${fontColor}; ${hasLabelBackground ? `background-color: ${dataDrawioBackground}; ` : ''}`;
    middleDiv.setAttribute('data-drawio-colors', dataDrawioColors);

    // Create inner div with text styles
    const innerDiv = ctx.builder.doc.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    const textStyle = [
      'display: inline-block',
      `font-size: ${fontSize}px`,
      `font-family: "${fontFamily}"`,
      `color: ${fontColor}`,
      'line-height: 1.2',
      'pointer-events: all',
      ...(hasLabelBackground ? [`background-color: ${labelBackgroundColor}`] : []),
      // Only set font-weight/style/decoration when non-default to avoid overriding inline styles
      ...(isBold ? [`font-weight: ${fontWeight}`] : []),
      ...(isItalic ? [`font-style: ${fontStyleCss}`] : []),
      ...(isUnderline ? [`text-decoration: ${textDecoration}`] : []),
      `white-space: ${whiteSpaceWrap ? 'normal' : 'nowrap'}`,
      'overflow-wrap: normal',
      ...(isTableHtml ? ['width: 100%', 'height: 100%'] : [])
    ].join('; ') + ';';
    innerDiv.setAttribute('style', textStyle);
    ctx.setXhtmlContent(innerDiv, content);
    if (!innerDiv.hasChildNodes() && value) {
      innerDiv.textContent = value;
    }

    // Assemble the structure
    middleDiv.appendChild(innerDiv);
    outerDiv.appendChild(middleDiv);
    fo.appendChild(outerDiv);
    innerG.appendChild(fo);
    outerG.appendChild(innerG);
    ctx.currentGroup.appendChild(outerG);
  }
}

/**
 * Render label with native SVG text and clipPath (for overflow=hidden)
 * Used for ERD tables (partialRectangle) and UML diagrams
 */
export function renderLabelWithClipPath(
  ctx: TextRenderContext,
  value: string,
  x: number, y: number, width: number, height: number,
  style: MxStyle
): void {
  const fontSize = parseFloat(style.fontSize as string) || 12;
  const fontColor = ctx.normalizeColor((style.fontColor as string) || '#000000');
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const fontStyle = parseInt(style.fontStyle as string) || 0;

  // Font style flags: 1=bold, 2=italic, 4=underline
  const isBold = (fontStyle & 1) !== 0;
  const isItalic = (fontStyle & 2) !== 0;
  const isUnderline = (fontStyle & 4) !== 0;

  // Text alignment
  const align = (style.align as string) || 'center';
  const valign = (style.verticalAlign as string) || 'middle';
  const spacingLeft = parseFloat(style.spacingLeft as string) || 0;

  // Calculate text position
  let textX = x;
  let textAnchor = 'middle';

  if (align === 'left') {
    textX = x + spacingLeft + 3.5; // Left align with padding to match the platform
    textAnchor = 'start';
  } else if (align === 'right') {
    textX = x + width - 3.5; // Right align with padding
    textAnchor = 'end';
  } else {
    textX = x + width / 2; // Center align
    textAnchor = 'middle';
  }

  // Vertical positioning
  let textY = y + height / 2 + 4.5; // Vertical center with adjustment
  if (valign === 'top') {
    textY = y + fontSize - 1;
  } else if (valign === 'bottom') {
    textY = y + height - 4;
  }

  // Generate clipPath for text overflow
  // For partialRectangle with spacingLeft, adjust clip bounds accordingly
  const clipX = Math.round(x + spacingLeft);
  const clipY = Math.round(y);
  const clipWidth = Math.round(width - spacingLeft);
  const clipHeight = Math.round(height);
  const clipId = `mx-clip-${clipX}-${clipY}-${clipWidth}-${clipHeight}-0`;

  // Register clipPath for defs
  ctx.clipPaths.set(clipId, {
    x: clipX,
    y: clipY,
    width: clipWidth,
    height: clipHeight
  });

  // DOM building - add native SVG text with clipPath
  if (ctx.builder && ctx.currentGroup) {
    // Group 1: Background rect (invisible, for pointer events)
    const rectGroup = ctx.builder.createGroup();
    const rectDomEl = ctx.builder.createRect(x, y, width, height);
    rectDomEl.setAttribute('fill', 'none');
    rectDomEl.setAttribute('stroke', 'none');
    rectDomEl.setAttribute('pointer-events', 'all');
    rectGroup.appendChild(rectDomEl);
    ctx.currentGroup.appendChild(rectGroup);

    // Group 2: Text with clip-path
    const textOuterGroup = ctx.builder.createGroup();
    const textInnerGroup = ctx.builder.createGroup();
    textInnerGroup.setAttribute('fill', fontColor);
    textInnerGroup.setAttribute('font-family', `"${fontFamily}"`);
    if (isBold) textInnerGroup.setAttribute('font-weight', 'bold');
    if (isItalic) textInnerGroup.setAttribute('font-style', 'italic');
    if (isUnderline) textInnerGroup.setAttribute('text-decoration', 'underline');
    textInnerGroup.setAttribute('clip-path', `url(#${clipId})`);
    if (textAnchor !== 'start') textInnerGroup.setAttribute('text-anchor', textAnchor);
    textInnerGroup.setAttribute('font-size', `${fontSize}px`);

    const textDomEl = ctx.builder.createText(textX, textY, ctx.escapeXml(value));
    textInnerGroup.appendChild(textDomEl);
    textOuterGroup.appendChild(textInnerGroup);
    ctx.currentGroup.appendChild(textOuterGroup);
  }
}

/**
 * Render an edge label at a specific point
 * Edge labels use a different layout: width=1px, height=1px with margin-left and padding-top for positioning
 */
function renderEdgeLabelNative(
  ctx: TextRenderContext,
  value: string,
  x: number, y: number,
  style: MxStyle
): void {
  const builder = ctx.builder;
  if (!value || !builder || !ctx.currentGroup) {
    return;
  }

  const fontSize = parseFloat(style.fontSize as string) || 11;  // Default edge font is 11px
  const fontColor = ctx.normalizeColor((style.fontColor as string) || '#000000');
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const fontStyle = parseInt(style.fontStyle as string) || 0;
  const rawLabelBackgroundColor = style.labelBackgroundColor as string | undefined;
  const labelBackgroundColor = rawLabelBackgroundColor !== undefined
    ? ctx.normalizeColor(rawLabelBackgroundColor)
    : '#ffffff';

  // Font style flags: 1=bold, 2=italic, 4=underline
  const isBold = (fontStyle & 1) !== 0;
  const isItalic = (fontStyle & 2) !== 0;
  const isUnderline = (fontStyle & 4) !== 0;

  // Text alignment for edges
  const align = (style.align as string) || 'center';
  const verticalAlign = (style.verticalAlign as string) || 'middle';
  const verticalLabelPosition = style.verticalLabelPosition as string | undefined;

  let textX = x;
  if (align === 'left') {
    textX = x + 2;
  } else if (align === 'right') {
    textX = x - 2;
  }

  let textY = y + fontSize / 2 - 1;
  if (verticalAlign === 'top') {
    textY = y + fontSize + (verticalLabelPosition === 'bottom' ? 7 : 6);
  } else if (verticalAlign === 'bottom') {
    textY = verticalLabelPosition === 'top' ? y - 5 : y - 4;
  }

  const outerG = builder.createGroup();
  const innerG = builder.createGroup();
  innerG.setAttribute('fill', fontColor);
  innerG.setAttribute('font-family', `"${fontFamily}"`);
  innerG.setAttribute('font-size', `${fontSize}px`);

  if (align === 'right') {
    innerG.setAttribute('text-anchor', 'end');
  } else if (align === 'center') {
    innerG.setAttribute('text-anchor', 'middle');
  }

  if (isBold) innerG.setAttribute('font-weight', 'bold');
  if (isItalic) innerG.setAttribute('font-style', 'italic');
  if (isUnderline) innerG.setAttribute('text-decoration', 'underline');

  // Use measureTextLayout for precise dimensions instead of manual HTML parsing
  const isHtmlContent = style.html === '1' || style.html === true;
  const edgeTextLayout = measureTextLayout(
    value,
    fontSize,
    fontFamily,
    isBold ? 'bold' : 'normal',
    isItalic ? 'italic' : 'normal',
    undefined,
    isHtmlContent
  );
  const lineHeight = edgeTextLayout.lineHeight;
  const lineCount = edgeTextLayout.lineCount;
  const totalHeight = edgeTextLayout.height;

  // Split text into lines for SVG text element rendering
  const rawValue = value.replace(/<br\s*\/?>(\r?\n)?/gi, '\n');
  const lines = rawValue.split(/\r\n|\r|\n/);
  
  const startY = lineCount > 1 ? (textY - (totalHeight - lineHeight) / 2) : textY;

  if (labelBackgroundColor && labelBackgroundColor !== 'none') {
    const rectWidth = Math.round(edgeTextLayout.width + 2);
    const rectHeight = Math.round(totalHeight + 1);
    let rectX = Math.round(textX);
    if (align === 'center') {
      rectX = Math.round(textX - rectWidth / 2);
    } else if (align === 'right') {
      rectX = Math.round(textX - rectWidth + 1.5);
    }
    const rectY = Math.floor(startY - (fontSize - 1));
    const rectEl = builder.createRect(rectX, rectY, rectWidth, rectHeight);
    rectEl.setAttribute('fill', labelBackgroundColor);
    rectEl.setAttribute('stroke', 'none');
    rectEl.setAttribute('stroke-width', '0');
    innerG.appendChild(rectEl);
  }

  lines.forEach((line, index) => {
    if (!line && lineCount > 1) return;
    const textEl = builder.createText(textX, startY + index * lineHeight, ctx.escapeXml(line));
    innerG.appendChild(textEl);
  });
  outerG.appendChild(innerG);
  ctx.currentGroup.appendChild(outerG);
}

export function renderEdgeLabel(
  ctx: TextRenderContext,
  value: string,
  x: number, y: number,
  style: MxStyle
): void {
  if (!value) {
    return;
  }

  if (!isHtmlLabel(style)) {
    renderEdgeLabelNative(ctx, value, x, y, style);
    return;
  }

  const fontSize = parseFloat(style.fontSize as string) || 11;  // Default edge font is 11px
  const fontColor = ctx.normalizeColor((style.fontColor as string) || '#000000');
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const fontStyle = parseInt(style.fontStyle as string) || 0;
  const rawLabelBackgroundColor = style.labelBackgroundColor as string | undefined;
  let labelBackgroundColor = '';
  if (rawLabelBackgroundColor === 'default') {
    labelBackgroundColor = ctx.normalizeColor('#ffffff');
  } else if (rawLabelBackgroundColor && rawLabelBackgroundColor !== 'none') {
    labelBackgroundColor = ctx.normalizeColor(rawLabelBackgroundColor);
  } else if (!rawLabelBackgroundColor) {
    labelBackgroundColor = ctx.normalizeColor('#ffffff');
  }
  const whiteSpaceWrap = style.whiteSpace === 'wrap';

  // Font style flags: 1=bold, 2=italic, 4=underline
  const isBold = (fontStyle & 1) !== 0;
  const isItalic = (fontStyle & 2) !== 0;
  const isUnderline = (fontStyle & 4) !== 0;

  // Build style strings
  const fontWeight = isBold ? 'bold' : 'normal';
  const fontStyleCss = isItalic ? 'italic' : 'normal';
  const textDecoration = isUnderline ? 'underline' : 'none';

  // Text alignment for edges
  const align = (style.align as string) || 'center';
  const verticalAlign = (style.verticalAlign as string) || 'middle';
  const spacingTop = parseFloat(style.spacingTop as string) || 0;
  const spacingBottom = parseFloat(style.spacingBottom as string) || 0;
  const spacingLeft = parseFloat(style.spacingLeft as string) || 0;
  const spacingRight = parseFloat(style.spacingRight as string) || 0;

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

  // Convert value to XHTML
  const content = ctx.convertToXhtml(value);

  // Edge labels use:
  // - width: 1px
  // - height: 1px
  // - margin-left: x position
  // - padding-top: y position (adjusted based on vertical alignment)
  //
  // Vertical alignment adjustments for edge labels:
  // - bottom (flex-end): label bottom aligns to line, offset up by ~3px
  // - top (flex-start): label top aligns to line, offset down by ~7px
  // - middle (center): label center aligns to line, no offset
  let paddingTopOffset = 0;
  switch (verticalAlign) {
    case 'bottom':
      paddingTopOffset = -3 - spacingBottom;
      break;
    case 'top':
      paddingTopOffset = 7 + spacingTop;
      break;
    case 'middle':
    default:
      paddingTopOffset = (spacingTop - spacingBottom) / 2;
      break;
  }

  // Horizontal alignment adjustments for edge labels:
  // - left (flex-start): label left aligns, offset right by ~2px
  // - right (flex-end): label right aligns, offset left by ~2px
  // - center: no offset
  let marginLeftOffset = 0;
  switch (align) {
    case 'left':
      marginLeftOffset = 2 + spacingLeft;
      break;
    case 'right':
      marginLeftOffset = -2 - spacingRight;
      break;
    case 'center':
    default:
      marginLeftOffset = 0;
      break;
  }

  const marginLeft = Math.round(x + marginLeftOffset);
  const paddingTop = Math.round(y + paddingTopOffset);

  // Build the background color style if needed
  const bgColorStyle = labelBackgroundColor ? `background-color: ${labelBackgroundColor}; ` : '';
  const dataDrawioColors = `color: ${fontColor}; ${bgColorStyle}`;

  // DOM building using builder methods
  if (ctx.builder && ctx.currentGroup) {
    // Create outer group
    const outerG = ctx.builder.createGroup();

    // Create inner group
    const innerG = ctx.builder.createGroup();

    // Create foreignObject
    const fo = ctx.builder.doc.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    fo.setAttribute('style', 'overflow: visible; text-align: left;');
    fo.setAttribute('pointer-events', 'none');
    fo.setAttribute('width', '100%');
    fo.setAttribute('height', '100%');

    // Create outer div with flex layout
    const outerDiv = ctx.builder.doc.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    outerDiv.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    outerDiv.setAttribute('style',
      `display: flex; align-items: unsafe ${alignItems}; justify-content: unsafe ${justifyContent}; ` +
      `width: 1px; height: 1px; padding-top: ${paddingTop}px; margin-left: ${marginLeft}px;`
    );

    // Create middle div for text alignment
    const middleDiv = ctx.builder.doc.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    middleDiv.setAttribute('style', `box-sizing: border-box; font-size: 0px; text-align: ${align};`);
    middleDiv.setAttribute('data-drawio-colors', dataDrawioColors);

    // Create inner div with text styles
    const innerDiv = ctx.builder.doc.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    const textStyle = [
      'display: inline-block',
      `font-size: ${fontSize}px`,
      `font-family: "${fontFamily}"`,
      `color: ${fontColor}`,
      'line-height: 1.2',
      'pointer-events: all',
      bgColorStyle,
      // Only set font-weight/style/decoration when non-default to avoid overriding inline styles
      ...(isBold ? [`font-weight: ${fontWeight}`] : []),
      ...(isItalic ? [`font-style: ${fontStyleCss}`] : []),
      ...(isUnderline ? [`text-decoration: ${textDecoration}`] : []),
      `white-space: ${whiteSpaceWrap ? 'normal' : 'nowrap'}`,
      ...(whiteSpaceWrap ? ['word-wrap: normal'] : [])
    ].filter(s => s).join('; ') + ';';
    innerDiv.setAttribute('style', textStyle);
    ctx.setXhtmlContent(innerDiv, content);

    // Assemble the structure
    middleDiv.appendChild(innerDiv);
    outerDiv.appendChild(middleDiv);
    fo.appendChild(outerDiv);
    innerG.appendChild(fo);
    outerG.appendChild(innerG);
    ctx.currentGroup.appendChild(outerG);
  }
}

/**
 * Render a swimlane title label
 * Uses conditional rendering like regular labels
 */
export function renderSwimlaneLabel(
  ctx: TextRenderContext,
  value: string,
  x: number, y: number, width: number, height: number,
  startSize: number, horizontal: boolean,
  style: MxStyle
): void {
  if (!value) {
    return;
  }

  // Calculate label area within swimlane header
  let labelX = x, labelY = y, labelW = width, labelH = height;

  if (horizontal) {
    // Horizontal swimlane: label in top band (0, 0, width, startSize)
    labelH = startSize;
  } else {
    // Vertical swimlane: label in left band (0, 0, startSize, height)
    labelW = startSize;
  }

  const defaultBold = style.swimlane === true || style.swimlane === '1';

  // Determine rendering method based on the platform's logic
  if (isHtmlLabel(style)) {
    // Use foreignObject for HTML labels
    renderSwimlaneHtmlLabel(ctx, value, labelX, labelY, labelW, labelH, horizontal, style, defaultBold);
  } else {
    // Use native SVG text for simple labels (most common case)
    renderSwimlaneNativeLabel(ctx, value, labelX, labelY, labelW, labelH, horizontal, style, defaultBold);
  }
}

/**
 * Render swimlane label using native SVG text (most common case)
 */
export function renderSwimlaneNativeLabel(
  ctx: TextRenderContext,
  value: string,
  x: number, y: number, width: number, height: number,
  horizontal: boolean,
  style: MxStyle,
  defaultBold: boolean
): void {
  if (!ctx.builder || !ctx.currentGroup) {
    return;
  }

  const fontSize = parseFloat(style.fontSize as string) || 12;
  const fontColor = ctx.normalizeColor((style.fontColor as string) || '#000000');
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const hasFontStyle = style.fontStyle !== undefined;
  const fontStyle = parseInt(style.fontStyle as string) || 0;
  const valign = (style.verticalAlign as string) || 'middle';
  const align = (style.align as string) || 'center';
  const spacingLeft = parseFloat(style.spacingLeft as string) || 0;
  const spacingRight = parseFloat(style.spacingRight as string) || 0;
  const spacingBottom = parseFloat(style.spacingBottom as string) || 0;

  // Font style flags: 1=bold, 2=italic, 4=underline
  // Swimlane titles are bold by default unless explicitly set otherwise
  const isBold = (fontStyle & 1) !== 0 || (!hasFontStyle && defaultBold);
  const isItalic = (fontStyle & 2) !== 0;
  const isUnderline = (fontStyle & 4) !== 0;

  // Calculate text position based on horizontal alignment
  let textX: number;
  let textAnchor: string;
  // mxConstants.LABEL_INSET = 4, but drawio uses spacing + some base offset (~2)
  const baseInset = 2;

  if (align === 'left') {
    textX = x + spacingLeft + baseInset;
    textAnchor = 'start';
  } else if (align === 'right') {
    textX = x + width - spacingRight - baseInset;
    textAnchor = 'end';
  } else {
    // center (default)
    textX = x + width / 2;
    textAnchor = 'middle';
  }

  let textY: number;

  // Special handling for kanban-style swimlanes with very small startSize and verticalAlign=bottom
  // In this case, the label appears ABOVE the header area
  if (valign === 'bottom' && height <= fontSize) {
    // Label above the header: y - spacingBottom - small offset
    textY = y - spacingBottom - 3.5;
  } else {
    // Normal case: centered in header area
    // Baseline adjustment: use fontSize * 0.35 for more accurate vertical centering
    textY = y + height / 2 + fontSize * 0.35;
  }

  // Create text group with styling
  const textGroup = ctx.builder.createGroup();

  // For vertical swimlanes, add rotation transform
  if (!horizontal) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    textGroup.setAttribute('transform', `rotate(-90 ${centerX} ${centerY})`);
  }

  textGroup.setAttribute('fill', fontColor);
  textGroup.setAttribute('font-family', `"${fontFamily}"`);
  textGroup.setAttribute('font-size', `${fontSize}px`);
  textGroup.setAttribute('text-anchor', textAnchor);

  if (isBold) textGroup.setAttribute('font-weight', 'bold');
  if (isItalic) textGroup.setAttribute('font-style', 'italic');
  if (isUnderline) textGroup.setAttribute('text-decoration', 'underline');

  // Use measureTextLayout for precise dimensions instead of manual HTML parsing
  const isHtmlContent = style.html === '1' || style.html === true;
  const swimlaneTextLayout = measureTextLayout(
    value,
    fontSize,
    fontFamily,
    isBold ? 'bold' : 'normal',
    isItalic ? 'italic' : 'normal',
    undefined,
    isHtmlContent
  );
  const lineHeight = swimlaneTextLayout.lineHeight;
  const lineCount = swimlaneTextLayout.lineCount;

  // Split text into lines for SVG text element rendering
  const rawValue = value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&#x0*a;|&#10;/gi, '\n');
  const lines = rawValue.split(/\r\n|\r|\n/);

  if (lineCount > 1) {
    const startY = textY - ((lineCount - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      const textEl = ctx.builder!.createText(textX, startY + index * lineHeight, ctx.escapeXml(line));
      textGroup.appendChild(textEl);
    });
  } else {
    // Create text element
    const textEl = ctx.builder.createText(textX, textY, ctx.escapeXml(lines[0] || ''));
    textGroup.appendChild(textEl);
  }
  ctx.currentGroup.appendChild(textGroup);
}

/**
 * Render swimlane label using foreignObject (for html=1 or whiteSpace=wrap)
 */
export function renderSwimlaneHtmlLabel(
  ctx: TextRenderContext,
  value: string,
  x: number, y: number, width: number, height: number,
  horizontal: boolean,
  style: MxStyle,
  defaultBold: boolean
): void {
  const fontSize = parseFloat(style.fontSize as string) || 12;
  const fontColor = ctx.normalizeColor((style.fontColor as string) || '#000000');
  const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
  const hasFontStyle = style.fontStyle !== undefined;
  const fontStyle = parseInt(style.fontStyle as string) || 0;

  // Font style flags: 1=bold, 2=italic, 4=underline
  // Swimlane titles are bold by default unless explicitly set otherwise
  const isBold = (fontStyle & 1) !== 0 || (!hasFontStyle && defaultBold);

  // Build style strings
  const fontWeight = isBold ? 'bold' : 'normal';

  // Convert value to XHTML
  const content = ctx.convertToXhtml(value);

  // Check if text wrapping is enabled
  const whiteSpaceWrap = style.whiteSpace === 'wrap';

  // Vertical alignment for swimlane titles
  const valign = (style.verticalAlign as string) || 'middle';
  let alignItems = 'center';
  if (valign === 'top') {
    alignItems = 'flex-start';
  } else if (valign === 'bottom') {
    alignItems = 'flex-end';
  }

  let marginLeft: number;
  let paddingTop: number;
  let labelWidth: string;
  let labelHeight: string;
  let whiteSpaceStyle: string;

  if (whiteSpaceWrap) {
    // Wrap mode: use full header width, similar to regular labels
    // width: (shapeWidth - 2)px; height: 1px
    if (valign === 'top') {
      paddingTop = Math.round(y + fontSize / 2 + 1);
    } else if (valign === 'bottom') {
      paddingTop = Math.round(y + height - fontSize / 2 - 1);
    } else {
      paddingTop = Math.round(y + height / 2);
    }
    if (!horizontal) {
      const computedWidth = Math.max(1, height - 2);
      labelWidth = `${computedWidth}px`;
      marginLeft = Math.round(x + width / 2 - computedWidth / 2);
    } else {
      marginLeft = Math.round(x + 1);
      labelWidth = `${width - 2}px`;
    }
    labelHeight = '1px';
    whiteSpaceStyle = 'white-space: normal; overflow-wrap: normal;';
  } else {
    // No wrap mode: use width: 1px; height: 1px centered
    marginLeft = Math.round(x + width / 2);
    if (valign === 'top') {
      paddingTop = Math.round(y + fontSize / 2 + 1);
    } else if (valign === 'bottom') {
      paddingTop = Math.round(y + height - fontSize / 2 - 1);
    } else {
      paddingTop = Math.round(y + height / 2);
    }
    labelWidth = '1px';
    labelHeight = '1px';
    whiteSpaceStyle = 'white-space: nowrap;';
  }

  // For vertical swimlanes, add rotation transform
  let transformAttr = '';
  if (!horizontal) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    transformAttr = `rotate(-90 ${centerX} ${centerY})`;
  }

  // DOM building using builder methods
  if (ctx.builder && ctx.currentGroup) {
    // Create outer group
    const outerG = ctx.builder.createGroup();

    // Create inner group with transform
    const innerG = ctx.builder.createGroup();
    if (transformAttr) {
      innerG.setAttribute('transform', transformAttr);
    }

    // Create foreignObject
    const fo = ctx.builder.doc.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    fo.setAttribute('style', 'overflow: visible; text-align: left;');
    fo.setAttribute('pointer-events', 'none');
    fo.setAttribute('width', '100%');
    fo.setAttribute('height', '100%');

    // Create outer div with flex layout
    const outerDiv = ctx.builder.doc.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    outerDiv.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    outerDiv.setAttribute('style',
      `display: flex; align-items: unsafe ${alignItems}; justify-content: unsafe center; ` +
      `width: ${labelWidth}; height: ${labelHeight}; padding-top: ${paddingTop}px; margin-left: ${marginLeft}px;`
    );

    // Create middle div for text alignment
    const middleDiv = ctx.builder.doc.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    middleDiv.setAttribute('style', 'box-sizing: border-box; font-size: 0px; text-align: center;');
    middleDiv.setAttribute('data-drawio-colors', `color: ${fontColor}; `);

    // Create inner div with text styles
    const innerDiv = ctx.builder.doc.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    const textStyle = [
      'display: inline-block',
      `font-size: ${fontSize}px`,
      `font-family: "${fontFamily}"`,
      `color: ${fontColor}`,
      'line-height: 1.2',
      'pointer-events: all',
      // Only set font-weight when bold to avoid overriding inline styles
      ...(isBold ? [`font-weight: ${fontWeight}`] : []),
      whiteSpaceStyle
    ].filter(s => s).join('; ') + ';';
    innerDiv.setAttribute('style', textStyle);
    ctx.setXhtmlContent(innerDiv, content);

    // Assemble the structure
    middleDiv.appendChild(innerDiv);
    outerDiv.appendChild(middleDiv);
    fo.appendChild(outerDiv);
    innerG.appendChild(fo);
    outerG.appendChild(innerG);
    ctx.currentGroup.appendChild(outerG);
  }
}

/**
 * Render text label - choose between native SVG text or foreignObject based on style
 */
export function renderLabel(
  ctx: TextRenderContext,
  value: string,
  x: number, y: number, width: number, height: number,
  style: MxStyle
): void {
  if (!value) {
    return;
  }

  // Determine rendering method based on the platform's logic
  if (isHtmlLabel(style)) {
    // Use foreignObject for HTML labels
    renderHtmlLabel(ctx, value, x, y, width, height, style);
  } else {
    // Use native SVG text for simple labels
    renderNativeTextLabel(ctx, value, x, y, width, height, style);
  }
}
