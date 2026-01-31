import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * Xor shape - or shape with curved left side
 * Based on XorShape from Shapes.js
 */
export class XorHandler extends ActorShapeHandler {
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
    builder.quadTo(x + width / 2, y + height / 2, x, y);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
