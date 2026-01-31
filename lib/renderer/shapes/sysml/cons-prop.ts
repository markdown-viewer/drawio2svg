// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlConsPropHandler extends BaseShapeHandler {
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

    builder.rect(x, y, width, height);
    builder.fillAndStroke();
    builder.setShadow(!1);
    if (60 < height) {
      builder.rect(x, y + 50, 20, 20);
      builder.stroke();
      builder.rect(x, y + 80, 20, 20);
      builder.stroke();
    }
    builder.restore();
  }
}
