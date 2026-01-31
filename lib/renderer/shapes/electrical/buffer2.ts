// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalLogicGatesBuffer2Handler extends BaseShapeHandler {
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

    builder.translate(d, y);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.2 * width, 0.5 * height);
    builder.moveTo(0.8 * width, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.2 * width, 0);
    builder.lineTo(0.8 * width, 0.5 * height);
    builder.lineTo(0.2 * width, height);
    builder.close();
    builder.fillAndStroke();
    if ('1' == this.getStyleValue(style, 'negating', '0')) {
      d = Math.min(0.04 * width, 0.07 * height);
      builder.begin();
      builder.ellipse(0.8 * width, 0.5 * height - 0.5 * d, d, d);
      builder.fillAndStroke();
    }
    builder.restore();
  }
}
