// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicRoundedFrameHandler extends ActorShapeHandler {
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
    d = Math.min(0.25 * width, 0.25 * height, d);
    builder.begin();
    builder.moveTo(width - 2 * d, 0);
    builder.arcTo(2 * d, 2 * d, 0, 0, 1, width, 2 * d);
    builder.lineTo(width, height - 2 * d);
    builder.arcTo(2 * d, 2 * d, 0, 0, 1, width - 2 * d, height);
    builder.lineTo(2 * d, height);
    builder.arcTo(2 * d, 2 * d, 0, 0, 1, 0, height - 2 * d);
    builder.lineTo(0, 2 * d);
    builder.arcTo(2 * d, 2 * d, 0, 0, 1, 2 * d, 0);
    builder.close();
    builder.moveTo(2 * d, d);
    builder.arcTo(d, d, 0, 0, 0, d, 2 * d);
    builder.lineTo(d, height - 2 * d);
    builder.arcTo(d, d, 0, 0, 0, 2 * d, height - d);
    builder.lineTo(width - 2 * d, height - d);
    builder.arcTo(d, d, 0, 0, 0, width - d, height - 2 * d);
    builder.lineTo(width - d, 2 * d);
    builder.arcTo(d, d, 0, 0, 0, width - 2 * d, d);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
