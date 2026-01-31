// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupNavigationStepBarHandler extends BaseShapeHandler {
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
    let c = height;

    let f;
    let g;
    let h;
    let k;
    let l;
    let m;
    let n;
    let p;
    let q = 0;
    let t;
    let u = 0;
    let v;
    for (
      f = decodeURIComponent(
        this.getStyleValue(style, 'mainText', 'Step 1, Step 2, Step 3').toString()
      ).split(','),
        g = this.getStyleValue(style, 'textColor', '#666666'),
        h = this.getStyleValue(style, 'textColor2', '#008cff'),
        k = this.getStyleValue(style, 'textSize', '17').toString(),
        l = this.getStyleValue(style, 'strokeColor', '#c4c4c4'),
        m = this.getStyleValue(style, 'fillColor', '#666666'),
        n = f.length,
        p = Array(n),
        q = 0,
        t = -1,
        u = 0;
      u < n;
      u++
    ) {
      v = f[u];
      if (v.charAt(0) === '+') {
        v = f[u].substring(1);
        t = u;
      }
      p[u] = this.measureTextSize(v, k, 'Arial,Helvetica,sans-serif', 0).width;
      q += p[u];
    }
    c = Math.max(c, 1.5 * k, 20);
    q = 20 * n + q;
    b = Math.max(b, q);
    builder.translate(d, y);
    this.render_stepLineBg(builder, b, c, n, p, 10, q, l, k, b);
    builder.setShadow(!1);
    this.render_stepLineFg(builder, b, c, n, p, 10, q, l, m, h, k, b, t);
    for (u = d = 0; u < n; u++) {
      if (u >= t) {
        builder.setFontColor(h as string);
      } else {
        builder.setFontColor(g as string);
      }
      d += 10;
      this.render_buttonText(builder, d, c, f[u], p[u], k, q, b);
      d = d + p[u] + 10;
    }
    builder.restore();
  }

  private render_stepLineBg(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any,
    p7: any,
    p8: any,
    p9: any
  ): void {
    if (!builder) return;
    let m;
    let n = 0;
    builder.setStrokeColor(p7 as string);
    builder.setFillColor(p7 as string);
    p2 = 2 * p8;
    for (p9 = p8 = p7 = 0; p9 < p3; p9++) {
      for (m = 0, n = 0; n < p9; n++) {
        m += p4[n] + 2 * p5;
      }
      m += 0.5 * p4[p9] + p5;
      m = (m * p1) / p6;
      if (0 === p9) {
        p7 = m;
      } else if (p9 + 1 === p3) {
        p8 = m;
      }
      builder.begin();
      builder.ellipse(m - 10, p2 - 10, 20, 20);
      builder.fillAndStroke();
    }
    builder.begin();
    builder.rect(p7, p2 - 2, p8 - p7, 4);
    builder.fillAndStroke();
  }

  private render_stepLineFg(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any,
    p7: any,
    p8: any,
    p9: any,
    p10: any,
    p11: any,
    p12: any
  ): void {
    if (!builder) return;
    let q;
    let t;
    let u = 0;
    builder.setStrokeColor(p8 as string);
    p2 = 2 * p10;
    p10 = p3 = 0;
    p11 = this.getStyleValue(this.renderCtx.style, 'strokeWidth', '1');
    for (q = 0; q <= p12; q++) {
      for (t = 0, u = 0; u < q; u++) {
        t += p4[u] + 2 * p5;
      }
      t += 0.5 * p4[q] + p5;
      t = (t * p1) / p6;
      if (0 === q) {
        p3 = t;
      } else if (q === p12) {
        p10 = t;
      }
    }
    builder.setFillColor(p8 as string);
    builder.begin();
    builder.rect(p3, p2 - 1.125, p10 - p3, 2.25);
    builder.fill();
    builder.setFillColor(p7 as string);
    for (q = 0; q <= p12; q++) {
      for (u = t = 0; u < q; u++) {
        t += p4[u] + 2 * p5;
      }
      t += 0.5 * p4[q] + p5;
      t = (t * p1) / p6;
      if (q < p12) {
        builder.setStrokeWidth(p11);
        builder.begin();
        builder.ellipse(t - 7.5, p2 - 7.5, 15, 15);
        builder.fillAndStroke();
        builder.setStrokeWidth(0.5 * p11);
        builder.begin();
        builder.ellipse(t - 4.5, p2 - 4.5, 9, 9);
      } else {
        builder.setStrokeWidth(p11);
        builder.setFillColor(p7 as string);
        builder.setStrokeColor(p7 as string);
        builder.begin();
        builder.ellipse(t - 10, p2 - 10, 20, 20);
        builder.fillAndStroke();
        builder.setStrokeWidth(p11);
        builder.setFillColor('#ffffff' as string);
        builder.setStrokeColor('#ffffff' as string);
        builder.begin();
        builder.ellipse(t - 7.5, p2 - 7.5, 15, 15);
        builder.fillAndStroke();
        builder.setFillColor(p9 as string);
        builder.setStrokeColor(p9 as string);
        builder.setStrokeWidth(0.5 * p11);
        builder.begin();
        builder.ellipse(t - 5.25, p2 - 5.25, 10.5, 10.5);
      }
      builder.fillAndStroke();
    }
  }

  private render_buttonText(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any,
    p7: any
  ): void {
    if (!builder) return;
    if (p3.charAt(0) === '+') {
      p3 = p3.substring(1);
    }
    builder.begin();
    builder.setFontSize(Number.parseFloat(String(p5)) || 0);
    builder.text(((p1 + 0.5 * p4) * p7) / p6, 0.5 * p5, 0, 0, p3, 'center', 'middle', 0, 0, 0);
  }

  private measureTextSize(
    text: any,
    fontSize: number,
    fontFamily: string,
    fontStyle?: string
  ): { width: number; height: number } {
    try {
      const provider = this.renderCtx?.getTextMeasureProvider?.();
      if (!provider || !provider.measureText) return { width: 0, height: 0 };
      const raw = text == null ? '' : String(text);
      let fontWeight = 'normal';
      let fontStyleNormalized = 'normal';
      if (fontStyle && (fontStyle & 1) === 1) fontWeight = 'bold';
      if (fontStyle && (fontStyle & 2) === 2) fontStyleNormalized = 'italic';
      const result = provider.measureText(
        raw,
        fontSize,
        fontFamily,
        fontWeight,
        fontStyleNormalized,
        false
      );
      return { width: Math.round(result.width), height: Math.round(result.height) };
    } catch {
      return { width: 0, height: 0 };
    }
  }
}
