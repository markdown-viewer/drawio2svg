// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlProbabilityHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    builder.roundrect(0, 0, width - 10, height, 10, 10);
    builder.fillAndStroke();
    builder.rect(width - 10, 0.25 * height - 28, 10, 56);
    builder.fillAndStroke();
    builder.rect(width - 10, 0.75 * height - 28, 10, 56);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.rect(width - 10, 0.25 * height - 24, 6, 20);
    builder.fillAndStroke();
    builder.rect(width - 10, 0.25 * height + 4, 6, 20);
    builder.fillAndStroke();
    builder.rect(width - 10, 0.75 * height - 24, 6, 20);
    builder.fillAndStroke();
    builder.rect(width - 10, 0.75 * height + 4, 6, 20);
    builder.fillAndStroke();
    builder.restore();
  }
}
