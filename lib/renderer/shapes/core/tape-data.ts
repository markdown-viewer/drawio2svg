import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler } from '../../shape-registry.ts';

/**
 * TapeData shape - ellipse with a tail line (tape/magnetic storage)
 * Based on TapeDataShape from Shapes.js
 */
export class TapeDataHandler extends EllipseShapeHandler {
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

    // Draw tail line
    builder.begin();
    builder.moveTo(x + width / 2, y + height);
    builder.lineTo(x + width, y + height);
    builder.stroke();

    builder.restore();
  }
}
