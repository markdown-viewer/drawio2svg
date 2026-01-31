// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicPieHandler extends ActorShapeHandler {
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
    let m;
    let n;
    let p;
    builder.translate(d, e);
    f = Math.max(0, Math.min(1, this.getStyleNumber(style, 'startAngle', 0.25)));
    g = Math.max(0, Math.min(1, this.getStyleNumber(style, 'endAngle', 0.75)));
    h = 2 * Math.PI * f;
    k = 2 * Math.PI * g;
    d = 0.5 * width;
    e = 0.5 * height;
    l = d + Math.sin(h) * d;
    m = e - Math.cos(h) * e;
    n = d + Math.sin(k) * d;
    p = e - Math.cos(k) * e;
    k -= h;
    if (0 > k) {
      k += 2 * Math.PI;
    }
    h = 0;
    if (k >= Math.PI) {
      h = 1;
    }
    builder.begin();
    f %= 1;
    g %= 1;
    if (0 == f && 0.5 == g) {
      builder.moveTo(d, e);
      builder.lineTo(l, m);
      builder.arcTo(d, e, 0, 0, 1, width, 0.5 * height);
      builder.arcTo(d, e, 0, 0, 1, 0.5 * width, height);
    } else if (0.5 == f && 0 == g) {
      builder.moveTo(d, e);
      builder.lineTo(l, m);
      builder.arcTo(d, e, 0, 0, 1, 0, 0.5 * height);
      builder.arcTo(d, e, 0, 0, 1, 0.5 * width, 0);
    } else {
      builder.moveTo(d, e);
      builder.lineTo(l, m);
      builder.arcTo(d, e, 0, h, 1, n, p);
    }
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
