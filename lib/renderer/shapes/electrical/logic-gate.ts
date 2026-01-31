// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalLogicGatesLogicGateHandler extends BaseShapeHandler {
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
    let h = 0;
    builder.translate(d, e);
    d = parseInt(this.getStyleNumber(style, 'numInputs', 2));
    e = height / d;
    f = 0.5 * e;
    builder.begin();
    builder.moveTo(0.8 * width, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    for (g = this.getStyleValue(style, 'operation', 'and'), h = 0; h < d; h++) {
      builder.moveTo(0, f);
      if ('and' == g) {
        builder.lineTo(0.2 * width, f);
      } else {
        builder.lineTo(0.23 * width, f);
      }
      f += e;
    }
    builder.stroke();
    switch (g) {
      case 'xor':
        (builder.begin(),
          builder.moveTo(0.1 * width, 0),
          builder.arcTo(0.6 * width, height, 0, 0, 1, 0.1 * width, height),
          builder.stroke());
      case 'or':
        builder.begin();
        builder.moveTo(0.4 * width, 0);
        builder.arcTo(0.45 * width, 0.83 * height, 0, 0, 1, 0.8 * width, 0.5 * height);
        builder.arcTo(0.45 * width, 0.83 * height, 0, 0, 1, 0.4 * width, height);
        builder.lineTo(0.15 * width, height);
        builder.arcTo(0.6 * width, height, 0, 0, 0, 0.15 * width, 0);
        builder.close();
        builder.fillAndStroke();
        break;
      default:
        (builder.begin(),
          builder.moveTo(0.2 * width, 0),
          builder.lineTo(0.5 * width, 0),
          builder.arcTo(0.3 * width, 0.5 * height, 0, 0, 1, 0.5 * width, height),
          builder.lineTo(0.2 * width, height),
          builder.close(),
          builder.fillAndStroke());
    }
    if ('1' == this.getStyleValue(style, 'negating', '0')) {
      if (style['negSize']) {
        d = parseFloat(this.getStyleValue(style, 'negSize', '0.13'));
        d = Math.min(width * d * 0.5, height * d);
      } else {
        d = Math.min(0.04 * width, 0.07 * height);
      }
      builder.begin();
      builder.ellipse(0.8 * width, 0.5 * height - 0.5 * d, d, d);
      builder.fillAndStroke();
    }
    builder.restore();
  }
}
