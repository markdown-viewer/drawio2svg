import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler } from '../../shape-registry.ts';

/**
 * Lollipop shape - circle with stem (provided interface)
 * Based on LollipopShape from Shapes.js
 */
export class LollipopHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const sz = Number(style.size) || 10;

    // Draw circle (lollipop head)
    builder.ellipse(x + (width - sz) / 2, y, sz, sz);
    builder.fillAndStroke();

    // Draw stem
    builder.begin();
    builder.moveTo(x + width / 2, y + sz);
    builder.lineTo(x + width / 2, y + height);
    builder.stroke();

    builder.restore();
  }
}
