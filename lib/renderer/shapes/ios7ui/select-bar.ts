// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Ios7uiSelectBarHandler extends ActorShapeHandler {
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
    builder.translate(d, e);
    f = Math.max(0, Math.min(b, this.getStyleNumber(style, 'dx', 0.5)));
    d = Math.max(0, Math.min(b, this.getStyleNumber(style, 'dx2', 70)));
    e = Math.max(0, Math.min(c, this.getStyleNumber(style, 'size', 10)));
    g = Math.max(
      0,
      Math.min(c, (b - Math.max(20, e) - e) / 2, this.getStyleNumber(style, 'dy', 0.5))
    );
    e = Math.min(c / 2, b / 2, e);
    f = Math.max(e + g, f);
    f = Math.min(b - e - g, b - 20 - g, f);
    builder.begin();
    builder.moveTo(f - g, c);
    builder.lineTo(e, c);
    builder.arcTo(e, e, 0, 0, 1, 0, c - e);
    builder.lineTo(0, e);
    builder.arcTo(e, e, 0, 0, 1, e, 0);
    builder.lineTo(b - e, 0);
    builder.arcTo(e, e, 0, 0, 1, b, e);
    builder.lineTo(b, c - e);
    builder.arcTo(e, e, 0, 0, 1, b - e, c);
    builder.lineTo(f + g, c);
    builder.lineTo(f, c + g);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(b - Math.max(20, e), 0);
    builder.lineTo(b - Math.max(20, e), c);
    builder.stroke();
    f = d;
    for (builder.begin(); f < b - Math.max(20, e); ) {
      builder.moveTo(f, 0);
      builder.lineTo(f, c);
      f += d;
    }
    builder.stroke();
    d = Math.min(Math.max(20, e), c);
    b -= 0.5 * d;
    c *= 0.5;
    builder.setFillColor(this.getStyleValue(style, 'strokeColor', '') as string);
    builder.begin();
    builder.moveTo(b - 0.15 * d, c - 0.225 * d);
    builder.lineTo(b + 0.25 * d, c);
    builder.lineTo(b - 0.15 * d, c + 0.225 * d);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
