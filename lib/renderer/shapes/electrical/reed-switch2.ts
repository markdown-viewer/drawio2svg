// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalReedSwitch2Handler extends BaseShapeHandler {
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
    builder.moveTo(0.69 * width, 0);
    builder.arcTo(0.13 * width, 0.5 * height, 0, 0, 1, 0.82 * width, 0.5 * height);
    builder.arcTo(0.13 * width, 0.5 * height, 0, 0, 1, 0.69 * width, height);
    builder.lineTo(0.31 * width, height);
    builder.arcTo(0.13 * width, 0.5 * height, 0, 0, 1, 0.18 * width, 0.5 * height);
    builder.arcTo(0.13 * width, 0.5 * height, 0, 0, 1, 0.31 * width, 0);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(width, 0.5 * height);
    builder.lineTo(0.65 * width, 0.5 * height);
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.35 * width, 0.5 * height);
    if ('on' == d) {
      builder.lineTo(0.65 * width, 0.5 * height);
    } else {
      builder.lineTo(0.65 * width, 0.25 * height);
    }
    builder.stroke();
    builder.restore();
  }
}
