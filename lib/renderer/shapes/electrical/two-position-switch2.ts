// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalTwoPositionSwitch2Handler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.2 * width, 0.5 * height);
    builder.moveTo(0.8 * width, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.moveTo(0.5 * width, 0);
    builder.lineTo(0.5 * width, 0.18 * height);
    builder.moveTo(0.5 * width, 0.82 * height);
    builder.lineTo(0.5 * width, height);
    builder.moveTo(0.63 * width, 0.145 * height);
    builder.arcTo(0.2 * width, 0.22 * height, 0, 0, 1, 0.835 * width, 0.36 * height);
    if ('1' == d) {
      builder.moveTo(0.24 * width, 0.5 * height);
      builder.arcTo(0.27 * width, 0.27 * height, 0, 0, 1, 0.5 * width, 0.78 * height);
      builder.moveTo(0.76 * width, 0.5 * height);
      builder.arcTo(0.27 * width, 0.27 * height, 0, 0, 1, 0.5 * width, 0.22 * height);
      builder.moveTo(0.39 * width, 0.56 * height);
      builder.lineTo(0.55 * width, 0.39 * height);
      builder.moveTo(0.39 * width, 0.56 * height);
      builder.lineTo(0.55 * width, 0.39 * height);
      builder.moveTo(0.61 * width, 0.44 * height);
      builder.lineTo(0.45 * width, 0.61 * height);
      builder.moveTo(0.61 * width, 0.44 * height);
      builder.lineTo(0.45 * width, 0.61 * height);
    } else {
      builder.moveTo(0.76 * width, 0.5 * height);
      builder.arcTo(0.27 * width, 0.27 * height, 0, 0, 0, 0.5 * width, 0.78 * height);
      builder.moveTo(0.24 * width, 0.5 * height);
      builder.arcTo(0.27 * width, 0.27 * height, 0, 0, 0, 0.5 * width, 0.22 * height);
      builder.moveTo(0.61 * width, 0.56 * height);
      builder.lineTo(0.45 * width, 0.39 * height);
      builder.moveTo(0.61 * width, 0.56 * height);
      builder.lineTo(0.45 * width, 0.39 * height);
      builder.moveTo(0.39 * width, 0.44 * height);
      builder.lineTo(0.55 * width, 0.61 * height);
      builder.moveTo(0.39 * width, 0.44 * height);
      builder.lineTo(0.55 * width, 0.61 * height);
    }
    builder.stroke();
    builder.ellipse(0.2 * width, 0.4575 * height, 0.08 * width, 0.085 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.4575 * height, 0.08 * width, 0.085 * height);
    builder.fillAndStroke();
    builder.ellipse(0.46 * width, 0.18 * height, 0.08 * width, 0.085 * height);
    builder.fillAndStroke();
    builder.ellipse(0.46 * width, 0.735 * height, 0.08 * width, 0.085 * height);
    builder.fillAndStroke();
    d = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(d as string);
    builder.begin();
    builder.moveTo(0.633 * width, 0.1 * height);
    builder.lineTo(0.633 * width, 0.185 * height);
    builder.lineTo(0.56 * width, 0.1425 * height);
    builder.close();
    builder.moveTo(0.795 * width, 0.355 * height);
    builder.lineTo(0.875 * width, 0.355 * height);
    builder.lineTo(0.835 * width, 0.435 * height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
