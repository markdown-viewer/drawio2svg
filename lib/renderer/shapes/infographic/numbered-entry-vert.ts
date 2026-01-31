// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class InfographicNumberedEntryVertHandler extends ActorShapeHandler {
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
    d = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dy', 0.5)));
    d = Math.min(d, width - 10, height - 5);
    builder.ellipse(0.5 * width - 0.5 * d, 0, d, d);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0, 0.5 * d);
    builder.lineTo(0.5 * width - 0.5 * d - 5, 0.5 * d);
    builder.arcTo(0.5 * d + 5, 0.5 * d + 5, 0, 0, 0, 0.5 * width + 0.5 * d + 5, 0.5 * d);
    builder.lineTo(width, 0.5 * d);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
