// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicCross2Handler extends ActorShapeHandler {
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
    builder.begin();
    builder.moveTo(0.5 * width + d, 0);
    builder.lineTo(0.5 * width + d, 0.5 * height - d);
    builder.lineTo(width, 0.5 * height - d);
    builder.lineTo(width, 0.5 * height + d);
    builder.lineTo(0.5 * width + d, 0.5 * height + d);
    builder.lineTo(0.5 * width + d, height);
    builder.lineTo(0.5 * width - d, height);
    builder.lineTo(0.5 * width - d, 0.5 * height + d);
    builder.lineTo(0, 0.5 * height + d);
    builder.lineTo(0, 0.5 * height - d);
    builder.lineTo(0.5 * width - d, 0.5 * height - d);
    builder.lineTo(0.5 * width - d, 0);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
