import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

/**
 * Message shape - envelope/message icon
 * Based on MessageShape from Shapes.js
 */
export class MessageHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Draw envelope body (background)
    builder.begin();
    builder.moveTo(x, y);
    builder.lineTo(x + width, y);
    builder.lineTo(x + width, y + height);
    builder.lineTo(x, y + height);
    builder.close();
    builder.fillAndStroke();

    // Draw flap lines (foreground)
    builder.setShadow(false);
    builder.begin();
    builder.moveTo(x, y);
    builder.lineTo(x + width / 2, y + height / 2);
    builder.lineTo(x + width, y);
    builder.stroke();

    builder.restore();
  }
}
