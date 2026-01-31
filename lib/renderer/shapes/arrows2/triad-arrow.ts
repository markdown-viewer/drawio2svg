// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Arrows2TriadArrowHandler extends ActorShapeHandler {
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
    d = Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy', 0.5)));
    e = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    f = Math.max(0, Math.min(height, this.getStyleNumber(style, 'arrowHead', 0)));
    builder.begin();
    builder.moveTo(0.5 * width + 0.5 * f - d, height - f + d);
    builder.lineTo(width - e, height - f + d);
    builder.lineTo(width - e, height - f);
    builder.lineTo(width, height - 0.5 * f);
    builder.lineTo(width - e, height);
    builder.lineTo(width - e, height - d);
    builder.lineTo(e, height - d);
    builder.lineTo(e, height);
    builder.lineTo(0, height - 0.5 * f);
    builder.lineTo(e, height - f);
    builder.lineTo(e, height - f + d);
    builder.lineTo(0.5 * width - 0.5 * f + d, height - f + d);
    builder.lineTo(0.5 * width - 0.5 * f + d, e);
    builder.lineTo(0.5 * width - 0.5 * f, e);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(0.5 * width + 0.5 * f, e);
    builder.lineTo(0.5 * width + 0.5 * f - d, e);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
