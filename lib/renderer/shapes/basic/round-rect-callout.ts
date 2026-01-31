// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicRoundRectCalloutHandler extends ActorShapeHandler {
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
    let e = y;

    let f;
    builder.translate(d, e);
    d = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    e = Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy', 0.5)));
    f = Math.max(0, Math.min(height, this.getStyleNumber(style, 'size', 10)));
    f = Math.min((height - e) / 2, width / 2, f);
    d = Math.max(f + 0.5 * e, d);
    d = Math.min(width - f - 0.5 * e, d);
    builder.begin();
    builder.moveTo(d - 0.5 * e, height - e);
    builder.lineTo(f, height - e);
    builder.arcTo(f, f, 0, 0, 1, 0, height - e - f);
    builder.lineTo(0, f);
    builder.arcTo(f, f, 0, 0, 1, f, 0);
    builder.lineTo(width - f, 0);
    builder.arcTo(f, f, 0, 0, 1, width, f);
    builder.lineTo(width, height - e - f);
    builder.arcTo(f, f, 0, 0, 1, width - f, height - e);
    builder.lineTo(d + 0.5 * e, height - e);
    builder.arcTo(1.9 * e, 1.4 * e, 0, 0, 1, d - e, height);
    builder.arcTo(0.9 * e, 1.4 * e, 0, 0, 0, d - 0.5 * e, height - e);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
