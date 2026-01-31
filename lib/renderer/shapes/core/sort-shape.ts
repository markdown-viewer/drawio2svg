import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RhombusShapeHandler } from '../../shape-registry.ts';

/**
 * SortShape - rhombus with horizontal line through middle
 * Based on SortShape from Shapes.js
 */
export class SortShapeHandler extends RhombusShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const cx = x + width / 2;
    const cy = y + height / 2;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Draw rhombus
    builder.begin();
    builder.moveTo(cx, y);
    builder.lineTo(x + width, cy);
    builder.lineTo(cx, y + height);
    builder.lineTo(x, cy);
    builder.close();
    builder.fillAndStroke();

    // Draw horizontal line through middle (no shadow)
    builder.begin();
    builder.moveTo(x, cy);
    builder.lineTo(x + width, cy);
    builder.stroke();

    builder.restore();
  }
}
