import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler } from '../../shape-registry.ts';

/**
 * SumEllipse shape - ellipse with X inside
 * Based on SumEllipseShape from Shapes.js
 */
export class SumEllipseHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const s2 = 0.145;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Draw ellipse
    builder.ellipse(x, y, width, height);
    builder.fillAndStroke();

    // Draw X inside (no shadow)
    builder.begin();
    builder.moveTo(x + width * s2, y + height * s2);
    builder.lineTo(x + width * (1 - s2), y + height * (1 - s2));
    builder.stroke();

    builder.begin();
    builder.moveTo(x + width * (1 - s2), y + height * s2);
    builder.lineTo(x + width * s2, y + height * (1 - s2));
    builder.stroke();

    builder.restore();
  }
}
