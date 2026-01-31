// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicCone2Handler extends ActorShapeHandler {
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
    let e = y;

    builder.translate(d, e);
    d = width * Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    e = height * Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy', 0.9)));
    e = height - e;
    builder.begin();
    builder.moveTo(d, 0);
    if (0 < e) {
      builder.lineTo(width, height - e);
      builder.arcTo(0.5 * width, e, 0, 0, 1, 0.5 * width, height);
      builder.arcTo(0.5 * width, e, 0, 0, 1, 0, height - e);
    } else {
      builder.lineTo(width, height);
      builder.lineTo(0, height);
    }
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
