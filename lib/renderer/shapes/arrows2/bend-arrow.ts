// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Arrows2BendArrowHandler extends ActorShapeHandler {
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
    d = Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy', 0.5)));
    e = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    f = Math.max(0, Math.min(height, this.getStyleNumber(style, 'notch', 0)));
    g = Math.max(0, Math.min(height, this.getStyleNumber(style, 'arrowHead', 40)));
    h = this.getStyleValue(style, 'rounded', '0');
    builder.begin();
    builder.moveTo(width - e, 0);
    builder.lineTo(width, 0.5 * g);
    builder.lineTo(width - e, g);
    builder.lineTo(width - e, g / 2 + d);
    if ('1' == h) {
      builder.lineTo(2.2 * d, g / 2 + d);
      builder.arcTo(0.2 * d, 0.2 * d, 0, 0, 0, 2 * d, g / 2 + 1.2 * d);
    } else {
      builder.lineTo(2 * d, g / 2 + d);
    }
    builder.lineTo(2 * d, height);
    builder.lineTo(d, height - f);
    builder.lineTo(0, height);
    if ('1' == h) {
      builder.lineTo(0, g / 2 + d);
      builder.arcTo(2 * d, 2 * d, 0, 0, 1, 2 * d, g / 2 - d);
    } else {
      builder.lineTo(0, g / 2 - d);
    }
    builder.lineTo(width - e, g / 2 - d);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
