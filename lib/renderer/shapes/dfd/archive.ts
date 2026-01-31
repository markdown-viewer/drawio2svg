// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class DfdArchiveHandler extends BaseShapeHandler {
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
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0.1 * width, 0.2 * height);
    builder.lineTo(0.9 * width, 0.2 * height);
    builder.stroke();
    builder.restore();
  }
}
