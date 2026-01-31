// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalSelectorSwitch4Position2Handler extends BaseShapeHandler {
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
    let e = y;

    builder.translate(d, e);
    d = this.getStyleValue(style, 'elSwitchState', '1');
    e = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.2 * width, 0.5 * height);
    builder.moveTo(0.68 * width, 0.045 * height);
    builder.lineTo(width, 0.045 * height);
    builder.moveTo(0.8 * width, 0.35 * height);
    builder.lineTo(width, 0.35 * height);
    builder.moveTo(0.8 * width, 0.65 * height);
    builder.lineTo(width, 0.65 * height);
    builder.moveTo(0.68 * width, 0.955 * height);
    builder.lineTo(width, 0.955 * height);
    builder.stroke();
    builder.ellipse(0.2 * width, 0.455 * height, 0.08 * width, 0.09 * height);
    builder.fillAndStroke();
    builder.ellipse(0.6 * width, 0, 0.08 * width, 0.09 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.305 * height, 0.08 * width, 0.09 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.605 * height, 0.08 * width, 0.09 * height);
    builder.fillAndStroke();
    builder.ellipse(0.6 * width, 0.91 * height, 0.08 * width, 0.09 * height);
    builder.fillAndStroke();
    builder.setFillColor(e as string);
    if ('1' == d) {
      builder.begin();
      builder.moveTo(0.27 * width, 0.47 * height);
      builder.lineTo(0.58 * width, 0.11 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.515 * width, 0.115 * height);
      builder.lineTo(0.61 * width, 0.08 * height);
      builder.lineTo(0.58 * width, 0.18 * height);
    } else if ('2' == d) {
      builder.begin();
      builder.moveTo(0.28 * width, 0.485 * height);
      builder.lineTo(0.69 * width, 0.37 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.62 * width, 0.34 * height);
      builder.lineTo(0.72 * width, 0.36 * height);
      builder.lineTo(0.64 * width, 0.43 * height);
    } else if ('3' == d) {
      builder.begin();
      builder.moveTo(0.28 * width, 0.515 * height);
      builder.lineTo(0.69 * width, 0.63 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.62 * width, 0.66 * height);
      builder.lineTo(0.72 * width, 0.64 * height);
      builder.lineTo(0.64 * width, 0.57 * height);
    } else {
      builder.begin();
      builder.moveTo(0.27 * width, 0.53 * height);
      builder.lineTo(0.58 * width, 0.89 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.515 * width, 0.885 * height);
      builder.lineTo(0.61 * width, 0.92 * height);
      builder.lineTo(0.58 * width, 0.82 * height);
    }
    builder.close();
    builder.fill();
    builder.restore();
  }
}
