// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicLayeredRectHandler extends ActorShapeHandler {
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
    builder.moveTo(d, d);
    builder.lineTo(width, d);
    builder.lineTo(width, height);
    builder.lineTo(d, height);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.5 * d, 0.5 * d);
    builder.lineTo(width - 0.5 * d, 0.5 * d);
    builder.lineTo(width - 0.5 * d, height - 0.5 * d);
    builder.lineTo(0.5 * d, height - 0.5 * d);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width - d, 0);
    builder.lineTo(width - d, height - d);
    builder.lineTo(0, height - d);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
