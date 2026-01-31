import type { MxStyle } from '../parser.ts';
import type { SvgBuilder } from '../svg/index.ts';

export interface InlineImageRenderContext {
  builder: SvgBuilder | null;
  currentGroup: Element | null;
  normalizeImageUrl: (imageUrl: string) => string;
  isPlaceholderImageUrl?: (imageUrl: string) => boolean;
  createPlaceholderInlineSvg?: (x: number, y: number, width: number, height: number) => Element | null;
}

export interface InlineImageRenderParams {
  style: MxStyle;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function renderInlineImage(ctx: InlineImageRenderContext, params: InlineImageRenderParams): void {
  const { style, x, y, width, height } = params;

  const imageUrl = typeof style.image === 'string' ? style.image : '';
  if (!imageUrl) return;

  const isLabelShape = style.shape === 'label' || style.label === true;

  const parsedWidth = parseFloat(style.imageWidth as string);
  const parsedHeight = parseFloat(style.imageHeight as string);
  const defaultSize = isLabelShape ? 42 : 24;
  const imageWidth = Number.isFinite(parsedWidth) ? parsedWidth : defaultSize;
  const imageHeight = Number.isFinite(parsedHeight) ? parsedHeight : imageWidth;

  const spacingRaw = parseFloat(style.spacing as string);
  const baseSpacing = Number.isFinite(spacingRaw) ? spacingRaw : (isLabelShape ? 2 : 2);
  const spacing = baseSpacing + 5;

  const align = (style.imageAlign as string) || (isLabelShape ? 'left' : 'center');
  const valign = (style.imageVerticalAlign as string) || 'middle';

  let imageX = x;
  if (align === 'center') {
    imageX += (width - imageWidth) / 2;
  } else if (align === 'right') {
    imageX += width - imageWidth - spacing;
  } else {
    imageX += spacing;
  }

  let imageY = y;
  if (valign === 'top') {
    imageY += spacing;
  } else if (valign === 'bottom') {
    imageY += height - imageHeight - spacing;
  } else {
    imageY += (height - imageHeight) / 2;
  }

  if (ctx.builder && ctx.currentGroup) {
    const isPlaceholder = ctx.isPlaceholderImageUrl?.(imageUrl) ?? false;
    if (isPlaceholder) {
      const inlineSvg = ctx.createPlaceholderInlineSvg?.(imageX, imageY, imageWidth, imageHeight);
      if (inlineSvg) {
        ctx.currentGroup.appendChild(inlineSvg);
      }
      return;
    }
    const normalizedUrl = ctx.normalizeImageUrl(imageUrl);
    const el = ctx.builder.createImage(imageX, imageY, imageWidth, imageHeight, normalizedUrl);
    el.setAttribute('preserveAspectRatio', 'none');
    ctx.currentGroup.appendChild(el);
  }
}
