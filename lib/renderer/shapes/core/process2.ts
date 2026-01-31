import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

/**
 * Process2 shape - rectangle with vertical lines on left and right
 * Based on ProcessShape from Shapes.js
 */
export class Process2Handler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const isFixedSize = style.fixedSize === '1' || style.fixedSize === 1;
    const isRounded = attrs.rounded;
    let inset = parseFloat(style.size as string) || 0.1;

    if (isFixedSize) {
      inset = Math.max(0, Math.min(width, inset));
    } else {
      inset = width * Math.max(0, Math.min(1, inset));
    }

    if (isRounded) {
      const f = (parseFloat(style.arcSize as string) || 15) / 100;
      inset = Math.max(inset, Math.min(width * f, height * f));
    }

    // Crisp rendering
    inset = Math.round(inset);

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

    // Draw vertical lines
    builder.begin();
    builder.moveTo(x + inset, y);
    builder.lineTo(x + inset, y + height);
    builder.moveTo(x + width - inset, y);
    builder.lineTo(x + width - inset, y + height);
    builder.stroke();

    builder.restore();
  }
}
