// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class InfographicCircularCalloutHandler extends ActorShapeHandler {
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
    d = Math.max(0, Math.min(0.5 * height, this.getStyleNumber(style, 'dy', 0.5)));
    e = Math.max(0, Math.min(0.5 * width, 0.5 * width - d));
    f = Math.max(0, Math.min(0.5 * height, 0.5 * height - d));
    builder.begin();
    builder.moveTo(width, 0.5 * height);
    builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 1, 0.5 * width, height);
    builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 1, 0, 0.5 * height);
    builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 1, 0.5 * width, 0);
    builder.lineTo(width, 0);
    builder.close();
    builder.moveTo(0.5 * width, d);
    builder.arcTo(e, f, 0, 0, 0, 0.5 * width - e, 0.5 * height);
    builder.arcTo(e, f, 0, 0, 0, 0.5 * width, 0.5 * height + f);
    builder.arcTo(e, f, 0, 0, 0, 0.5 * width + e, 0.5 * height);
    builder.arcTo(e, f, 0, 0, 0, 0.5 * width, 0.5 * height - f);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
