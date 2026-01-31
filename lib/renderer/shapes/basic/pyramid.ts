// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicPyramidHandler extends ActorShapeHandler {
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
    d = width * Math.max(0, Math.min(width, parseFloat(this.getStyleValue(style, 'dx1', 0.5))));
    e = width * Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx2', 0.6)));
    f = height * Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy1', 0.9)));
    g = height * Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy2', 0.8)));
    builder.begin();
    builder.moveTo(d, 0);
    builder.lineTo(width, g);
    builder.lineTo(e, height);
    builder.lineTo(0, f);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(d, 0);
    builder.lineTo(e, height);
    builder.stroke();
    builder.restore();
  }
}
