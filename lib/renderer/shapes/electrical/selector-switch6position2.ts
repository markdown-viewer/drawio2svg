// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalSelectorSwitch6Position2Handler extends BaseShapeHandler {
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
    builder.moveTo(0.39 * width, 0.03 * height);
    builder.lineTo(width, 0.03 * height);
    builder.moveTo(0.68 * width, 0.22 * height);
    builder.lineTo(width, 0.22 * height);
    builder.moveTo(0.8 * width, 0.405 * height);
    builder.lineTo(width, 0.405 * height);
    builder.moveTo(0.8 * width, 0.595 * height);
    builder.lineTo(width, 0.595 * height);
    builder.moveTo(0.68 * width, 0.78 * height);
    builder.lineTo(width, 0.78 * height);
    builder.moveTo(0.39 * width, 0.97 * height);
    builder.lineTo(width, 0.97 * height);
    builder.stroke();
    builder.ellipse(0.2 * width, 0.47 * height, 0.08 * width, 0.06 * height);
    builder.fillAndStroke();
    builder.ellipse(0.31 * width, 0, 0.08 * width, 0.06 * height);
    builder.fillAndStroke();
    builder.ellipse(0.6 * width, 0.19 * height, 0.08 * width, 0.06 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.375 * height, 0.08 * width, 0.06 * height);
    builder.fillAndStroke();
    builder.ellipse(0.72 * width, 0.565 * height, 0.08 * width, 0.06 * height);
    builder.fillAndStroke();
    builder.ellipse(0.6 * width, 0.75 * height, 0.08 * width, 0.06 * height);
    builder.fillAndStroke();
    builder.ellipse(0.31 * width, 0.94 * height, 0.08 * width, 0.06 * height);
    builder.fillAndStroke();
    builder.setFillColor(e as string);
    if ('1' == d) {
      builder.begin();
      builder.moveTo(0.25 * width, 0.47 * height);
      builder.lineTo(0.34 * width, 0.08 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.29 * width, 0.115 * height);
      builder.lineTo(0.34 * width, 0.06 * height);
      builder.lineTo(0.37 * width, 0.12 * height);
    } else if ('2' == d) {
      builder.begin();
      builder.moveTo(0.27 * width, 0.48 * height);
      builder.lineTo(0.595 * width, 0.25 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.52 * width, 0.265 * height);
      builder.lineTo(0.61 * width, 0.24 * height);
      builder.lineTo(0.58 * width, 0.302 * height);
    } else if ('3' == d) {
      builder.begin();
      builder.moveTo(0.28 * width, 0.495 * height);
      builder.lineTo(0.69 * width, 0.42 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.63 * width, 0.405 * height);
      builder.lineTo(0.72 * width, 0.415 * height);
      builder.lineTo(0.65 * width, 0.455 * height);
    } else if ('4' == d) {
      builder.begin();
      builder.moveTo(0.28 * width, 0.505 * height);
      builder.lineTo(0.69 * width, 0.58 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.63 * width, 0.595 * height);
      builder.lineTo(0.72 * width, 0.585 * height);
      builder.lineTo(0.65 * width, 0.545 * height);
    } else if ('5' == d) {
      builder.begin();
      builder.moveTo(0.27 * width, 0.52 * height);
      builder.lineTo(0.595 * width, 0.75 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.52 * width, 0.735 * height);
      builder.lineTo(0.61 * width, 0.76 * height);
      builder.lineTo(0.58 * width, 0.698 * height);
    } else {
      builder.begin();
      builder.moveTo(0.25 * width, 0.53 * height);
      builder.lineTo(0.34 * width, 0.92 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.29 * width, 0.885 * height);
      builder.lineTo(0.34 * width, 0.94 * height);
      builder.lineTo(0.37 * width, 0.88 * height);
    }
    builder.close();
    builder.fill();
    builder.restore();
  }
}
