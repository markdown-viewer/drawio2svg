// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalFuse2Handler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.8 * height);
    builder.lineTo(0.25 * width, 0.8 * height);
    if ('off' == d) {
      builder.lineTo(0.76 * width, 0);
      builder.moveTo(0.348 * width, 0.47 * height);
      builder.lineTo(0.563 * width, 0.13 * height);
      builder.lineTo(0.603 * width, 0.46 * height);
      builder.lineTo(0.387 * width, 0.78 * height);
    } else {
      builder.lineTo(0.8 * width, 0.8 * height);
      builder.moveTo(0.38 * width, 0.6 * height);
      builder.lineTo(0.62 * width, 0.6 * height);
      builder.lineTo(0.62 * width, height);
      builder.lineTo(0.38 * width, height);
    }
    builder.close();
    builder.stroke();
    builder.restore();
  }
}
