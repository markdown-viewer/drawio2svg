// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIPageControlHandler extends BaseShapeHandler {
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
    builder.translate(d, e);
    d = this.getStyleValue(style, 'fillColor', '#000000');
    e = this.getStyleValue(style, 'strokeColor', '#000000');
    f = Math.min(0.5 * height, 0.05 * width);
    builder.setFillColor(e as string);
    builder.ellipse(0, 0.5 * height - f, 2 * f, 2 * f);
    builder.fill();
    builder.setFillColor(d as string);
    builder.ellipse(0.35 * width - f, 0.5 * height - f, 2 * f, 2 * f);
    builder.fill();
    builder.ellipse(0.65 * width - f, 0.5 * height - f, 2 * f, 2 * f);
    builder.fill();
    builder.ellipse(width - 2 * f, 0.5 * height - f, 2 * f, 2 * f);
    builder.fill();
    builder.restore();
  }
}
