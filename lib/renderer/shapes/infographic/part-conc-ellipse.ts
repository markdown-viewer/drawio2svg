// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class InfographicPartConcEllipseHandler extends ActorShapeHandler {
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
    l = e * h;
    m = g - f;
    if (0 > m) {
      m += 2 * Math.PI;
    } else if (m == Math.PI) {
      g += 0.00001;
    }
    n = d + Math.sin(f) * d;
    p = e - Math.cos(f) * e;
    q = d + Math.sin(f) * k;
    f = e - Math.cos(f) * l;
    t = d + Math.sin(g) * d;
    u = e - Math.cos(g) * e;
    v = d + Math.sin(g) * k;
    g = e - Math.cos(g) * l;
    r = 0;
    if (m <= Math.PI) {
      r = 1;
    }
    builder.begin();
    builder.moveTo(d, 0);
    builder.arcTo(d, e, 0, 0, 1, width, e);
    builder.arcTo(d, e, 0, 0, 1, d, height);
    builder.arcTo(d, e, 0, 0, 1, 0, e);
    builder.arcTo(d, e, 0, 0, 1, d, 0);
    builder.close();
    builder.moveTo(d, 0.5 * height - l);
    builder.arcTo(k, l, 0, 0, 0, 0.5 * width - k, e);
    builder.arcTo(k, l, 0, 0, 0, d, 0.5 * height + l);
    builder.arcTo(k, l, 0, 0, 0, 0.5 * width + k, e);
    builder.arcTo(k, l, 0, 0, 0, d, 0.5 * height - l);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFillAlpha('0.2');
    builder.setFillColor('#ffffff' as string);
    builder.begin();
    builder.moveTo(n, p);
    builder.arcTo(d, e, 0, r, 0, t, u);
    builder.lineTo(v, g);
    builder.arcTo(k, l, 0, r, 1, q, f);
    builder.close();
    builder.fill();
    d = 0.5 * width;
    e = 0.5 * height;
    k = d * h;
    l = e * h;
    h = k + 0.25 * (d - k);
    m = l + 0.25 * (e - l);
    builder.setFillColor('#000000' as string);
    builder.begin();
    builder.moveTo(d, 0.5 * height - l);
    builder.arcTo(k, l, 0, 0, 1, 0.5 * width + k, e);
    builder.arcTo(k, l, 0, 0, 1, d, 0.5 * height + l);
    builder.arcTo(k, l, 0, 0, 1, 0.5 * width - k, e);
    builder.arcTo(k, l, 0, 0, 1, d, 0.5 * height - l);
    builder.close();
    builder.moveTo(d, 0.5 * height - m);
    builder.arcTo(h, m, 0, 0, 0, 0.5 * width - h, e);
    builder.arcTo(h, m, 0, 0, 0, d, 0.5 * height + m);
    builder.arcTo(h, m, 0, 0, 0, 0.5 * width + h, e);
    builder.arcTo(h, m, 0, 0, 0, d, 0.5 * height - m);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
