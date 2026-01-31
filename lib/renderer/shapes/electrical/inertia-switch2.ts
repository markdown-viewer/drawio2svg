// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalInertiaSwitch2Handler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.85 * height);
    builder.lineTo(0.2 * width, 0.85 * height);
    builder.moveTo(0.8 * width, 0.85 * height);
    builder.lineTo(width, 0.85 * height);
    builder.stroke();
    if ('off' == d) {
      builder.begin();
      builder.moveTo(0.28 * width, 0.79 * height);
      builder.lineTo(0.76 * width, 0);
      builder.moveTo(0.493 * width, 0.45 * height);
      builder.lineTo(0.493 * width, 0.26 * height);
    } else {
      builder.begin();
      builder.moveTo(0.28 * width, 0.85 * height);
      builder.lineTo(0.76 * width, 0.85 * height);
      builder.moveTo(0.51 * width, 0.85 * height);
      builder.lineTo(0.51 * width, 0.26 * height);
    }
    builder.lineTo(0.43 * width, 0.26 * height);
    builder.stroke();
    builder.ellipse(0.35 * width, 0.1 * height, 0.08 * width, 0.3 * height);
    builder.fillAndStroke();
    builder.ellipse(0.2 * width, 0.7 * height, 0.08 * width, 0.3 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.7 * height, 0.08 * width, 0.3 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
