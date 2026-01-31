// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Ios7uiIconGridHandler extends BaseShapeHandler {
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
    let b = width;
    let c = height;

    let f;
    builder.translate(d, e);
    d = decodeURIComponent(this.getStyleValue(style, 'gridSize', '4,7').toString()).split(',');
    b /= parseInt(d[0], 10) + 0.1 * (d[0] - 1);
    c /= parseInt(d[1], 10) + 0.1 * (d[1] - 1);
    for (e = 0; e < d[0]; e++) {
      for (f = 0; f < d[1]; f++) {
        (builder.rect(1.1 * b * e, 1.1 * c * f, b, c), builder.fill());
      }
    }
    builder.restore();
  }
}
