// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalTemperatureSwitchHandler extends BaseShapeHandler {
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
    builder.moveTo(0.76 * width, height);
    builder.lineTo(width, height);
    builder.moveTo(0, height);
    builder.lineTo(0.24 * width, height);
    if ('off' == d) {
      builder.lineTo(0.76 * width, 0.1 * height);
    } else {
      builder.lineTo(0.76 * width, height);
    }
    builder.stroke();
    builder.ellipse(0.43 * width, 0, 0.1 * width, 0.22 * height);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.48 * width, 0);
    builder.lineTo(0.48 * width, 0.22 * height);
    builder.stroke();
    builder.restore();
  }
}
