import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

/**
 * Ext shape - extended rectangle with optional double border
 * Based on ExtendedShape from Shapes.js
 */
export class ExtHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const isDouble = style.double === 1 || style.double === '1' || style.double === true;
    const strokeWidth = attrs.strokeWidth ?? 1;
    const arcSize = style.rounded ? (style.absoluteArcSize ? (Number(style.arcSize) || 0) : Math.min(width, height) * (Number(style.arcSize) || 0.1)) : 0;

    // Draw main rectangle
    if (arcSize > 0) {
      builder.roundrect(x, y, width, height, arcSize, arcSize);
    } else {
      builder.rect(x, y, width, height);
    }
    builder.fillAndStroke();

    // Draw inner rectangle if double
    if (isDouble) {
      const margin = Math.max(2, strokeWidth + 1) + (Number(style.margin) || 0);
      const innerX = x + margin;
      const innerY = y + margin;
      const innerW = width - 2 * margin;
      const innerH = height - 2 * margin;

      if (innerW > 0 && innerH > 0) {
        if (arcSize > 0) {
          const innerArc = Math.max(0, arcSize - margin);
          builder.roundrect(innerX, innerY, innerW, innerH, innerArc, innerArc);
        } else {
          builder.rect(innerX, innerY, innerW, innerH);
        }
        builder.fillAndStroke();
      }
    }

    builder.restore();
  }
}
