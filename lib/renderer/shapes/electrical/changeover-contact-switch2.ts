// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalChangeoverContactSwitch2Handler extends BaseShapeHandler {
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
    builder.moveTo(0, height);
    builder.lineTo(0.25 * width, height);
    if ('1' == d) {
      builder.lineTo(0.76 * width, 0.2 * height);
      builder.moveTo(width, 0);
      builder.lineTo(0.67 * width, 0);
      builder.lineTo(0.67 * width, 0.5 * height);
      builder.moveTo(width, height);
      builder.lineTo(0.8 * width, height);
    } else {
      builder.lineTo(0.77 * width, 0.6 * height);
      builder.moveTo(width, height);
      builder.lineTo(0.67 * width, height);
      builder.lineTo(0.67 * width, 0.5 * height);
      builder.moveTo(width, 0);
      builder.lineTo(0.8 * width, 0);
    }
    builder.stroke();
    builder.restore();
  }
}
