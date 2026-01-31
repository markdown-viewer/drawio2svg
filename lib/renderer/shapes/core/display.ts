import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * Display shape - rounded hexagon-like
 * Based on DisplayShape from Shapes.js
 */
export class DisplayHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const defaultSize = 0.25;
    const size = parseFloat(style.size as string) || defaultSize;
    const dx = Math.min(width, height / 2);
    const s = Math.min(width - dx, Math.max(0, size) * width);

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.moveTo(x, y + height / 2);
    builder.lineTo(x + s, y);
    builder.lineTo(x + width - dx, y);
    builder.quadTo(x + width, y, x + width, y + height / 2);
    builder.quadTo(x + width, y + height, x + width - dx, y + height);
    builder.lineTo(x + s, y + height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
