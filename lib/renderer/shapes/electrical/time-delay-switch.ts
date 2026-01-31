// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalTimeDelaySwitchHandler extends BaseShapeHandler {
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
    d = this.getStyleValue(style, 'elSwitchState', 'off');
    builder.begin();
    builder.moveTo(0, 0.13 * height);
    builder.lineTo(0.2 * width, 0.13 * height);
    builder.moveTo(0.8 * width, 0.13 * height);
    builder.lineTo(width, 0.13 * height);
    if ('off' == d) {
      builder.moveTo(0.5 * width, 0.37 * height);
      builder.lineTo(0.5 * width, 0.83 * height);
      builder.moveTo(0.28 * width, 0.16 * height);
      builder.lineTo(0.76 * width, 0.62 * height);
      builder.moveTo(0.44 * width, height);
      builder.lineTo(0.5 * width, 0.83 * height);
      builder.lineTo(0.56 * width, height);
    } else {
      builder.moveTo(0.5 * width, 0.04 * height);
      builder.lineTo(0.5 * width, 0.5 * height);
      builder.moveTo(0.28 * width, 0.09 * height);
      builder.lineTo(0.76 * width, 0);
      builder.moveTo(0.44 * width, 0.67 * height);
      builder.lineTo(0.5 * width, 0.5 * height);
      builder.lineTo(0.56 * width, 0.67 * height);
    }
    builder.stroke();
    builder.ellipse(0.2 * width, 0.03 * height, 0.08 * width, 0.19 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.03 * height, 0.08 * width, 0.19 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
