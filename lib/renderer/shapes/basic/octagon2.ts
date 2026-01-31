// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicOctagon2Handler extends ActorShapeHandler {
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
    d = 2 * Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    d = Math.min(0.5 * width, 0.5 * height, d);
    builder.begin();
    builder.moveTo(d, 0);
    builder.lineTo(width - d, 0);
    builder.lineTo(width, d);
    builder.lineTo(width, height - d);
    builder.lineTo(width - d, height);
    builder.lineTo(d, height);
    builder.lineTo(0, height - d);
    builder.lineTo(0, d);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
