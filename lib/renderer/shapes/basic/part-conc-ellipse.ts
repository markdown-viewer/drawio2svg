// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicPartConcEllipseHandler extends ActorShapeHandler {
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
    let b = width;
    let c = height;

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
    builder.translate(d, e);
    f = 2 * Math.PI * Math.max(0, Math.min(1, this.getStyleNumber(style, 'startAngle', 0.25)));
    d = 2 * Math.PI * Math.max(0, Math.min(1, this.getStyleNumber(style, 'endAngle', 0.75)));
    g = 1 - Math.max(0, Math.min(1, this.getStyleNumber(style, 'arcWidth', 0.5)));
    b *= 0.5;
    c *= 0.5;
    e = b * g;
    g *= c;
    h = d - f;
    if (0 > h) {
      h += 2 * Math.PI;
    } else if (h == Math.PI) {
      d += 0.00001;
    }
    k = b + Math.sin(f) * b;
    l = c - Math.cos(f) * c;
    m = b + Math.sin(f) * e;
    f = c - Math.cos(f) * g;
    n = b + Math.sin(d) * b;
    p = c - Math.cos(d) * c;
    q = b + Math.sin(d) * e;
    d = c - Math.cos(d) * g;
    t = 0;
    if (h >= Math.PI) {
      t = 1;
    }
    builder.begin();
    builder.moveTo(k, l);
    builder.arcTo(b, c, 0, t, 1, n, p);
    builder.lineTo(q, d);
    builder.arcTo(e, g, 0, t, 0, m, f);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
