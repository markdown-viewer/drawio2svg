// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicBendingArchHandler extends ActorShapeHandler {
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
    let q;
    let t;
    let u;
    let v;
    let r;
    builder.translate(d, e);
    f = 2 * Math.PI * Math.max(0, Math.min(1, this.getStyleNumber(style, 'startAngle', 0.25)));
    g = 2 * Math.PI * Math.max(0, Math.min(1, this.getStyleNumber(style, 'endAngle', 0.75)));
    h = 1 - Math.max(0, Math.min(1, this.getStyleNumber(style, 'arcWidth', 0.5)));
    d = 0.5 * width;
    e = 0.5 * height;
    k = d * h;
    h *= e;
    l = d + Math.sin(f) * d;
    m = e - Math.cos(f) * e;
    n = d + Math.sin(f) * k;
    p = e - Math.cos(f) * h;
    q = d + Math.sin(g) * d;
    t = e - Math.cos(g) * e;
    u = d + Math.sin(g) * k;
    v = e - Math.cos(g) * h;
    g -= f;
    if (0 > g) {
      g += 2 * Math.PI;
    }
    f = 0;
    if (g > Math.PI) {
      f = 1;
    }
    g = k - 5;
    r = h - 5;
    builder.ellipse(0.5 * width - g, 0.5 * height - r, 2 * g, 2 * r);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(l, m);
    builder.arcTo(d, e, 0, f, 1, q, t);
    builder.lineTo(u, v);
    builder.arcTo(k, h, 0, f, 0, n, p);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
