// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Arrows2CalloutDouble90ArrowHandler extends ActorShapeHandler {
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
    let g;
    let h;
    builder.translate(d, e);
    d = Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy1', 0.5)));
    e = Math.max(0, Math.min(width, parseFloat(this.getStyleValue(style, 'dx1', 0.5))));
    f = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx2', 0)));
    g = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dy2', 0)));
    h = Math.max(0, Math.min(height, this.getStyleNumber(style, 'arrowHead', 0)));
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(f, 0);
    builder.lineTo(f, 0.5 * g - d);
    builder.lineTo(width - e, 0.5 * g - d);
    builder.lineTo(width - e, 0.5 * g - d - h);
    builder.lineTo(width, 0.5 * g);
    builder.lineTo(width - e, 0.5 * g + d + h);
    builder.lineTo(width - e, 0.5 * g + d);
    builder.lineTo(f, 0.5 * g + d);
    builder.lineTo(f, g);
    builder.lineTo(f / 2 + d, g);
    builder.lineTo(f / 2 + d, height - e);
    builder.lineTo(f / 2 + d + h, height - e);
    builder.lineTo(f / 2, height);
    builder.lineTo(f / 2 - d - h, height - e);
    builder.lineTo(f / 2 - d, height - e);
    builder.lineTo(f / 2 - d, g);
    builder.lineTo(0, g);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
