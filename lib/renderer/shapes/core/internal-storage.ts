import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

/**
 * InternalStorage shape - rectangle with dividing lines
 * Based on InternalStorageShape from Shapes.js
 */
export class InternalStorageHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const isRounded = attrs.rounded;
    let inset = 0;

    if (isRounded) {
      const f = (parseFloat(style.arcSize as string) || 15) / 100;
      inset = Math.max(inset, Math.min(width * f, height * f));
    }

    const dx = Math.max(inset, Math.min(width, parseFloat(style.dx as string) || 15));
    const dy = Math.max(inset, Math.min(height, parseFloat(style.dy as string) || 15));

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Draw rectangle (background)
    if (isRounded) {
      const arcSize = (parseFloat(style.arcSize as string) || 15) / 100;
      const r = Math.min(width * arcSize, height * arcSize);
      builder.roundrect(x, y, width, height, r, r);
    } else {
      builder.rect(x, y, width, height);
    }
    builder.fillAndStroke();

    // Draw horizontal dividing line
    builder.begin();
    builder.moveTo(x, y + dy);
    builder.lineTo(x + width, y + dy);
    builder.stroke();

    // Draw vertical dividing line
    builder.begin();
    builder.moveTo(x + dx, y);
    builder.lineTo(x + dx, y + height);
    builder.stroke();

    builder.restore();
  }
}
