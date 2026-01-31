// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Arrows2ArrowHandler extends ActorShapeHandler {
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
    let g;
    let h;
    builder.translate(d, e);
    d = 0.5 * height * Math.max(0, Math.min(1, this.getStyleNumber(style, 'dy', 0.5)));
    e = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    f = Math.max(0, Math.min(width, this.getStyleNumber(style, 'notch', 0)));
    g = this.getStyleValue(style, 'headCrossline', !1);
    h = this.getStyleValue(style, 'tailCrossline', !1);
    builder.begin();
    builder.moveTo(0, d);
    builder.lineTo(width - e, d);
    builder.lineTo(width - e, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(width - e, height);
    builder.lineTo(width - e, height - d);
    builder.lineTo(0, height - d);
    builder.lineTo(f, 0.5 * height);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    if (g) {
      builder.begin();
      builder.moveTo(width - e, d);
      builder.lineTo(width - e, height - d);
      builder.stroke();
    }
    if (h) {
      builder.begin();
      builder.moveTo(f, d);
      builder.lineTo(f, height - d);
      builder.stroke();
    }
    builder.restore();
  }
}
