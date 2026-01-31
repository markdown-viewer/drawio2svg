// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalTransmissionTestPointHandler extends BaseShapeHandler {
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
    d = this.getStyleValue(style, 'strokeColor', '#000000');
    e = Math.min(width, height);
    builder.setFillColor(d as string);
    builder.begin();
    builder.ellipse(0.5 * width - e / 2, 0, e, e);
    builder.fillAndStroke();
    if (height > width) {
      builder.begin();
      builder.moveTo(0.5 * width, e);
      builder.lineTo(0.5 * width, height);
      builder.stroke();
    }
    builder.restore();
  }
}
