// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIHomePageControlHandler extends BaseShapeHandler {
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

    builder.translate(d, e);
    d = this.getStyleValue(style, 'fillColor', '#000000');
    e = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setStrokeColor(e as string);
    builder.setFillColor(d as string);
    d = Math.min(0.5 * height, 0.05 * width);
    builder.ellipse(0.35 * width - d, 0.5 * height - d, 2 * d, 2 * d);
    builder.fill();
    builder.ellipse(0.65 * width - d, 0.5 * height - d, 2 * d, 2 * d);
    builder.fill();
    builder.ellipse(width - 2 * d, 0.5 * height - d, 2 * d, 2 * d);
    builder.fill();
    builder.ellipse(0.2 * d, 0.5 * height - 0.8 * d, 1.2 * d, 1.2 * d);
    builder.stroke();
    builder.begin();
    builder.moveTo(1.15 * d, 0.5 * height + 0.25 * d);
    builder.lineTo(1.6 * d, 0.5 * height + 0.8 * d);
    builder.stroke();
    builder.restore();
  }
}
