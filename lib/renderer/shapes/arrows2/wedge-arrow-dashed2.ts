// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ArrowShapeHandler } from '../../shape-registry.ts';

export class Arrows2WedgeArrowDashed2Handler extends ArrowShapeHandler {
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
    let points = [
      { x, y: y + height / 2 },
      { x: x + width, y: y + height / 2 },
    ];

    let e;
    let b;
    let c;
    let f;
    let g;
    let h;
    let k;
    let l;
    let m;
    let n;
    let p;
    e = Math.max(0, this.getStyleNumber(style, 'startWidth', 20));
    b = Math.max(0, this.getStyleNumber(style, 'stepSize', 10));
    c = points[0];
    f = points[points.length - 1];
    points = f.x - c.x;
    f = f.y - c.y;
    g = Math.sqrt(points * points + f * f);
    h = (points * e) / g;
    e = (f * e) / g;
    k = c.x;
    c = c.y;
    l = Math.floor(g / b);
    builder.begin();
    for (m = 0; m <= l; m++) {
      b = (h * (l - m)) / l;
      g = (e * (l - m)) / l;
      if (m == l) {
        b = (h * (l - 0.98 * m)) / l;
        g = (e * (l - 0.98 * m)) / l;
      }
      n = k - g;
      p = c + b;
      builder.moveTo(k + g, c - b);
      builder.lineTo(n, p);
      k += points / l;
      c += f / l;
    }
    builder.stroke();
    builder.restore();
  }
}
