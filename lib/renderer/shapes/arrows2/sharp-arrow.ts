// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Arrows2SharpArrowHandler extends ActorShapeHandler {
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
    let k;
    let l;
    builder.translate(d, e);
    d = 0.5 * height * Math.max(0, Math.min(1, this.getStyleNumber(style, 'dy1', 0.5)));
    e = Math.max(0, Math.min(width, parseFloat(this.getStyleValue(style, 'dx1', 0.5))));
    f = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx2', 0.5)));
    g = Math.max(0, Math.min(width, this.getStyleNumber(style, 'notch', 0)));
    h = Math.max(0, Math.min(width, parseFloat(this.getStyleValue(style, 'dx1', 0.5))));
    k = 0.5 * height * Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy1', 0.5)));
    l = 0;
    if (0 != height) {
      l = h + (f * k * 2) / height;
    }
    builder.begin();
    builder.moveTo(0, d);
    builder.lineTo(width - e, d);
    builder.lineTo(width - l, 0);
    builder.lineTo(width - f, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(width - f, height);
    builder.lineTo(width - l, height);
    builder.lineTo(width - e, height - d);
    builder.lineTo(0, height - d);
    builder.lineTo(g, 0.5 * height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
