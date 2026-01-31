// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalLimitSwitchHandler extends BaseShapeHandler {
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
    d = this.getStyleValue(style, 'elSwitchState', 'neutral');
    builder.begin();
    builder.moveTo(0, 0.16 * height);
    builder.lineTo(0.2 * width, 0.16 * height);
    builder.moveTo(0.8 * width, 0.16 * height);
    builder.lineTo(width, 0.16 * height);
    builder.stroke();
    if ('off' == d) {
      builder.begin();
      builder.moveTo(0.725 * width, 0.75 * height);
      builder.lineTo(0.24 * width, 0.16 * height);
      builder.lineTo(0.515 * width, height);
      builder.lineTo(0.69 * width, 0.72 * height);
    } else {
      builder.begin();
      builder.moveTo(0.76 * width, 0);
      builder.lineTo(0.24 * width, 0.16 * height);
      builder.lineTo(0.615 * width, 0.52 * height);
      builder.lineTo(0.72 * width, 0.02 * height);
    }
    builder.fillAndStroke();
    builder.ellipse(0.2 * width, 0.04 * height, 0.08 * width, 0.24 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.04 * height, 0.08 * width, 0.24 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
