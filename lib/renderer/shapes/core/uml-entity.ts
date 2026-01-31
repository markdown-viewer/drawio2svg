import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler } from '../../shape-registry.ts';

/**
 * UmlEntity shape - ellipse with underline
 * Based on UmlEntityShape from Shapes.js
 */
export class UmlEntityHandler extends EllipseShapeHandler {
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

    // Draw underline
    builder.begin();
    builder.moveTo(x + width / 8, y + height);
    builder.lineTo(x + width * 7 / 8, y + height);
    builder.stroke();

    builder.restore();
  }
}
