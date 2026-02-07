// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalAbstractMux2Handler extends BaseShapeHandler {
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
    let l;
    let m;
    builder.translate(d, e);
    d = parseInt(this.getStyleNumber(style, 'selectorPins', 1));
    e = this.getStyleValue(style, 'operation', 'mux');
    f = parseFloat(this.getStyleValue(style, 'fontSize', '12'));
    builder.setFontSize(Number.parseFloat(String(0.5 * f)) || 0);
    f = this.getStyleValue(style, 'fontColor', '#000000');
    builder.setFontColor(f as string);
    f = 0;
    switch (this.getStyleValue(style, 'direction', 'east')) {
      case 'south':
        f = 270;
        break;
      case 'west':
        f = 180;
        break;
      case 'north':
        f = 90;
    }
    switch (e) {
      case 'demux':
        builder.begin();
        builder.moveTo(width - 10, 0);
        builder.lineTo(10, 0.1 * height);
        builder.lineTo(10, 0.9 * height - 10);
        builder.lineTo(width - 10, height - 10);
        builder.close();
        builder.fillAndStroke();
        break;
      default:
        builder.begin();
        builder.moveTo(10, 0);
        builder.lineTo(width - 10, 0.1 * height);
        builder.lineTo(width - 10, 0.9 * height - 10);
        builder.lineTo(10, height - 10);
        builder.close();
        builder.fillAndStroke();
    }
    g = 1;
    h = 1;
    if ('mux' == e) {
      g = Math.pow(2, d);
      k = (height - 16) / g;
    } else {
      h = Math.pow(2, d);
      k = (height - 16) / h;
    }
    l = 3 + 0.5 * k;
    builder.begin();
    if (1 == g) {
      builder.moveTo(0, 0.5 * (height - 10));
      builder.lineTo(10, 0.5 * (height - 10));
    } else {
      for (m = 0; m < g; m++) {
        builder.moveTo(0, l);
        builder.lineTo(10, l);
        builder.text(14, l + 1, 0, 0, '' + m.toString(), 'center', 'middle', 0, 0, f);
        l += k;
      }
    }
    if (1 == h) {
      builder.moveTo(width - 10, 0.5 * (height - 10));
      builder.lineTo(width, 0.5 * (height - 10));
    } else {
      for (m = 0; m < h; m++) {
        builder.moveTo(width - 10, l);
        builder.lineTo(width, l);
        builder.text(width - 14, l + 1, 0, 0, '' + m.toString(), 'center', 'middle', 0, 0, f);
        l += k;
      }
    }
    k = (width - 20) / d;
    g = 10 + 0.5 * k;
    for (m = 0; m < d; m++) {
      if ('mux' == e) {
        builder.moveTo(g, height - 10 - ((g - 10) / (width - 20)) * height * 0.1);
      } else {
        builder.moveTo(g, height - 10 - ((width - g - 10) / (width - 20)) * height * 0.1);
      }
      builder.lineTo(g, height);
      builder.text(
        g + 5,
        height - 4,
        0,
        0,
        'S' + (d - m - 1).toString(),
        'center',
        'middle',
        0,
        0,
        f
      );
      g += k;
    }
    builder.stroke();
    builder.restore();
  }
}
