// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Arrows2TwoWayArrowHandler extends ActorShapeHandler {
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
    d = 0.5 * height * Math.max(0, Math.min(1, this.getStyleNumber(style, 'dy', 0.5)));
    e = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    builder.begin();
    builder.moveTo(e, d);
    builder.lineTo(width - e, d);
    builder.lineTo(width - e, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(width - e, height);
    builder.lineTo(width - e, height - d);
    builder.lineTo(e, height - d);
    builder.lineTo(e, height);
    builder.lineTo(0, 0.5 * height);
    builder.lineTo(e, 0);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
