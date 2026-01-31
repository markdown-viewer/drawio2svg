// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalSelectorSwitch3Position2Handler extends BaseShapeHandler {
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
    builder.moveTo(0.68 * width, 0.06 * height);
    builder.lineTo(width, 0.06 * height);
    builder.moveTo(0.75 * width, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.moveTo(0.68 * width, 0.94 * height);
    builder.lineTo(width, 0.94 * height);
    builder.stroke();
    builder.ellipse(0.2 * width, 0.435 * height, 0.08 * width, 0.13 * height);
    builder.fillAndStroke();
    builder.ellipse(0.6 * width, 0, 0.08 * width, 0.13 * height);
    builder.fillAndStroke();
    builder.ellipse(0.67 * width, 0.435 * height, 0.08 * width, 0.13 * height);
    builder.fillAndStroke();
    builder.ellipse(0.6 * width, 0.87 * height, 0.08 * width, 0.13 * height);
    builder.fillAndStroke();
    builder.setFillColor(e as string);
    if ('1' == d) {
      builder.begin();
      builder.moveTo(0.27 * width, 0.47 * height);
      builder.lineTo(0.59 * width, 0.12 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.52 * width, 0.12 * height);
      builder.lineTo(0.61 * width, 0.095 * height);
      builder.lineTo(0.565 * width, 0.22 * height);
    } else if ('2' == d) {
      builder.begin();
      builder.moveTo(0.28 * width, 0.5 * height);
      builder.lineTo(0.64 * width, 0.5 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.59 * width, 0.44 * height);
      builder.lineTo(0.67 * width, 0.5 * height);
      builder.lineTo(0.59 * width, 0.56 * height);
    } else {
      builder.begin();
      builder.moveTo(0.27 * width, 0.53 * height);
      builder.lineTo(0.59 * width, 0.88 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.52 * width, 0.88 * height);
      builder.lineTo(0.61 * width, 0.905 * height);
      builder.lineTo(0.565 * width, 0.78 * height);
    }
    builder.close();
    builder.fill();
    builder.restore();
  }
}
