// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupNavigationBreadcrumbHandler extends BaseShapeHandler {
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
    let p = 0;
    let q = 0;
    for (
      f = decodeURIComponent(
        this.getStyleValue(style, 'mainText', 'Layer 1, Layer 2, Layer 3').toString()
      ).split(','),
        g = this.getStyleValue(style, 'textColor', '#666666'),
        h = this.getStyleValue(style, 'textColor2', '#008cff'),
        k = this.getStyleValue(style, 'textSize', '17').toString(),
        l = this.getStyleValue(style, 'strokeColor', '#c4c4c4'),
        m = f.length,
        n = Array(m),
        p = 0,
        q = 0;
      q < m;
      q++
    ) {
      ((n[q] = this.measureTextSize(f[q], k, 'Arial,Helvetica,sans-serif', 0).width), (p += n[q]));
    }
    c = Math.max(c, 1.5 * k, 20);
    p = 20 * m + p;
    b = Math.max(b, p);
    builder.translate(d, y);
    builder.setShadow(!1);
    this.render_separators(builder, b, c, m, n, 10, p, l);
    for (q = d = 0; q < m; q++) {
      if (q + 1 === m) {
        builder.setFontColor(h as string);
      } else {
        builder.setFontColor(g as string);
      }
      d += 10;
      this.render_buttonText(builder, d, c, f[q], n[q], k, p, b);
      d = d + n[q] + 10;
    }
    builder.restore();
  }

  private render_separators(
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
    let k;
    let l = 0;
    builder.setStrokeColor(p7 as string);
    p2 *= 0.5;
    builder.begin();
    for (p7 = 1; p7 < p3; p7++) {
      for (k = 0, l = 0; l < p7; l++) {
        k += p4[l] + 2 * p5;
      }
      k = (k * p1) / p6;
      builder.moveTo(k - 2.5, p2 - 5);
      builder.lineTo(k + 2.5, p2);
      builder.lineTo(k - 2.5, p2 + 5);
    }
    builder.stroke();
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
    builder.begin();
    builder.setFontSize(Number.parseFloat(String(p5)) || 0);
    builder.text(((p1 + 0.5 * p4) * p7) / p6, 0.5 * p2, 0, 0, p3, 'center', 'middle', 0, 0, 0);
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
