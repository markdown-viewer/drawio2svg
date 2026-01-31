// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Arrows2SharpArrow2Handler extends ActorShapeHandler {
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
    let k;
    builder.translate(d, e);
    d = 0.5 * height * Math.max(0, Math.min(1, this.getStyleNumber(style, 'dy1', 0.5)));
    e = Math.max(0, Math.min(width, parseFloat(this.getStyleValue(style, 'dx1', 0.5))));
    f = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx2', 0.5)));
    g = 0.5 * height * Math.max(0, Math.min(1, this.getStyleNumber(style, 'dy3', 0.5)));
    h = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx3', 0.5)));
    k = Math.max(0, Math.min(width, this.getStyleNumber(style, 'notch', 0)));
    parseFloat(this.getStyleValue(style, 'dx1', 0.5));
    this.getStyleNumber(style, 'dy1', 0.5);
    builder.begin();
    builder.moveTo(0, d);
    builder.lineTo(width - e, d);
    builder.lineTo(width - h, g);
    builder.lineTo(width - f, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(width - f, height);
    builder.lineTo(width - h, height - g);
    builder.lineTo(width - e, height - d);
    builder.lineTo(0, height - d);
    builder.lineTo(k, 0.5 * height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
