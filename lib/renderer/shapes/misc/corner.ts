import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

const parseNumber = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : fallback;
};

export class CornerHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const dx = Math.min(width, Math.max(0, parseNumber(style.dx, width / 2)));
    const dy = Math.min(height, Math.max(0, parseNumber(style.dy, height / 2)));
    const rounded = style.rounded === '1' || style.rounded === true;
    // draw.io: arcSize defaults to LINE_ARCSIZE=20, radius = arcSize/2
    const arcSizeVal = parseNumber(style.arcSize, 20);
    const radius = rounded ? Math.min(arcSizeVal / 2, dx, dy, width / 2, height / 2) : 0;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    if (radius > 0) {
      builder.moveTo(x, y + height / 2);
      builder.lineTo(x, y + radius);
      builder.quadTo(x, y, x + radius, y);
      builder.lineTo(x + width - radius, y);
      builder.quadTo(x + width, y, x + width, y + radius);
      builder.lineTo(x + width, y + dy - radius);
      builder.quadTo(x + width, y + dy, x + width - radius, y + dy);
      builder.lineTo(x + dx + radius, y + dy);
      builder.quadTo(x + dx, y + dy, x + dx, y + dy + radius);
      builder.lineTo(x + dx, y + height - radius);
      builder.quadTo(x + dx, y + height, x + dx - radius, y + height);
      builder.lineTo(x + radius, y + height);
      builder.quadTo(x, y + height, x, y + height - radius);
      builder.close();
    } else {
      builder.moveTo(x, y);
      builder.lineTo(x + width, y);
      builder.lineTo(x + width, y + dy);
      builder.lineTo(x + dx, y + dy);
      builder.lineTo(x + dx, y + height);
      builder.lineTo(x, y + height);
      builder.close();
    }
    builder.fillAndStroke();
    builder.restore();
  }
}