// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalLiquidLevelActuatedSwitch2Handler extends BaseShapeHandler {
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
    builder.moveTo(0.76 * width, height);
    builder.lineTo(width, height);
    builder.moveTo(0, height);
    builder.lineTo(0.24 * width, height);
    if ('off' == d) {
      builder.lineTo(0.76 * width, 0.5 * height);
      builder.moveTo(0.42 * width, 0);
      builder.lineTo(0.58 * width, 0);
      builder.lineTo(0.58 * width, 0.4 * height);
      builder.lineTo(0.42 * width, 0.4 * height);
      builder.close();
      builder.moveTo(0.46 * width, 0.22 * height);
      builder.arcTo(0.05 * width, 0.1 * height, 0, 0, 1, 0.54 * width, 0.22 * height);
      builder.arcTo(0.05 * width, 0.1 * height, 0, 0, 1, 0.46 * width, 0.22 * height);
      builder.close();
      builder.moveTo(0.5 * width, 0.1 * height);
      builder.lineTo(0.5 * width, 0.17 * height);
      builder.moveTo(0.5 * width, 0.4 * height);
      builder.lineTo(0.5 * width, 0.55 * height);
      builder.moveTo(0.5 * width, 0.63 * height);
      builder.lineTo(0.5 * width, 0.75 * height);
    } else {
      builder.lineTo(0.76 * width, height);
      builder.moveTo(0.42 * width, 0.25 * height);
      builder.lineTo(0.58 * width, 0.25 * height);
      builder.lineTo(0.58 * width, 0.65 * height);
      builder.lineTo(0.42 * width, 0.65 * height);
      builder.close();
      builder.moveTo(0.46 * width, 0.47 * height);
      builder.arcTo(0.05 * width, 0.1 * height, 0, 0, 1, 0.54 * width, 0.47 * height);
      builder.arcTo(0.05 * width, 0.1 * height, 0, 0, 1, 0.46 * width, 0.47 * height);
      builder.close();
      builder.moveTo(0.5 * width, 0.35 * height);
      builder.lineTo(0.5 * width, 0.42 * height);
      builder.moveTo(0.5 * width, 0.65 * height);
      builder.lineTo(0.5 * width, 0.8 * height);
      builder.moveTo(0.5 * width, 0.88 * height);
      builder.lineTo(0.5 * width, height);
      builder.stroke();
    }
    builder.stroke();
    builder.restore();
  }
}
