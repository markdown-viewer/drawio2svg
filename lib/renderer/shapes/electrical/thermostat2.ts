// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalThermostat2Handler extends BaseShapeHandler {
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
    builder.moveTo(0.8 * width, 0.86 * height);
    builder.lineTo(width, 0.86 * height);
    builder.moveTo(0, 0.86 * height);
    builder.lineTo(0.2 * width, 0.86 * height);
    if ('off' == d) {
      builder.moveTo(0.28 * width, 0.82 * height);
      builder.lineTo(0.76 * width, 0.2 * height);
    } else {
      builder.moveTo(0.28 * width, 0.86 * height);
      builder.lineTo(0.72 * width, 0.85 * height);
    }
    builder.stroke();
    builder.ellipse(0.2 * width, 0.72 * height, 0.08 * width, 0.28 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.72 * height, 0.08 * width, 0.28 * height);
    builder.fillAndStroke();
    builder.text(0.5 * width, 0.2 * height, 0, 0, 'tº', 'center', 'middle', 0, 0, 0);
    builder.restore();
  }
}
