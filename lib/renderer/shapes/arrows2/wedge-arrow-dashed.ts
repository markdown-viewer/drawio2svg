// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ArrowShapeHandler } from '../../shape-registry.ts';

export class Arrows2WedgeArrowDashedHandler extends ArrowShapeHandler {
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
    e = Math.max(0, this.getStyleNumber(style, 'startWidth', 20));
    b = points[0];
    c = points[points.length - 1];
    points = c.x - b.x;
    c = c.y - b.y;
    f = Math.sqrt(points * points + c * c);
    g = (points * e) / f;
    e = (c * e) / f;
    f = b.x;
    h = b.y;
    builder.begin();
    for (k = 0; 8 >= k; k++) {
      b = (g * (8 - k)) / 8;
      l = (e * (8 - k)) / 8;
      if (8 == k) {
        b = (g * (8 - 0.98 * k)) / 8;
        l = (e * (8 - 0.98 * k)) / 8;
      }
      m = f - l;
      n = h + b;
      builder.moveTo(f + l, h - b);
      builder.lineTo(m, n);
      f += points / 8;
      h += c / 8;
    }
    builder.stroke();
    builder.restore();
  }
}
