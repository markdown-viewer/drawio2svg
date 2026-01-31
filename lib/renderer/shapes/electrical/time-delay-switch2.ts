// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalTimeDelaySwitch2Handler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.45 * height);
    builder.lineTo(0.23 * width, 0.45 * height);
    if ('off' == d) {
      builder.lineTo(0.75 * width, 0);
      builder.moveTo(width, 0.45 * height);
      builder.lineTo(0.8 * width, 0.45 * height);
      builder.moveTo(0.465 * width, 0.25 * height);
      builder.lineTo(0.465 * width, 0.76 * height);
      builder.moveTo(0.535 * width, 0.19 * height);
      builder.lineTo(0.535 * width, 0.76 * height);
      builder.moveTo(0.4 * width, 0.89 * height);
      builder.arcTo(0.11 * width, 0.25 * height, 0, 0, 1, 0.6 * width, 0.89 * height);
    } else {
      builder.lineTo(0.73 * width, 0.25 * height);
      builder.moveTo(width, 0.45 * height);
      builder.lineTo(0.67 * width, 0.45 * height);
      builder.lineTo(0.67 * width, 0.16 * height);
      builder.moveTo(0.465 * width, 0.36 * height);
      builder.lineTo(0.465 * width, 0.87 * height);
      builder.moveTo(0.535 * width, 0.33 * height);
      builder.lineTo(0.535 * width, 0.87 * height);
      builder.moveTo(0.4 * width, height);
      builder.arcTo(0.11 * width, 0.25 * height, 0, 0, 1, 0.6 * width, height);
    }
    builder.stroke();
    builder.restore();
  }
}
