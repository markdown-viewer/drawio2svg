// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalMiscellaneousBatteryStackHandler extends BaseShapeHandler {
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
    let h;
    builder.translate(d, e);
    d = 0.3 * height;
    f = this.getStyleValue(style, 'strokeColor', '#000000');
    e = this.getStyleValue(style, 'dashed', '0');
    g = Math.floor((b - 20) / d);
    h = 0.5 * (b - g * d);
    if (0 < g) {
      for (
        builder.begin(),
          builder.moveTo(0, 0.5 * height),
          builder.lineTo(h + 0.2 * d, 0.5 * height),
          builder.moveTo(b - h - 0.2 * d, 0.5 * height),
          builder.lineTo(b, 0.5 * height),
          builder.stroke(),
          b = h,
          builder.setFillColor(f),
          f = 0;
        f < g;
        f++
      ) {
        builder.rect(b + 0.2 * d, 0.25 * height, 0.2 * d, 0.5 * height);
        builder.fillAndStroke();
        builder.begin();
        builder.moveTo(b + 0.8 * d, 0);
        builder.lineTo(b + 0.8 * d, height);
        builder.stroke();
        if (0 < f) {
          builder.setDashed('1');
          builder.begin();
          builder.moveTo(b - 0.2 * d, 0.5 * height);
          builder.lineTo(b + 0.2 * d, 0.5 * height);
          builder.stroke();
          builder.setDashed(e);
        }
        b += d;
      }
    }
    builder.restore();
  }
}
