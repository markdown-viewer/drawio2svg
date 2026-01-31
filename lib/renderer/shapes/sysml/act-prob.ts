// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlActProbHandler extends BaseShapeHandler {
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
    builder.begin();
    builder.rect(0, 0, width - 10, height);
    builder.fillAndStroke();
    d = Math.min(40, width);
    if (20 < d) {
      builder.begin();
      builder.moveTo(0, 20);
      builder.lineTo(d - 10, 20);
      builder.lineTo(d, 10);
      builder.lineTo(d, 0);
      builder.lineTo(0, 0);
      builder.close();
      builder.fillAndStroke();
    }
    builder.setShadow(!1);
    if (70 < height) {
      builder.rect(width - 15, 0.25 * height - 28, 15, 56);
      builder.fillAndStroke();
      builder.rect(width - 19, 0.25 * height - 24, 15, 20);
      builder.fillAndStroke();
      builder.rect(width - 19, 0.25 * height + 4, 15, 20);
      builder.fillAndStroke();
      builder.rect(width - 15, 0.75 * height - 28, 15, 56);
      builder.fillAndStroke();
      builder.rect(width - 19, 0.75 * height - 24, 15, 20);
      builder.fillAndStroke();
      builder.rect(width - 19, 0.75 * height + 4, 15, 20);
      builder.fillAndStroke();
    }
    builder.restore();
  }
}
