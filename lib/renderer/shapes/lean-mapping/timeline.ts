// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingTimelineHandler extends BaseShapeHandler {
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

    let f;
    let g;
    let h = 0;
    let k;
    builder.translate(d, e);
    f = this.getStyleValue(
      style,
      'mainText',
      '20,Time 1,50,Time 2,30,Time 3,40,Time 4,30,Time 5,50,Time 6,20,Time 7'
    )
      .toString()
      .split(',');
    d = this.getStyleValue(style, 'fontSize', '12');
    e = [];
    for (g = 0, h = 0; h < f.length; h += 2) {
      k = parseFloat(f[h]);
      e.push(k);
      g += k;
    }
    b /= g;
    g = [];
    for (h = 1; h < f.length; h += 2) {
      g.push(f[h]);
    }
    builder.begin();
    f = 0;
    builder.moveTo(0, height);
    for (h = 0; h < g.length; h++) {
      k = e[h] * b;
      f += k;
      if (0 === h % 2) {
        builder.lineTo(f, height);
        builder.lineTo(f, 1.5 * d);
        builder.text(f - 0.5 * k, height - 0.75 * d, 0, 0, g[h], 'center', 'middle', 0, 0, 0);
      } else {
        builder.lineTo(f, 1.5 * d);
        builder.lineTo(f, height);
        builder.text(f - 0.5 * k, 0.75 * d, 0, 0, g[h], 'center', 'middle', 0, 0, 0);
      }
    }
    builder.stroke();
    builder.restore();
  }
}
