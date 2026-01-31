// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicDonutHandler extends ActorShapeHandler {
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
    d = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    d = Math.min(0.5 * width, 0.5 * height, d);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 1, 0.5 * width, 0);
    builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 1, width, 0.5 * height);
    builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 1, 0.5 * width, height);
    builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 1, 0, 0.5 * height);
    builder.close();
    builder.moveTo(0.5 * width, d);
    builder.arcTo(0.5 * width - d, 0.5 * height - d, 0, 0, 0, d, 0.5 * height);
    builder.arcTo(0.5 * width - d, 0.5 * height - d, 0, 0, 0, 0.5 * width, height - d);
    builder.arcTo(0.5 * width - d, 0.5 * height - d, 0, 0, 0, width - d, 0.5 * height);
    builder.arcTo(0.5 * width - d, 0.5 * height - d, 0, 0, 0, 0.5 * width, d);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
