// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingSequencedPullBallHandler extends BaseShapeHandler {
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
    builder.ellipse(0, 0, width, height);
    builder.fillAndStroke();
    d = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(d as string);
    builder.setShadow(!1);
    builder.ellipse(0.15 * width, 0.15 * height, 0.7 * width, 0.7 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
