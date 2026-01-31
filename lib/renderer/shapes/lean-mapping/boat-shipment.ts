// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingBoatShipmentHandler extends BaseShapeHandler {
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
    builder.moveTo(0.15 * width, 0.77 * height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(0.85 * width, 0.77 * height);
    builder.close();
    builder.moveTo(0.2 * width, height);
    builder.lineTo(0, 0.8 * height);
    builder.lineTo(width, 0.8 * height);
    builder.lineTo(0.8 * width, height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
