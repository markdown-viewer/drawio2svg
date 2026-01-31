import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class ActorHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const wThird = width / 3;
    const midX = x + width / 2;
    const topY = y;
    const midY = y + (2 * height) / 5;
    const lowY = y + (3 * height) / 5;
    const bottomY = y + height;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.moveTo(x, bottomY);
    builder.curveTo(x, lowY, x, midY, midX, midY);
    builder.curveTo(midX - wThird, midY, midX - wThird, topY, midX, topY);
    builder.curveTo(midX + wThird, topY, midX + wThird, midY, midX, midY);
    builder.curveTo(x + width, midY, x + width, lowY, x + width, bottomY);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
