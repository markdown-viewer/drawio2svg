// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingBatchedKanbanHandler extends BaseShapeHandler {
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
    let b = width;

    b = Math.max(110, b);
    builder.translate(d, y);
    builder.begin();
    builder.moveTo(4, 0.5 * height);
    builder.lineTo(b, 0.5 * height);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.5 * b - 20, 0.5 * height - 35);
    builder.lineTo(0.5 * b + 25, 0.5 * height - 35);
    builder.lineTo(0.5 * b + 40, 0.5 * height - 20);
    builder.lineTo(0.5 * b + 40, 0.5 * height + 15);
    builder.lineTo(0.5 * b - 20, 0.5 * height + 15);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.5 * b - 30, 0.5 * height - 25);
    builder.lineTo(0.5 * b + 15, 0.5 * height - 25);
    builder.lineTo(0.5 * b + 30, 0.5 * height - 10);
    builder.lineTo(0.5 * b + 30, 0.5 * height + 25);
    builder.lineTo(0.5 * b - 30, 0.5 * height + 25);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.5 * b - 40, 0.5 * height - 15);
    builder.lineTo(0.5 * b + 5, 0.5 * height - 15);
    builder.lineTo(0.5 * b + 20, 0.5 * height);
    builder.lineTo(0.5 * b + 20, 0.5 * height + 35);
    builder.lineTo(0.5 * b - 40, 0.5 * height + 35);
    builder.close();
    builder.fillAndStroke();
    d = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(d as string);
    builder.begin();
    builder.moveTo(b - 10, 0.5 * height - 4);
    builder.lineTo(b, 0.5 * height);
    builder.lineTo(b - 10, 0.5 * height + 4);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
