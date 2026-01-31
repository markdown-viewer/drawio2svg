// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMarkupRedXHandler extends BaseShapeHandler {
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
    builder.moveTo(0.1 * width, 0);
    builder.lineTo(0.5 * width, 0.4 * height);
    builder.lineTo(0.9 * width, 0);
    builder.lineTo(width, 0.1 * height);
    builder.lineTo(0.6 * width, 0.5 * height);
    builder.lineTo(width, 0.9 * height);
    builder.lineTo(0.9 * width, height);
    builder.lineTo(0.5 * width, 0.6 * height);
    builder.lineTo(0.1 * width, height);
    builder.lineTo(0, 0.9 * height);
    builder.lineTo(0.4 * width, 0.5 * height);
    builder.lineTo(0, 0.1 * height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
