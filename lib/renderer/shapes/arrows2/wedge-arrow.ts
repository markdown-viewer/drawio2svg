// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ArrowShapeHandler } from '../../shape-registry.ts';

export class Arrows2WedgeArrowHandler extends ArrowShapeHandler {
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
    e = Math.max(0, this.getStyleNumber(style, 'startWidth', 20));
    b = points[0];
    points = points[points.length - 1];
    c = points.x - b.x;
    f = points.y - b.y;
    g = Math.sqrt(c * c + f * f);
    c = (c * e) / g;
    e = (f * e) / g;
    builder.begin();
    builder.moveTo(b.x + e, b.y - c);
    builder.lineTo(b.x - e, b.y + c);
    builder.lineTo(points.x, points.y);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
