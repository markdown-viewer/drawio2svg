// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalProximityLimitSwitch2Handler extends BaseShapeHandler {
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
    d = this.getStyleValue(style, 'elSwitchState', 'on');
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.2 * width, 0.5 * height);
    builder.moveTo(0.8 * width, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.moveTo(0.13 * width, 0.5 * height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(0.87 * width, 0.5 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
    if ('off' == d) {
      builder.begin();
      builder.moveTo(0.755 * width, 0.355 * height);
      builder.lineTo(0.22 * width, 0.5 * height);
      builder.lineTo(0.625 * width, 0.61 * height);
      builder.lineTo(0.72 * width, 0.36 * height);
    } else {
      builder.begin();
      builder.moveTo(0.76 * width, 0.43 * height);
      builder.lineTo(0.235 * width, 0.5 * height);
      builder.lineTo(0.615 * width, 0.66 * height);
      builder.lineTo(0.72 * width, 0.44 * height);
    }
    builder.stroke();
    builder.ellipse(0.2 * width, 0.445 * height, 0.08 * width, 0.11 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.445 * height, 0.08 * width, 0.11 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
