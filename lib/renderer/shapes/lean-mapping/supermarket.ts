// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingSupermarketHandler extends BaseShapeHandler {
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
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.moveTo(0, 0.33 * height);
    builder.lineTo(width, 0.33 * height);
    builder.moveTo(0, 0.67 * height);
    builder.lineTo(width, 0.67 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
