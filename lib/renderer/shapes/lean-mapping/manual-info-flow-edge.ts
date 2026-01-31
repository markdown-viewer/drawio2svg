// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ArrowShapeHandler } from '../../shape-registry.ts';

export class LeanMappingManualInfoFlowEdgeHandler extends ArrowShapeHandler {
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
    e = points[0];
    points = points[points.length - 1];
    b = points.x - e.x;
    c = points.y - e.y;
    e.x += 0.05 * b;
    e.y += 0.05 * c;
    points.x -= 0.05 * b;
    points.y -= 0.05 * c;
    b = points.x - e.x;
    c = points.y - e.y;
    f = Math.sqrt(b * b + c * c);
    b /= f;
    c /= f;
    builder.begin();
    builder.moveTo(e.x, e.y);
    builder.lineTo(points.x, points.y);
    builder.stroke();
    builder.setFillColor(this.getStyleValue(style, 'strokeColor', '#000000') as string);
    builder.begin();
    builder.moveTo(points.x - 10 * b - 5 * c, points.y - 10 * c + 5 * b);
    builder.lineTo(points.x, points.y);
    builder.lineTo(points.x - 10 * b + 5 * c, points.y - 10 * c - 5 * b);
    builder.fillAndStroke();
    builder.restore();
  }
}
