// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ArrowShapeHandler } from '../../shape-registry.ts';

export class LeanMappingElectronicInfoFlowEdgeHandler extends ArrowShapeHandler {
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
    g = b / f;
    h = c / f;
    k = e.x + 0.5 * b;
    l = e.y + 0.5 * c;
    b = k - g * f * 0.1 - (h / 3) * f * 0.1;
    c = l - h * f * 0.1 + (g / 3) * f * 0.1;
    k = k + g * f * 0.1 + (h / 3) * f * 0.1;
    f = l + h * f * 0.1 - (g / 3) * f * 0.1;
    builder.begin();
    builder.moveTo(e.x, e.y);
    builder.lineTo(k, f);
    builder.lineTo(b, c);
    builder.lineTo(points.x, points.y);
    builder.stroke();
    b = points.x - b;
    c = points.y - c;
    f = Math.sqrt(b * b + c * c);
    g = b / f;
    h = c / f;
    builder.setFillColor(this.getStyleValue(style, 'strokeColor', '#000000') as string);
    builder.begin();
    builder.moveTo(points.x - 10 * g - 5 * h, points.y - 10 * h + 5 * g);
    builder.lineTo(points.x, points.y);
    builder.lineTo(points.x - 10 * g + 5 * h, points.y - 10 * h - 5 * g);
    builder.fillAndStroke();
    builder.restore();
  }
}
