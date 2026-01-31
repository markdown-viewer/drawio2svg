// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingRailShipmentHandler extends BaseShapeHandler {
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
    builder.rect(0.1 * width, 0, 0.35 * width, 0.8 * height);
    builder.fillAndStroke();
    builder.rect(0.55 * width, 0, 0.35 * width, 0.8 * height);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0, height);
    builder.lineTo(width, height);
    builder.moveTo(0.45 * width, 0.7 * height);
    builder.lineTo(0.55 * width, 0.7 * height);
    builder.stroke();
    builder.ellipse(0.15 * width, 0.8 * height, 0.06 * width, 0.2 * height);
    builder.fillAndStroke();
    builder.ellipse(0.34 * width, 0.8 * height, 0.06 * width, 0.2 * height);
    builder.fillAndStroke();
    builder.ellipse(0.6 * width, 0.8 * height, 0.06 * width, 0.2 * height);
    builder.fillAndStroke();
    builder.ellipse(0.79 * width, 0.8 * height, 0.06 * width, 0.2 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
