// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalManualSwitch2Handler extends BaseShapeHandler {
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
    builder.moveTo(0.8 * width, height);
    builder.lineTo(width, height);
    builder.moveTo(0, height);
    builder.lineTo(0.25 * width, height);
    if ('off' == d) {
      builder.lineTo(0.76 * width, 0.1 * height);
      builder.moveTo(0.49 * width, 0);
      builder.lineTo(0.49 * width, 0.2 * height);
      builder.moveTo(0.49 * width, 0.3 * height);
      builder.lineTo(0.49 * width, 0.55 * height);
      builder.moveTo(0.41 * width, 0);
      builder.lineTo(0.57 * width, 0);
    } else {
      builder.lineTo(0.8 * width, height);
      builder.moveTo(0.49 * width, 0.45 * height);
      builder.lineTo(0.49 * width, 0.65 * height);
      builder.moveTo(0.49 * width, 0.75 * height);
      builder.lineTo(0.49 * width, height);
      builder.moveTo(0.41 * width, 0.45 * height);
      builder.lineTo(0.57 * width, 0.45 * height);
    }
    builder.stroke();
    builder.restore();
  }
}
