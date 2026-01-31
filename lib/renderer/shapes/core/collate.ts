import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * Collate shape - two triangles meeting at middle
 * Based on CollateShape from Shapes.js
 */
export class CollateHandler extends ActorShapeHandler {
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

    // Top triangle pointing down
    builder.begin();
    builder.moveTo(x, y);
    builder.lineTo(x + width, y);
    builder.lineTo(cx, cy);
    builder.close();
    builder.fillAndStroke();

    // Bottom triangle pointing up
    builder.begin();
    builder.moveTo(x, y + height);
    builder.lineTo(x + width, y + height);
    builder.lineTo(cx, cy);
    builder.close();
    builder.fillAndStroke();

    builder.restore();
  }
}
