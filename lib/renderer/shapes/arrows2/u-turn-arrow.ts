// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Arrows2UTurnArrowHandler extends ActorShapeHandler {
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
    builder.translate(d, e);
    d = Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy', 0.5)));
    e = Math.max(0, Math.min(height, this.getStyleNumber(style, 'arrowHead', 40)));
    f = (height - e / 2 + d) / 2;
    g = Math.max(0, this.getStyleNumber(style, 'dx2', this.dx2));
    builder.begin();
    builder.moveTo(f, 0);
    builder.lineTo(f + g, 0.5 * e);
    builder.lineTo(f, e);
    builder.lineTo(f, e / 2 + d);
    builder.arcTo(f - 2 * d, f - 2 * d, 0, 0, 0, f, height - 2 * d);
    builder.lineTo(Math.max(width, f), height - 2 * d);
    builder.lineTo(Math.max(width, f), height);
    builder.lineTo(f, height);
    builder.arcTo(f, f, 0, 0, 1, f, e / 2 - d);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
