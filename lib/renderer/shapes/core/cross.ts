import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * Cross shape - a plus sign shape
 * Based on CrossShape from Shapes.js
 */
export class CrossHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const size = parseFloat(style.size as string) || 0.2;
    const m = Math.min(height, width);
    const s = Math.max(0, Math.min(m, m * size));
    const t = (height - s) / 2;
    const b = t + s;
    const l = (width - s) / 2;
    const r = l + s;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.moveTo(x, y + t);
    builder.lineTo(x + l, y + t);
    builder.lineTo(x + l, y);
    builder.lineTo(x + r, y);
    builder.lineTo(x + r, y + t);
    builder.lineTo(x + width, y + t);
    builder.lineTo(x + width, y + b);
    builder.lineTo(x + r, y + b);
    builder.lineTo(x + r, y + height);
    builder.lineTo(x + l, y + height);
    builder.lineTo(x + l, y + b);
    builder.lineTo(x, y + b);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
