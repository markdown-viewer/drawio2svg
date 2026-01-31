// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicPolygonHandler extends ActorShapeHandler {
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

    let f;
    let g;
    try {
      builder.translate(d, y);
      f = JSON.parse(this.getStyleValue(style, 'polyCoords', '[]'));
      g = this.getStyleValue(style, 'polyline', !1);
      if (0 < f.length) {
        builder.begin();
        builder.moveTo(f[0][0] * width, f[0][1] * height);
        for (d = 1; d < f.length; d++) {
          builder.lineTo(f[d][0] * width, f[d][1] * height);
        }
        if (0 == g) {
          builder.close();
        }
        builder.end();
        builder.fillAndStroke();
      }
    } catch (h) {}
    builder.restore();
  }
}
