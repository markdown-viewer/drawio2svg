// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlNestedPortHandler extends BaseShapeHandler {
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

    builder.rect(x + 0.08 * width, y, 0.92 * width, height);
    builder.fillAndStroke();
    builder.rect(x + 0.03 * width, y + 0.1 * height, 0.1 * width, 0.8 * height);
    builder.fillAndStroke();
    builder.rect(x, y + 0.15 * height, 0.06 * width, 0.16 * height);
    builder.fillAndStroke();
    builder.rect(x, y + 0.42 * height, 0.06 * width, 0.16 * height);
    builder.fillAndStroke();
    builder.rect(x, y + 0.69 * height, 0.06 * width, 0.16 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
