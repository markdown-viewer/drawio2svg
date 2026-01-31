// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalLimitSwitch2Handler extends BaseShapeHandler {
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
    builder.moveTo(0.8 * width, 0.84 * height);
    builder.lineTo(width, 0.84 * height);
    builder.moveTo(0, 0.84 * height);
    builder.lineTo(0.2 * width, 0.84 * height);
    if ('off' == d) {
      builder.moveTo(0.28 * width, 0.8 * height);
      builder.lineTo(0.76 * width, 0);
      builder.moveTo(0.46 * width, 0.5 * height);
      builder.lineTo(0.545 * width, 0.07 * height);
      builder.lineTo(0.57 * width, 0.3 * height);
    } else {
      builder.moveTo(0.28 * width, 0.84 * height);
      builder.lineTo(0.72 * width, 0.84 * height);
      builder.moveTo(0.47 * width, 0.84 * height);
      builder.lineTo(0.58 * width, 0.57 * height);
      builder.lineTo(0.58 * width, 0.84 * height);
    }
    builder.stroke();
    builder.ellipse(0.2 * width, 0.68 * height, 0.08 * width, 0.32 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.68 * height, 0.08 * width, 0.32 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
