// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalTransmissionStraightBusHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;
    let e = y;

    builder.translate(d, e);
    d = 0.2 * width;
    e = width > height ? 0.5 * height : width / 2;
    builder.begin();
    builder.moveTo(width - d, 0);
    builder.lineTo(width - d, height - e);
    builder.lineTo(width, height - e);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0, height - e);
    builder.lineTo(d, height - e);
    builder.lineTo(d, 0);
    builder.fillAndStroke();
    builder.restore();
  }
}
