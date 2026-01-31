// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalPushbuttonTwoCircuitSwitch2Handler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.68 * height);
    builder.lineTo(0.2 * width, 0.68 * height);
    builder.moveTo(0.8 * width, 0.68 * height);
    builder.lineTo(width, 0.68 * height);
    builder.moveTo(0, 0.96 * height);
    builder.lineTo(0.2 * width, 0.96 * height);
    builder.moveTo(0.8 * width, 0.96 * height);
    builder.lineTo(width, 0.96 * height);
    if ('1' == d) {
      builder.moveTo(0.5 * width, 0);
      builder.lineTo(0.5 * width, 0.73 * height);
      builder.moveTo(0.24 * width, 0.73 * height);
      builder.lineTo(0.76 * width, 0.73 * height);
    } else {
      builder.moveTo(0.5 * width, 0.18 * height);
      builder.lineTo(0.5 * width, 0.91 * height);
      builder.moveTo(0.24 * width, 0.91 * height);
      builder.lineTo(0.76 * width, 0.91 * height);
    }
    builder.stroke();
    builder.ellipse(0.2 * width, 0.92 * height, 0.08 * width, 0.08 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.92 * height, 0.08 * width, 0.08 * height);
    builder.fillAndStroke();
    builder.ellipse(0.2 * width, 0.64 * height, 0.08 * width, 0.08 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.64 * height, 0.08 * width, 0.08 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
