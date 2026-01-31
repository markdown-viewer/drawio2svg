// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlParamSetHandler extends BaseShapeHandler {
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
    builder.rect(0, 0.5 * height - 28, 10, 56);
    builder.fillAndStroke();
    builder.roundrect(10, 0, width - 20, height, 10, 10);
    builder.fillAndStroke();
    builder.rect(width - 10, 0.5 * height - 28, 10, 56);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.rect(4, 0.5 * height - 24, 6, 20);
    builder.fillAndStroke();
    builder.rect(4, 0.5 * height + 4, 6, 20);
    builder.fillAndStroke();
    builder.rect(width - 10, 0.5 * height - 24, 6, 20);
    builder.fillAndStroke();
    builder.rect(width - 10, 0.5 * height + 4, 6, 20);
    builder.fillAndStroke();
    builder.restore();
  }
}
