// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingPhysicalPullHandler extends BaseShapeHandler {
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
    builder.moveTo(0.732 * width, 0.0736 * height);
    builder.arcTo(0.4827 * width, 0.4959 * height, 0, 1, 0, 0.9553 * width, 0.6191 * height);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.9071 * width, 0.6191 * height);
    builder.lineTo(0.9794 * width, 0.4951 * height);
    builder.lineTo(width, 0.6438 * height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
