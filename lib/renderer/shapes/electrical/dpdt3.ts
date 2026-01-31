// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalDpdt3Handler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.23 * height);
    builder.lineTo(0.27 * width, 0.23 * height);
    builder.moveTo(0, 0.79 * height);
    builder.lineTo(0.27 * width, 0.79 * height);
    builder.moveTo(0.74 * width, 0.05 * height);
    builder.lineTo(width, 0.05 * height);
    builder.moveTo(0.74 * width, 0.39 * height);
    builder.lineTo(width, 0.39 * height);
    builder.moveTo(0.74 * width, 0.61 * height);
    builder.lineTo(width, 0.61 * height);
    builder.moveTo(0.74 * width, 0.95 * height);
    builder.lineTo(width, 0.95 * height);
    if ('1' == d) {
      builder.moveTo(0.37 * width, 0.215 * height);
      builder.lineTo(0.69 * width, 0.105 * height);
      builder.moveTo(0.37 * width, 0.775 * height);
      builder.lineTo(0.69 * width, 0.665 * height);
      builder.moveTo(0.515 * width, 0.17 * height);
      builder.lineTo(0.515 * width, 0.245 * height);
      builder.moveTo(0.515 * width, 0.28 * height);
      builder.lineTo(0.515 * width, 0.355 * height);
      builder.moveTo(0.515 * width, 0.39 * height);
      builder.lineTo(0.515 * width, 0.465 * height);
      builder.moveTo(0.515 * width, 0.5 * height);
      builder.lineTo(0.515 * width, 0.575 * height);
      builder.moveTo(0.515 * width, 0.61 * height);
      builder.lineTo(0.515 * width, 0.685 * height);
    } else {
      builder.moveTo(0.37 * width, 0.245 * height);
      builder.lineTo(0.69 * width, 0.335 * height);
      builder.moveTo(0.37 * width, 0.805 * height);
      builder.lineTo(0.69 * width, 0.895 * height);
      builder.moveTo(0.515 * width, 0.29 * height);
      builder.lineTo(0.515 * width, 0.365 * height);
      builder.moveTo(0.515 * width, 0.4 * height);
      builder.lineTo(0.515 * width, 0.475 * height);
      builder.moveTo(0.515 * width, 0.51 * height);
      builder.lineTo(0.515 * width, 0.585 * height);
      builder.moveTo(0.515 * width, 0.62 * height);
      builder.lineTo(0.515 * width, 0.695 * height);
      builder.moveTo(0.515 * width, 0.73 * height);
      builder.lineTo(0.515 * width, 0.805 * height);
    }
    builder.stroke();
    builder.ellipse(0.265 * width, 0.18 * height, 0.105 * width, 0.095 * height);
    builder.fillAndStroke();
    builder.ellipse(0.265 * width, 0.745 * height, 0.105 * width, 0.095 * height);
    builder.fillAndStroke();
    builder.ellipse(0.635 * width, 0, 0.105 * width, 0.095 * height);
    builder.fillAndStroke();
    builder.ellipse(0.635 * width, 0.345 * height, 0.105 * width, 0.095 * height);
    builder.fillAndStroke();
    builder.ellipse(0.635 * width, 0.56 * height, 0.105 * width, 0.095 * height);
    builder.fillAndStroke();
    builder.ellipse(0.635 * width, 0.905 * height, 0.105 * width, 0.095 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
