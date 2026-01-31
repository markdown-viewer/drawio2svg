import type { MxStyle } from '../../parser.ts';
import type { SvgBuilder } from '../../svg/index.ts';
import type { ShapeAttrs } from '../../renderer.ts';

interface LineRenderContext {
  builder: SvgBuilder | null;
  currentGroup: Element | null;
}

interface LineRenderParams {
  x: number;
  y: number;
  width: number;
  height: number;
  style: MxStyle;
  attrs: ShapeAttrs;
  strokeWidth: number;
}

export function renderLineSeparator(ctx: LineRenderContext, params: LineRenderParams): void {
  const { builder, currentGroup } = ctx;
  if (!builder || !currentGroup) return;

  const { x, y, width, height, style, attrs, strokeWidth } = params;

  // Line separator - direction controls horizontal/vertical orientation
  const direction = (style.direction as string) || 'east';
  const lineX = x + width / 2;
  let lineY = y + height / 2;
  const isVertical = direction === 'north' || direction === 'south';
  const isHtml = style.html === '1' || style.html === true;
  const hasStrokeColor = style.strokeColor !== undefined && style.strokeColor !== '';
  if (isVertical && !isHtml && !hasStrokeColor && Math.round(strokeWidth) % 2 === 1) {
    lineY += 1;
  }
  const lineLength = isVertical ? height : width;
  const half = lineLength / 2;
  const innerG = builder.createGroup();
  builder.setCanvasRoot(innerG);
  builder.save();
  builder.setFillColor(null);
  builder.setStrokeColor(attrs.strokeColor);
  builder.setStrokeWidth(strokeWidth);
  const rawPattern = typeof attrs.dashPattern === 'string' ? attrs.dashPattern.trim() : '';
  const basePattern = rawPattern && rawPattern !== 'none'
    ? rawPattern
    : (attrs.dashed ? '3 3' : '');
  if (basePattern) {
    const tokens = basePattern.split(/[ ,]+/).filter((token) => token.length > 0);
    const scaledTokens = tokens.map((token) => {
      const value = parseFloat(token);
      if (!Number.isFinite(value)) return token;
      const scaled = value * strokeWidth;
      return Number.isFinite(scaled) ? String(scaled) : token;
    });
    builder.setDashPattern(scaledTokens.join(' '));
    builder.setDashed(true);
  } else {
    builder.setDashed(false);
  }
  builder.begin();
  builder.addPoints(
    [
      { x: lineX - half, y: lineY },
      { x: lineX + half, y: lineY }
    ],
    false,
    0,
    false
  );
  builder.stroke();
  builder.restore();

  const lineEl = innerG.lastChild as Element | null;
  if (lineEl) {
    lineEl.setAttribute('pointer-events', 'all');
  }
  currentGroup.appendChild(innerG);
}
