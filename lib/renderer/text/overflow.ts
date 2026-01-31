import type { MxStyle } from '../../parser.ts';
import type { TextRenderContext } from './labels.ts';
import { DEFAULT_FONT_FAMILY } from '../../text/index.ts';

interface OverflowTextParams {
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: MxStyle;
}

export function renderOverflowTextCell(
  ctx: TextRenderContext,
  params: OverflowTextParams,
  popGeometryGroup?: () => void
): void {
  const { value, x, y, width, height, style } = params;
  const label = value || '';

  if (!ctx.builder || !ctx.currentGroup) {
    return;
  }

  if (label) {
    const fontSize = parseFloat(style.fontSize as string) || 12;
    const spacingLeft = parseFloat(style.spacingLeft as string) || 0;
    const spacingTop = parseFloat(style.spacingTop as string) || 0;
    const textX = x + spacingLeft + 1.5; // Match the platform positioning (x + spacingLeft + padding)
    const verticalAlign = (style.verticalAlign as string) || 'top';
    let textY: number;
    if (verticalAlign === 'middle') {
      textY = y + height / 2 + fontSize / 2 - 1 + spacingTop / 2;
    } else if (verticalAlign === 'bottom') {
      textY = y + height - 4;
    } else {
      // top
      textY = y + fontSize + 6 + spacingTop;
    }
    const fontFamily = (style.fontFamily as string) || DEFAULT_FONT_FAMILY;
    const fontColor = ctx.normalizeColor((style.fontColor as string) || '#000000');

    // Parse fontStyle for underline, bold, italic
    const fontStyleNum = parseInt(style.fontStyle as string) || 0;
    const isUnderline = (fontStyleNum & 4) !== 0;

    // Generate clipPath for text overflow
    // clipPath rect uses 4px horizontal inset, no vertical offset
    const clipX = x + 4;
    const clipY = y;
    const clipWidth = width - 8;
    const clipHeight = height;
    const clipId = `mx-clip-${clipX}-${clipY}-${clipWidth}-${clipHeight}-0`;

    // Register clipPath for defs
    ctx.clipPaths.set(clipId, { x: clipX, y: clipY, width: clipWidth, height: clipHeight });

    // Inner group with rect
    const rectGroup = ctx.builder.createGroup();
    const rectDomEl = ctx.builder.createRect(x, y, width, height);
    rectDomEl.setAttribute('fill', 'none');
    rectDomEl.setAttribute('stroke', 'none');
    rectDomEl.setAttribute('pointer-events', 'all');
    rectGroup.appendChild(rectDomEl);
    ctx.currentGroup.appendChild(rectGroup);

    if (popGeometryGroup) {
      popGeometryGroup();
    }

    // Inner group with text
    const textOuterGroup = ctx.builder.createGroup();
    const textInnerGroup = ctx.builder.createGroup();
    textInnerGroup.setAttribute('fill', fontColor);
    textInnerGroup.setAttribute('font-family', `"${fontFamily}"`);
    if (isUnderline) textInnerGroup.setAttribute('text-decoration', 'underline');
    textInnerGroup.setAttribute('clip-path', `url(#${clipId})`);
    textInnerGroup.setAttribute('font-size', `${fontSize}px`);
    const textDomEl = ctx.builder.createText(textX, textY, ctx.escapeXml(label));
    textInnerGroup.appendChild(textDomEl);
    textOuterGroup.appendChild(textInnerGroup);
    ctx.currentGroup.appendChild(textOuterGroup);
    return;
  }

  const rectGroup = ctx.builder.createGroup();
  const rectDomEl = ctx.builder.createRect(x, y, width, height);
  rectDomEl.setAttribute('fill', 'none');
  rectDomEl.setAttribute('stroke', 'none');
  rectDomEl.setAttribute('pointer-events', 'all');
  rectGroup.appendChild(rectDomEl);
  ctx.currentGroup.appendChild(rectGroup);

  if (popGeometryGroup) {
    popGeometryGroup();
  }
}
