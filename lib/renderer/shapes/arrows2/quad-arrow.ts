// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Arrows2QuadArrowHandler extends ActorShapeHandler {
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
    f = Math.max(0, Math.min(height, this.getStyleNumber(style, 'arrowHead', 0)));
    builder.begin();
    builder.moveTo(0.5 * width + d, 0.5 * height - d);
    builder.lineTo(width - e, 0.5 * height - d);
    builder.lineTo(width - e, 0.5 * height - d - f);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(width - e, 0.5 * height + d + f);
    builder.lineTo(width - e, 0.5 * height + d);
    builder.lineTo(0.5 * width + d, 0.5 * height + d);
    builder.lineTo(0.5 * width + d, height - e);
    builder.lineTo(0.5 * width + d + f, height - e);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0.5 * width - d - f, height - e);
    builder.lineTo(0.5 * width - d, height - e);
    builder.lineTo(0.5 * width - d, 0.5 * height + d);
    builder.lineTo(e, 0.5 * height + d);
    builder.lineTo(e, 0.5 * height + d + f);
    builder.lineTo(0, 0.5 * height);
    builder.lineTo(e, 0.5 * height - d - f);
    builder.lineTo(e, 0.5 * height - d);
    builder.lineTo(0.5 * width - d, 0.5 * height - d);
    builder.lineTo(0.5 * width - d, e);
    builder.lineTo(0.5 * width - d - f, e);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(0.5 * width + d + f, e);
    builder.lineTo(0.5 * width + d, e);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
