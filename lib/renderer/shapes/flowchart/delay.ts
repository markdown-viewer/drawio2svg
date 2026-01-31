import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class DelayHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    // Matches DelayShape.redrawPath from the platform
    const dx = Math.min(width, height / 2);

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.moveTo(x, y);
    builder.lineTo(x + width - dx, y);
    builder.quadTo(x + width, y, x + width, y + height / 2);
    builder.quadTo(x + width, y + height, x + width - dx, y + height);
    builder.lineTo(x, y + height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
