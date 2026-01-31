// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Arrows2TailedArrowHandler extends ActorShapeHandler {
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
    d = Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy1', this.dy1)));
    e = Math.max(0, Math.min(width, parseFloat(this.getStyleValue(style, 'dx1', this.dx1))));
    f = Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy2', this.dy2)));
    g = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx2', this.dx2)));
    h = Math.max(0, Math.min(width, this.getStyleNumber(style, 'notch', 0)));
    k = Math.max(0, Math.min(height, this.getStyleNumber(style, 'arrowHead', 0)));
    l = 0;
    if (0 != f) {
      l = g + (f * (f - d)) / f;
    }
    builder.begin();
    builder.moveTo(0, 0.5 * height - f);
    builder.lineTo(g, 0.5 * height - f);
    builder.lineTo(l, 0.5 * height - d);
    builder.lineTo(width - e, 0.5 * height - d);
    builder.lineTo(width - e, 0.5 * height - d - k);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(width - e, 0.5 * height + d + k);
    builder.lineTo(width - e, 0.5 * height + d);
    builder.lineTo(l, 0.5 * height + d);
    builder.lineTo(g, 0.5 * height + f);
    builder.lineTo(0, 0.5 * height + f);
    builder.lineTo(h, 0.5 * height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
