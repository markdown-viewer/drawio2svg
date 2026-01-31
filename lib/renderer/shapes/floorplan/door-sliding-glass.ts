// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class FloorplanDoorSlidingGlassHandler extends BaseShapeHandler {
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

    let f;
    f = width * Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    builder.translate(x, y);
    builder.rect(0, 0.5 * height - 5, 5, 10);
    builder.fillAndStroke();
    builder.rect(width - 5, 0.5 * height - 5, 5, 10);
    builder.fillAndStroke();
    builder.rect(0, 0.5 * height, 0.5 * width, 2);
    builder.fillAndStroke();
    builder.rect(f, 0.5 * height - 2, 0.5 * width, 2);
    builder.fillAndStroke();
    builder.restore();
  }
}
