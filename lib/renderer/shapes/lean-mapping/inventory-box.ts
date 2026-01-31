// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingInventoryBoxHandler extends BaseShapeHandler {
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
    builder.moveTo(0, height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, height);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0.4 * width, 0.45 * height);
    builder.lineTo(0.6 * width, 0.45 * height);
    builder.moveTo(0.5 * width, 0.45 * height);
    builder.lineTo(0.5 * width, 0.85 * height);
    builder.moveTo(0.4 * width, 0.85 * height);
    builder.lineTo(0.6 * width, 0.85 * height);
    builder.stroke();
    builder.restore();
  }
}
