// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapRangeInputHandler extends BaseShapeHandler {
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
    let b = width;

    let f;
    let g;
    let h;
    let k;
    let l;
    let m;
    let n;
    let p;
    let q;
    let t;
    let u;
    f = b * Math.max(0, Math.min(b, this.getStyleNumber(style, 'dx', 0.3)));
    g = this.getStyleValue(style, 'gradientColor', 'none');
    h = this.getStyleValue(style, 'fillColor', '#ffffff');
    k = this.getStyleValue(style, 'strokeColor', '#000000');
    l = this.getStyleValue(style, 'gradientDirection', 'south');
    m = this.getStyleValue(style, 'rangeStyle', 'rounded');
    n = this.getStyleValue(style, 'handleStyle', 'circle');
    p = Math.min(0.5 * height, 0.5 * b);
    q = 0.5 * p;
    builder.translate(d, y);
    if ('rect' == m) {
      t = d = parseFloat(this.getStyleValue(style, 'opacity', '100'));
      u = d;
      if ('none' == h) {
        t = 0;
      }
      if ('none' == g) {
        u = 0;
      }
      builder.setGradient(h, h, 0, 0, b, height, l, t, u);
      builder.rect(0, 0.5 * height - 2, b, 4);
      builder.fill();
    } else if ('rounded' == m) {
      builder.begin();
      builder.moveTo(0, 0.5 * height);
      builder.arcTo(q, q, 0, 0, 1, q, 0.5 * height - q);
      builder.lineTo(b - q, 0.5 * height - q);
      builder.arcTo(q, q, 0, 0, 1, b, 0.5 * height);
      builder.arcTo(q, q, 0, 0, 1, b - q, 0.5 * height + q);
      builder.lineTo(q, 0.5 * height + q);
      builder.arcTo(q, q, 0, 0, 1, 0, 0.5 * height);
      builder.close();
      builder.fill();
    }
    if ('rect' == n) {
      builder.setGradient(h, g, 0, 0, b, height, l, t, u);
      b = 0.5 * height;
      builder.rect(f - 0.5 * b, 0, b, height);
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(f - 0.25 * b, 0.3 * height);
      builder.lineTo(f + 0.25 * b, 0.3 * height);
      builder.moveTo(f - 0.25 * b, 0.5 * height);
      builder.lineTo(f + 0.25 * b, 0.5 * height);
      builder.moveTo(f - 0.25 * b, 0.7 * height);
      builder.lineTo(f + 0.25 * b, 0.7 * height);
      builder.stroke();
    } else if ('circle' == n) {
      builder.setFillColor(k as string);
      builder.ellipse(f - p, 0, 2 * p, 2 * p);
      builder.fill();
    }
    builder.restore();
  }
}
