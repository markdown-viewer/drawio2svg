// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Arrows2JumpInArrowHandler extends ActorShapeHandler {
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

    let f;
    builder.translate(d, e);
    d = Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy', 0.5)));
    e = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    f = Math.max(0, Math.min(height, this.getStyleNumber(style, 'arrowHead', 40)));
    builder.begin();
    builder.moveTo(width - e, 0);
    builder.lineTo(width, 0.5 * f);
    builder.lineTo(width - e, f);
    builder.lineTo(width - e, f / 2 + d);
    builder.arcTo(width - e, height - f / 2 - d, 0, 0, 0, 0, height);
    builder.arcTo(width - e, height - f / 2 + d, 0, 0, 1, width - e, f / 2 - d);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
