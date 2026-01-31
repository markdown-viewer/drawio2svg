// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalSignalSourcesDcSource3V2Handler extends BaseShapeHandler {
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

    builder.translate(d, y);
    d = Math.max(3, 0.05 * Math.min(height, width));
    builder.ellipse(0, 0, width, height);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.5 * width - d, 0.05 * height + 3);
    builder.lineTo(0.5 * width + d, 0.05 * height + 3);
    builder.moveTo(0.5 * width, 0.05 * height - d + 3);
    builder.lineTo(0.5 * width, 0.05 * height + d + 3);
    builder.moveTo(0.5 * width - d, 0.95 * height - 3);
    builder.lineTo(0.5 * width + d, 0.95 * height - 3);
    builder.stroke();
    builder.restore();
  }
}
