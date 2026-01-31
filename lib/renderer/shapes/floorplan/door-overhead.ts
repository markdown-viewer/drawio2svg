// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class FloorplanDoorOverheadHandler extends BaseShapeHandler {
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
    builder.rect(0, height - 10, 5, 10);
    builder.fillAndStroke();
    builder.rect(width - 5, height - 10, 5, 10);
    builder.fillAndStroke();
    builder.rect(5, 0, width - 10, height - 5);
    builder.fillAndStroke();
    builder.restore();
  }
}
