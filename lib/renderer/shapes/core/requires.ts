import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler } from '../../shape-registry.ts';

/**
 * Requires shape - socket with stem
 * Based on RequiresShape from Shapes.js
 */
export class RequiresHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const strokeWidth = attrs.strokeWidth ?? 1;
    const sz = Number(style.size) || 10;
    const inset = (Number(style.inset) || 2) + strokeWidth;

    // Draw stem
    builder.begin();
    builder.moveTo(x + width / 2, y + sz + inset);
    builder.lineTo(x + width / 2, y + height);
    builder.stroke();

    // Draw socket arc
    builder.begin();
    builder.moveTo(x + (width - sz) / 2 - inset, y + sz / 2);
    builder.quadTo(x + (width - sz) / 2 - inset, y + sz + inset, x + width / 2, y + sz + inset);
    builder.quadTo(x + (width + sz) / 2 + inset, y + sz + inset, x + (width + sz) / 2 + inset, y + sz / 2);
    builder.stroke();

    builder.restore();
  }
}
