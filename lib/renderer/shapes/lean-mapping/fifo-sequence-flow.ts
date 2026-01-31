// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingFifoSequenceFlowHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } =
      this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;

    builder.translate(d, y);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.moveTo(0, height);
    builder.lineTo(width, height);
    builder.moveTo(0.05 * width, 0.5 * height);
    builder.lineTo(0.15 * width, 0.5 * height);
    builder.moveTo(0.75 * width, 0.5 * height);
    builder.lineTo(0.88 * width, 0.5 * height);
    builder.stroke();
    d = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(d as string);
    builder.begin();
    builder.moveTo(0.88 * width, 0.39 * height);
    builder.lineTo(0.98 * width, 0.5 * height);
    builder.lineTo(0.88 * width, 0.61 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
