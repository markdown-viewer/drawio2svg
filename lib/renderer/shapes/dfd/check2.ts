// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class DfdCheck2Handler extends BaseShapeHandler {
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
    d = Math.min(0.5 * height, 0.5 * width);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(d, 0);
    builder.lineTo(width - d, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(width - d, height);
    builder.lineTo(d, height);
    builder.lineTo(0, 0.5 * height);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(width - d, 0);
    builder.lineTo(width - 2 * d, 0.5 * height);
    builder.lineTo(width - d, height);
    builder.stroke();
    builder.restore();
  }
}
