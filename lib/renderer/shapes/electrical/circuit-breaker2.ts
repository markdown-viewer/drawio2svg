// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalCircuitBreaker2Handler extends BaseShapeHandler {
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
    builder.moveTo(0.8 * width, 0.8 * height);
    builder.lineTo(width, 0.8 * height);
    builder.moveTo(0.75 * width, 0.6 * height);
    builder.lineTo(0.85 * width, height);
    builder.moveTo(0.85 * width, 0.6 * height);
    builder.lineTo(0.75 * width, height);
    builder.moveTo(0, 0.8 * height);
    builder.lineTo(0.24 * width, 0.8 * height);
    if ('off' == d) {
      builder.lineTo(0.76 * width, 0);
    } else {
      builder.lineTo(0.8 * width, 0.8 * height);
    }
    builder.stroke();
    builder.restore();
  }
}
