// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalSpringReturn3Handler extends BaseShapeHandler {
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
    d = this.getStyleValue(style, 'elSwitchState', 'neutral');
    builder.begin();
    builder.moveTo(0, 0.62 * height);
    builder.lineTo(0.21 * width, 0.62 * height);
    builder.stroke();
    if ('off' == d) {
      builder.begin();
      builder.moveTo(0.28 * width, 0.57 * height);
      builder.lineTo(0.76 * width, 0);
      builder.moveTo(width, 0.62 * height);
      builder.lineTo(0.625 * width, 0.62 * height);
      builder.lineTo(0.695 * width, 0.31 * height);
    } else {
      builder.begin();
      builder.moveTo(0.28 * width, 0.64 * height);
      builder.lineTo(0.76 * width, height);
      builder.moveTo(width, 0.62 * height);
      builder.lineTo(0.625 * width, 0.62 * height);
      builder.lineTo(0.695 * width, 0.93 * height);
    }
    builder.lineTo(0.765 * width, 0.62 * height);
    builder.fillAndStroke();
    builder.ellipse(0.205 * width, 0.5 * height, 0.08 * width, 0.24 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
