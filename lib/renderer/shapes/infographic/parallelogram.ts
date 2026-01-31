// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class InfographicParallelogramHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } =
      this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;

    builder.translate(d, y);
    d = Math.max(0, Math.min(0.5 * width, this.getStyleNumber(style, 'dx', 10)));
    builder.begin();
    builder.moveTo(0, height);
    builder.lineTo(2 * d, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width - 2 * d, height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
