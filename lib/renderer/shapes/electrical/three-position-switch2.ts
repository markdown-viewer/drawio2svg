// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalThreePositionSwitch2Handler extends BaseShapeHandler {
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
    builder.moveTo(0.5 * width, 0);
    builder.lineTo(0.5 * width, 0.2 * height);
    builder.moveTo(0, height);
    builder.lineTo(0.215 * width, 0.825 * height);
    builder.moveTo(width, height);
    builder.lineTo(0.785 * width, 0.825 * height);
    builder.moveTo(0.12 * width, 0.62 * height);
    builder.arcTo(0.38 * width, 0.38 * height, 0, 0, 1, 0.31 * width, 0.26 * height);
    if ('1' == d) {
      builder.moveTo(0.5 * width, 0.26 * height);
      builder.arcTo(0.65 * width, 0.65 * height, 0, 0, 1, 0.25 * width, 0.79 * height);
    } else if ('2' == d) {
      builder.moveTo(0.5 * width, 0.26 * height);
      builder.arcTo(0.65 * width, 0.65 * height, 0, 0, 0, 0.75 * width, 0.79 * height);
    } else {
      builder.moveTo(0.25 * width, 0.79 * height);
      builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 1, 0.75 * width, 0.79 * height);
    }
    builder.stroke();
    builder.ellipse(0.2 * width, 0.74 * height, 0.1 * width, 0.1 * height);
    builder.fillAndStroke();
    builder.ellipse(0.45 * width, 0.21 * height, 0.1 * width, 0.1 * height);
    builder.fillAndStroke();
    builder.ellipse(0.7 * width, 0.74 * height, 0.1 * width, 0.1 * height);
    builder.fillAndStroke();
    d = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(d as string);
    builder.begin();
    builder.moveTo(0.285 * width, 0.215 * height);
    builder.lineTo(0.39 * width, 0.2 * height);
    builder.lineTo(0.345 * width, 0.295 * height);
    builder.close();
    builder.moveTo(0.07 * width, 0.63 * height);
    builder.lineTo(0.18 * width, 0.61 * height);
    builder.lineTo(0.14 * width, 0.71 * height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
