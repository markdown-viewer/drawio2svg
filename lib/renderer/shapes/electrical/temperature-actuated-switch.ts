// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalTemperatureActuatedSwitchHandler extends BaseShapeHandler {
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
    builder.moveTo(0.8 * width, 0.1 * height);
    builder.lineTo(width, 0.1 * height);
    builder.moveTo(0, 0.1 * height);
    builder.lineTo(0.2 * width, 0.1 * height);
    if ('off' == d) {
      builder.moveTo(0.28 * width, 0.13 * height);
      builder.lineTo(0.76 * width, 0.61 * height);
      builder.moveTo(0.5 * width, 0.35 * height);
      builder.lineTo(0.5 * width, 0.64 * height);
      builder.lineTo(0.57 * width, 0.64 * height);
      builder.lineTo(0.57 * width, 0.81 * height);
      builder.lineTo(0.5 * width, 0.81 * height);
      builder.lineTo(0.5 * width, height);
    } else {
      builder.moveTo(0.28 * width, 0.1 * height);
      builder.lineTo(0.72 * width, 0.1 * height);
      builder.moveTo(0.5 * width, 0.1 * height);
      builder.lineTo(0.5 * width, 0.39 * height);
      builder.lineTo(0.57 * width, 0.39 * height);
      builder.lineTo(0.57 * width, 0.56 * height);
      builder.lineTo(0.5 * width, 0.56 * height);
      builder.lineTo(0.5 * width, 0.75 * height);
    }
    builder.stroke();
    builder.ellipse(0.2 * width, 0, 0.08 * width, 0.2 * height);
    builder.stroke();
    builder.ellipse(0.72 * width, 0, 0.08 * width, 0.2 * height);
    builder.stroke();
    builder.restore();
  }
}
