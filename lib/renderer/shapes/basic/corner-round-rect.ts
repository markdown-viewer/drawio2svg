// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicCornerRoundRectHandler extends ActorShapeHandler {
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
    d = 2 * Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    d = Math.min(0.5 * width, 0.5 * height, d);
    builder.begin();
    builder.moveTo(d, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.lineTo(0, d);
    builder.arcTo(d, d, 0, 0, 1, d, 0);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
