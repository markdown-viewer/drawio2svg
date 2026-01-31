import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler } from '../../shape-registry.ts';

/**
 * OrEllipse shape - ellipse with + inside
 * Based on OrEllipseShape from Shapes.js
 */
export class OrEllipseHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Draw ellipse
    builder.ellipse(x, y, width, height);
    builder.fillAndStroke();

    // Draw + inside (no shadow)
    builder.begin();
    builder.moveTo(x, y + height / 2);
    builder.lineTo(x + width, y + height / 2);
    builder.stroke();

    builder.begin();
    builder.moveTo(x + width / 2, y);
    builder.lineTo(x + width / 2, y + height);
    builder.stroke();

    builder.restore();
  }
}
