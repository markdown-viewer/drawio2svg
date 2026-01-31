// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlItemFlowRightHandler extends BaseShapeHandler {
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

    builder.rect(x, y, width - 10, height);
    builder.fillAndStroke();
    builder.rect(x + width - 20, y + 0.25 * height - 10, 20, 20);
    builder.fillAndStroke();
    builder.rect(x + width - 20, y + 0.5 * height - 10, 20, 20);
    builder.fillAndStroke();
    builder.rect(x + width - 20, y + 0.75 * height - 10, 20, 20);
    builder.fillAndStroke();
    builder.restore();
  }
}
