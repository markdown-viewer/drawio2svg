// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalShortingSelectorSwitch2Handler extends BaseShapeHandler {
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
    this.getStyleValue(style, 'strokeColor', '#000000');
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.25 * width, 0.5 * height);
    builder.stroke();
    builder.ellipse(0.25 * width, 0.455 * height, 0.1 * width, 0.09 * height);
    builder.fillAndStroke();
    builder.ellipse(0.75 * width, 0, 0.1 * width, 0.09 * height);
    builder.fillAndStroke();
    builder.ellipse(0.9 * width, 0.305 * height, 0.1 * width, 0.09 * height);
    builder.fillAndStroke();
    builder.ellipse(0.9 * width, 0.605 * height, 0.1 * width, 0.09 * height);
    builder.fillAndStroke();
    builder.ellipse(0.75 * width, 0.91 * height, 0.1 * width, 0.09 * height);
    builder.fillAndStroke();
    if ('1' == d) {
      builder.begin();
      builder.moveTo(0.33 * width, 0.47 * height);
      builder.lineTo(0.72 * width, 0.12 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.617 * width, 0.044 * height);
      builder.arcTo(0.21 * width, 0.17 * height, 0, 0, 1, 0.818 * width, 0.182 * height);
      builder.lineTo(0.766 * width, 0.198 * height);
      builder.arcTo(0.15 * width, 0.13 * height, 0, 0, 0, 0.617 * width, 0.092 * height);
    } else if ('2' == d) {
      builder.begin();
      builder.moveTo(0.34 * width, 0.49 * height);
      builder.lineTo(0.83 * width, 0.375 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.791 * width, 0.263 * height);
      builder.arcTo(0.24 * width, 0.2 * height, 0, 0, 1, 0.889 * width, 0.474 * height);
      builder.lineTo(0.837 * width, 0.465 * height);
      builder.arcTo(0.16 * width, 0.14 * height, 0, 0, 0, 0.767 * width, 0.303 * height);
    } else if ('3' == d) {
      builder.begin();
      builder.moveTo(0.34 * width, 0.51 * height);
      builder.lineTo(0.83 * width, 0.625 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.791 * width, 0.737 * height);
      builder.arcTo(0.24 * width, 0.2 * height, 0, 0, 0, 0.889 * width, 0.526 * height);
      builder.lineTo(0.837 * width, 0.535 * height);
      builder.arcTo(0.16 * width, 0.14 * height, 0, 0, 1, 0.767 * width, 0.697 * height);
    } else {
      builder.begin();
      builder.moveTo(0.33 * width, 0.53 * height);
      builder.lineTo(0.72 * width, 0.88 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.617 * width, 0.956 * height);
      builder.arcTo(0.21 * width, 0.17 * height, 0, 0, 0, 0.818 * width, 0.818 * height);
      builder.lineTo(0.766 * width, 0.802 * height);
      builder.arcTo(0.15 * width, 0.13 * height, 0, 0, 1, 0.617 * width, 0.908 * height);
    }
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
