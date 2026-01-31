// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class DfdStartHandler extends BaseShapeHandler {
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
    builder.moveTo(width - d, 0.5 * height - d);
    builder.arcTo(d, d, 0, 0, 1, width, 0.5 * height);
    builder.arcTo(d, d, 0, 0, 1, width - d, 0.5 * height + d);
    builder.lineTo(d, 0.5 * height + d);
    builder.arcTo(d, d, 0, 0, 1, 0, 0.5 * height);
    builder.arcTo(d, d, 0, 0, 1, d, 0.5 * height - d);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
