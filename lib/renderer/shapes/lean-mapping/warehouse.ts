// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingWarehouseHandler extends BaseShapeHandler {
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
    builder.rect(0, 0, width, height);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0, 0.4 * height);
    builder.lineTo(width, 0.4 * height);
    builder.moveTo(0.15 * width, height);
    builder.lineTo(0.15 * width, 0.55 * height);
    builder.lineTo(0.3 * width, 0.55 * height);
    builder.lineTo(0.3 * width, height);
    builder.stroke();
    builder.ellipse(0.27 * width, 0.75 * height, 0.02 * width, 0.02 * width);
    builder.stroke();
    builder.restore();
  }
}
