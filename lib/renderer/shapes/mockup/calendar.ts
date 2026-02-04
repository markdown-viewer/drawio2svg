// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupFormsCalendarHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const {
      builder,
      currentGroup,
      applyShapeAttrsToBuilder,
      x,
      y,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
    } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    builder.translate(x, y);
    this.renderBackground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.restore();
  }

  private renderBackground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.roundrect(0, 0, width, height, 0.0312 * width, 0.0286 * height);
    builder.fillAndStroke();
  }

  private renderForeground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    let b;
    let c;
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
    let v;
    let r;
    let w;
    let fistDay;
    b = this.getStyleValue(style, 'strokeColor', '#999999');
    c = this.getStyleValue(style, 'fillColor', '#ffffff');
    f = this.getStyleValue(style, 'strokeColor2', '#008cff');
    g = this.getStyleValue(style, 'fillColor2', '#ddeeff');
    h = this.getStyleValue(style, 'mainText', '');
    k = this.getStyleValue(style, 'textSize', '15');
    l = this.getStyleValue(style, 'textColor', '#999999');
    m = this.getStyleValue(style, 'textColor2', '#ffffff');
    n = parseInt(this.getStyleValue(style, 'days', '30'), 10);
    p = parseInt(this.getStyleValue(style, 'prevDays', '31'), 10);
    q = parseInt(this.getStyleValue(style, 'firstDay', '0'), 10);
    t = parseInt(this.getStyleValue(style, 'startOn', '6'));
    u = this.getStyleValue(style, 'dayNames', 'Mo,Tu,We,Th,Fr,Sa,Su').toString().split(',');
    v = parseInt(this.getStyleValue(style, 'selDay', '24'), 10);
    fistDay = Math.max(q, 0);
    t = Math.max(t, 0);
    fistDay = Math.min(q, 6);
    t = Math.min(t, 6);
    builder.roundrect(
      0.05 * width,
      0.0457 * height,
      0.1438 * width,
      0.1029 * height,
      0.025 * width,
      0.0229 * height
    );
    builder.stroke();
    builder.roundrect(
      0.8125 * width,
      0.0457 * height,
      0.1438 * width,
      0.1029 * height,
      0.025 * width,
      0.0229 * height
    );
    builder.stroke();
    builder.setStrokeWidth(2);
    builder.setStrokeColor(f as string);
    builder.begin();
    builder.moveTo(0.1438 * width, 0.0743 * height);
    builder.lineTo(0.1 * width, 0.0971 * height);
    builder.lineTo(0.1438 * width, 0.12 * height);
    builder.moveTo(0.8625 * width, 0.0743 * height);
    builder.lineTo(0.9062 * width, 0.0971 * height);
    builder.lineTo(0.8625 * width, 0.12 * height);
    builder.stroke();
    builder.setFontSize(Number.parseFloat(String(k)) || 0);
    builder.setFontColor(l as string);
    builder.text(0.5 * width, 0.0971 * height, 0, 0, h, 'center', 'middle', 0, 0, 0);
    h = (0.875 * width) / 7;
    for (k = 0; 7 > k; k++) {
      l = 0.0625 * width + 0.5 * h + k * h;
      r = k + t;
      if (6 < r) {
        r -= 7;
      }
      builder.text(l, 0.2114 * height, 0, 0, u[r], 'center', 'middle', 0, 0, 0);
    }
    builder.setStrokeWidth(1);
    w = 0;
    r = u = -1;
    if (q !== t) {
      builder.setStrokeColor(b as string);
      builder.setFillColor(g as string);
      q -= t;
      if (0 > q) {
        q += 7;
      }
      for (k = 0; k < q; k++) {
        ((l = 0.0625 * width + k * h),
          builder.rect(l, 0.2686 * height, h, 0.1143 * height),
          builder.fillAndStroke(),
          builder.text(
            l + 0.5 * h,
            0.2686 * height + 0.5 * h,
            0,
            0,
            (p - q + k + 1).toString(),
            'center',
            'middle',
            0,
            null,
            0,
            0,
            0
          ));
      }
      w = q;
    }
    builder.setFillColor(c as string);
    builder.setStrokeColor(b as string);
    for (k = b = 0; k < n; k++) {
      c = k + 1;
      l = 0.0625 * width + w * h;
      p = 0.2686 * height + b * height * 0.1143;
      if (c === v) {
        u = l;
        r = p;
      } else {
        builder.rect(l, p, h, 0.1143 * height);
        builder.fillAndStroke();
        builder.text(l + 0.5 * h, p + 0.5 * h, 0, 0, c.toString(), 'center', 'middle', 0, 0, 0);
      }
      if (6 > w) {
        w++;
      } else {
        w = 0;
        b++;
      }
    }
    k = 1;
    for (builder.setFillColor(g); 6 > b; ) {
      l = 0.0625 * width + w * h;
      p = 0.2686 * height + b * height * 0.1143;
      builder.rect(l, p, h, 0.1143 * height);
      builder.fillAndStroke();
      builder.text(l + 0.5 * h, p + 0.5 * h, 0, 0, k.toString(), 'center', 'middle', 0, 0, 0);
      if (6 > w) {
        w++;
      } else {
        w = 0;
        b++;
      }
      k++;
    }
    if (0 <= u) {
      builder.setStrokeColor('#ff0000' as string);
      builder.setStrokeWidth(2);
      builder.setFillColor(f as string);
      builder.setFontColor(m as string);
      builder.rect(u, r, h, 0.1143 * height);
      builder.fillAndStroke();
      builder.text(u + 0.5 * h, r + 0.5 * h, 0, 0, v.toString(), 'center', 'middle', 0, 0, 0);
    }
  }
}
