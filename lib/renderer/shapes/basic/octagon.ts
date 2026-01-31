import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicOctagonHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const ratio = 29 / 98;
    const cutX = Math.min(width / 2, width * ratio);
    const cutY = Math.min(height / 2, height * ratio);
    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.addPoints(
      [
        { x, y: y + cutY },
        { x: x + cutX, y },
        { x: x + width - cutX, y },
        { x: x + width, y: y + cutY },
        { x: x + width, y: y + height - cutY },
        { x: x + width - cutX, y: y + height },
        { x: x + cutX, y: y + height },
        { x, y: y + height - cutY }
      ],
      false,
      0,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
