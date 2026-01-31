// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalTwoWaySwitchHandler extends BaseShapeHandler {
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
    d = this.getStyleValue(style, 'elSwitchState', '1');
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.2 * width, 0.5 * height);
    builder.moveTo(0.8 * width, 0.88 * height);
    builder.lineTo(width, 0.88 * height);
    builder.moveTo(0.8 * width, 0.12 * height);
    builder.lineTo(width, 0.12 * height);
    if ('2' == d) {
      builder.moveTo(0.28 * width, 0.48 * height);
      builder.lineTo(0.72 * width, 0.15 * height);
    } else {
      builder.moveTo(0.28 * width, 0.52 * height);
      builder.lineTo(0.72 * width, 0.85 * height);
    }
    builder.stroke();
    builder.ellipse(0.72 * width, 0.77 * height, 0.08 * width, 0.23 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0, 0.08 * width, 0.23 * height);
    builder.fillAndStroke();
    builder.ellipse(0.2 * width, 0.385 * height, 0.08 * width, 0.23 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
