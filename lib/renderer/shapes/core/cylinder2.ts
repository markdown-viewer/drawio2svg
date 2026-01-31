import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { CylinderShapeHandler } from '../../shape-registry.ts';

/**
 * Cylinder2 shape - flexible cylinder with adjustable cap size
 * Based on CylinderShape from Shapes.js
 */
export class Cylinder2Handler extends CylinderShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const defaultSize = 15;
    const size = Math.max(0, Math.min(height * 0.5, Number(style.size) || defaultSize));

    if (size === 0) {
      builder.rect(x, y, width, height);
      builder.fillAndStroke();
    } else {
      // Main body with elliptical caps
      builder.begin();
      builder.moveTo(x, y + size);
      builder.arcTo(width * 0.5, size, 0, 0, 1, x + width * 0.5, y);
      builder.arcTo(width * 0.5, size, 0, 0, 1, x + width, y + size);
      builder.lineTo(x + width, y + height - size);
      builder.arcTo(width * 0.5, size, 0, 0, 1, x + width * 0.5, y + height);
      builder.arcTo(width * 0.5, size, 0, 0, 1, x, y + height - size);
      builder.close();
      builder.fillAndStroke();

      // Inner ellipse line (top cap)
      builder.setShadow(false);
      builder.begin();
      builder.moveTo(x + width, y + size);
      builder.arcTo(width * 0.5, size, 0, 0, 1, x + width * 0.5, y + 2 * size);
      builder.arcTo(width * 0.5, size, 0, 0, 1, x, y + size);
      builder.stroke();
    }

    builder.restore();
  }
}
