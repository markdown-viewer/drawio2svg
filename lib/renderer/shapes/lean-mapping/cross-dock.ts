// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingCrossDockHandler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.25 * height);
    builder.lineTo(width, 0.25 * height);
    builder.moveTo(0.1 * width, 0.4 * height);
    builder.lineTo(0.35 * width, 0.4 * height);
    builder.arcTo(0.15 * width, 0.15 * height, 0, 0, 1, 0.5 * width, 0.5 * height);
    builder.arcTo(0.15 * width, 0.15 * height, 0, 0, 0, 0.65 * width, 0.6 * height);
    builder.lineTo(0.9 * width, 0.6 * height);
    builder.stroke();
    builder.moveTo(0.1 * width, 0.4 * height);
    builder.lineTo(0.35 * width, 0.4 * height);
    builder.arcTo(0.15 * width, 0.25 * height, 0, 0, 1, 0.5 * width, 0.55 * height);
    builder.arcTo(0.15 * width, 0.25 * height, 0, 0, 0, 0.65 * width, 0.7 * height);
    builder.lineTo(0.9 * width, 0.7 * height);
    builder.stroke();
    builder.moveTo(0.1 * width, 0.4 * height);
    builder.lineTo(0.35 * width, 0.4 * height);
    builder.arcTo(0.15 * width, 0.3 * height, 0, 0, 1, 0.5 * width, 0.6 * height);
    builder.arcTo(0.15 * width, 0.3 * height, 0, 0, 0, 0.65 * width, 0.8 * height);
    builder.lineTo(0.9 * width, 0.8 * height);
    builder.stroke();
    builder.moveTo(0.1 * width, 0.8 * height);
    builder.lineTo(0.35 * width, 0.8 * height);
    builder.arcTo(0.15 * width, 0.3 * height, 0, 0, 0, 0.5 * width, 0.6 * height);
    builder.arcTo(0.15 * width, 0.3 * height, 0, 0, 1, 0.65 * width, 0.4 * height);
    builder.lineTo(0.9 * width, 0.4 * height);
    builder.stroke();
    builder.moveTo(0.1 * width, 0.8 * height);
    builder.lineTo(0.35 * width, 0.8 * height);
    builder.arcTo(0.15 * width, 0.1 * height, 0, 0, 0, 0.5 * width, 0.75 * height);
    builder.arcTo(0.15 * width, 0.1 * height, 0, 0, 1, 0.65 * width, 0.7 * height);
    builder.lineTo(0.9 * width, 0.7 * height);
    builder.stroke();
    builder.restore();
  }
}
