// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalPressureActuatedSwitchHandler extends BaseShapeHandler {
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
      builder.lineTo(0.5 * width, 0.74 * height);
      builder.moveTo(0.39 * width, height);
      builder.arcTo(0.11 * width, 0.26 * height, 0, 0, 1, 0.5 * width, 0.74 * height);
      builder.arcTo(0.11 * width, 0.26 * height, 0, 0, 1, 0.61 * width, height);
    } else {
      builder.moveTo(0.28 * width, 0.1 * height);
      builder.lineTo(0.72 * width, 0.1 * height);
      builder.moveTo(0.5 * width, 0.1 * height);
      builder.lineTo(0.5 * width, 0.49 * height);
      builder.moveTo(0.39 * width, 0.75 * height);
      builder.arcTo(0.11 * width, 0.26 * height, 0, 0, 1, 0.5 * width, 0.49 * height);
      builder.arcTo(0.11 * width, 0.26 * height, 0, 0, 1, 0.61 * width, 0.75 * height);
    }
    builder.close();
    builder.stroke();
    builder.ellipse(0.2 * width, 0, 0.08 * width, 0.2 * height);
    builder.stroke();
    builder.ellipse(0.72 * width, 0, 0.08 * width, 0.2 * height);
    builder.stroke();
    builder.restore();
  }
}
