import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

/**
 * Transparent shape - invisible rectangle for click area
 * Based on TransparentShape from Shapes.js
 */
export class TransparentHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(_attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();

    // Set fill to none and draw rectangle
    builder.setFillColor('none');
    builder.setStrokeColor('none');
    builder.rect(x, y, width, height);
    builder.fill();

    builder.restore();
  }
}
