// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicWave2Handler extends ActorShapeHandler {
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
    d = height * Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy', 0.5)));
    builder.begin();
    builder.moveTo(0, d / 2);
    builder.quadTo(width / 6, d * (1 - 1.4), width / 3, d / 2);
    builder.quadTo(width / 2, 1.4 * d, (2 * width) / 3, d / 2);
    builder.quadTo((5 * width) / 6, d * (1 - 1.4), width, d / 2);
    builder.lineTo(width, height - d / 2);
    builder.quadTo((5 * width) / 6, height - 1.4 * d, (2 * width) / 3, height - d / 2);
    builder.quadTo(width / 2, height - d * (1 - 1.4), width / 3, height - d / 2);
    builder.quadTo(width / 6, height - 1.4 * d, 0, height - d / 2);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
