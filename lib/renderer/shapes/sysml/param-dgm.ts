// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlParamDgmHandler extends BaseShapeHandler {
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

    builder.roundrect(x, y, width, height, 10, 10);
    builder.fillAndStroke();
    builder.setShadow(!1);
    if (60 < height) {
      builder.rect(x, y + 0.25 * height - 10, 20, 20);
      builder.stroke();
      builder.rect(x, y + 0.75 * height - 10, 20, 20);
      builder.stroke();
    }
    builder.restore();
  }
}
