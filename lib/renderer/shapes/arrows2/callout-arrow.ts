// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Arrows2CalloutArrowHandler extends ActorShapeHandler {
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
    e = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    f = Math.max(0, Math.min(width, this.getStyleNumber(style, 'notch', 0)));
    g = Math.max(0, Math.min(height, this.getStyleNumber(style, 'arrowHead', 0)));
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(f, 0);
    builder.lineTo(f, 0.5 * height - d);
    builder.lineTo(width - e, 0.5 * height - d);
    builder.lineTo(width - e, 0.5 * height - d - g);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(width - e, 0.5 * height + d + g);
    builder.lineTo(width - e, 0.5 * height + d);
    builder.lineTo(f, 0.5 * height + d);
    builder.lineTo(f, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
