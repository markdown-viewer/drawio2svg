// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalElectroMechanicalTwoWayContact2Handler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.21 * width, 0.5 * height);
    builder.moveTo(0.67 * width, 0);
    builder.lineTo(width, 0);
    builder.moveTo(0.67 * width, height);
    builder.lineTo(width, height);
    if ('1' == d) {
      builder.moveTo(0.28 * width, 0.46 * height);
      builder.lineTo(0.67 * width, 0);
    } else if ('2' == d) {
      builder.moveTo(0.28 * width, 0.54 * height);
      builder.lineTo(0.67 * width, height);
    } else {
      builder.moveTo(0.28 * width, 0.5 * height);
      builder.lineTo(0.67 * width, 0.5 * height);
    }
    builder.stroke();
    builder.ellipse(0.2 * width, 0.4 * height, 0.08 * width, 0.2 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
