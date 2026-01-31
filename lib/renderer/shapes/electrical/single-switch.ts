// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalSingleSwitchHandler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.8 * height);
    builder.lineTo(0.2 * width, 0.8 * height);
    builder.moveTo(0.8 * width, 0.8 * height);
    builder.lineTo(width, 0.8 * height);
    if ('off' == d) {
      builder.moveTo(0.28 * width, 0.75 * height);
      builder.lineTo(0.76 * width, 0);
    } else {
      builder.moveTo(0.2 * width, 0.8 * height);
      builder.lineTo(0.8 * width, 0.8 * height);
    }
    builder.stroke();
    builder.ellipse(0.72 * width, 0.65 * height, 0.08 * width, 0.3 * height);
    builder.fillAndStroke();
    builder.ellipse(0.2 * width, 0.65 * height, 0.08 * width, 0.3 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
