import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * Or shape - half circle on right side
 * Based on OrShape from Shapes.js
 */
export class OrHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.moveTo(x, y);
    builder.quadTo(x + width, y, x + width, y + height / 2);
    builder.quadTo(x + width, y + height, x, y + height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
