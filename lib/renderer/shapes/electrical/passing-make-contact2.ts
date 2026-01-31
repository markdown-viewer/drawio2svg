// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalPassingMakeContact2Handler extends BaseShapeHandler {
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
    d = this.getStyleValue(style, 'elSwitchState', 'neutral');
    builder.begin();
    builder.moveTo(width, 0.7 * height);
    builder.lineTo(0.77 * width, 0.7 * height);
    builder.lineTo(0.93 * width, height);
    builder.moveTo(0, 0.7 * height);
    builder.lineTo(0.25 * width, 0.7 * height);
    if ('off' == d) {
      builder.lineTo(0.76 * width, 0);
    } else {
      builder.lineTo(0.76 * width, 0.7 * height);
    }
    builder.stroke();
    builder.restore();
  }
}
