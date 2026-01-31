// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalDpst2Handler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.4 * height);
    builder.lineTo(0.2 * width, 0.4 * height);
    builder.moveTo(0.8 * width, 0.4 * height);
    builder.lineTo(width, 0.4 * height);
    builder.moveTo(0, 0.92 * height);
    builder.lineTo(0.2 * width, 0.92 * height);
    builder.moveTo(0.8 * width, 0.92 * height);
    builder.lineTo(width, 0.92 * height);
    if ('off' == d) {
      builder.moveTo(0.28 * width, 0.38 * height);
      builder.lineTo(0.76 * width, 0);
      builder.moveTo(0.28 * width, 0.9 * height);
      builder.lineTo(0.76 * width, 0.52 * height);
      builder.moveTo(0.5 * width, 0.2 * height);
      builder.lineTo(0.5 * width, 0.33 * height);
      builder.moveTo(0.5 * width, 0.38 * height);
      builder.lineTo(0.5 * width, 0.51 * height);
      builder.moveTo(0.5 * width, 0.56 * height);
      builder.lineTo(0.5 * width, 0.69 * height);
    } else {
      builder.moveTo(0.28 * width, 0.4 * height);
      builder.lineTo(0.72 * width, 0.4 * height);
      builder.moveTo(0.28 * width, 0.92 * height);
      builder.lineTo(0.72 * width, 0.92 * height);
      builder.moveTo(0.5 * width, 0.4 * height);
      builder.lineTo(0.5 * width, 0.53 * height);
      builder.moveTo(0.5 * width, 0.58 * height);
      builder.lineTo(0.5 * width, 0.71 * height);
      builder.moveTo(0.5 * width, 0.76 * height);
      builder.lineTo(0.5 * width, 0.89 * height);
    }
    builder.stroke();
    builder.ellipse(0.2 * width, 0.325 * height, 0.08 * width, 0.15 * height);
    builder.fillAndStroke();
    builder.ellipse(0.2 * width, 0.845 * height, 0.08 * width, 0.15 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.325 * height, 0.08 * width, 0.15 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.845 * height, 0.08 * width, 0.15 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
