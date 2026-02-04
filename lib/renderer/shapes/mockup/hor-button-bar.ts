// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupButtonsHorButtonBarHandler extends BaseShapeHandler {
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
    let d = x;
    let b = width;
    let c = height;
    let q;
    let t;
    let u = 0;
    let l;
    let m;
    let n;
    let p;
    let v;

    let f;
    let g;
    let h;
    let k;
    let r = 0;
    let w;
    for (
      f = this.getStyleValue(style, 'mainText', '+Button 1, Button 2, Button 3')
        .toString()
        .split(','),
        g = this.getStyleValue(style, 'textColor', '#666666'),
        h = this.getStyleValue(style, 'textColor2', '#ffffff'),
        k = this.getStyleValue(style, 'textSize', '17').toString(),
        l = this.getStyleValue(style, 'strokeColor', '#666666'),
        m = this.getStyleValue(style, 'strokeColor2', '#c4c4c4'),
        n = this.getStyleValue(style, 'fillColor', '#ffffff'),
        p = this.getStyleValue(style, 'fillColor2', '#008cff'),
        q = f.length,
        t = Array(q),
        u = 0,
        v = -1,
        r = 0;
      r < q;
      r++
    ) {
      w = f[r];
      if (w.charAt(0) === '+') {
        w = f[r].substring(1);
        v = r;
      }
      t[r] = this.measureTextSize(w, k, 'Arial,Helvetica,sans-serif', 0).width;
      u += t[r];
    }
    c = Math.max(c, 1.5 * k, 20);
    u = 10 * q + u;
    b = Math.max(b, u);
    builder.translate(d, y);
    this.renderBackground(
      builder,
      b,
      c,
      10,
      q,
      style,
      getStencilShape,
      renderStencilShape,
      t,
      5,
      u,
      l,
      m,
      n,
      p,
      v
    );
    builder.setShadow(!1);
    builder.setFontStyle(1);
    for (r = d = 0; r < q; r++) {
      if (r === v) {
        builder.setFontColor(h as string);
      } else {
        builder.setFontColor(g as string);
      }
      d += 5;
      this.render_buttonText(builder, d, c, f[r], t[r], k, u, b);
      d = d + t[r] + 5;
    }
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any,
    extra3?: any,
    extra4?: any,
    extra5?: any,
    extra6?: any,
    extra7?: any,
    extra8?: any
  ): void {
    if (!builder) return;
    let q;
    let t = 0;
    builder.begin();
    builder.setStrokeColor(extra4 as string);
    builder.setFillColor(extra6 as string);
    builder.moveTo(0, width);
    builder.arcTo(width, width, 0, 0, 1, width, 0);
    builder.lineTo(x - width, 0);
    builder.arcTo(width, width, 0, 0, 1, x, width);
    builder.lineTo(x, y - width);
    builder.arcTo(width, width, 0, 0, 1, x - width, y);
    builder.lineTo(width, y);
    builder.arcTo(width, width, 0, 0, 1, 0, y - width);
    builder.close();
    builder.fillAndStroke();
    builder.setStrokeColor(extra5 as string);
    builder.begin();
    for (extra5 = 1; extra5 < height; extra5++) {
      if (extra5 !== extra8 && extra5 !== extra8 + 1) {
        for (q = 0, t = 0; t < extra5; t++) {
          q += extra1[t] + 2 * extra2;
        }
        q = (q * x) / extra3;
        builder.moveTo(q, 0);
        builder.lineTo(q, y);
      }
    }
    builder.stroke();
    q = 0;
    builder.setFillColor(extra7 as string);
    for (extra5 = 0; extra5 < extra8; extra5++) {
      q += extra1[extra5] + 2 * extra2;
    }
    q = (q * x) / extra3;
    extra1 = ((extra1[extra8] + 2 * extra2) * x) / extra3;
    extra1 += q;
    if (0 === extra8) {
      builder.begin();
      builder.moveTo(0, width);
      builder.arcTo(width, width, 0, 0, 1, width, 0);
      builder.lineTo(extra1, 0);
      builder.lineTo(extra1, y);
      builder.lineTo(width, y);
      builder.arcTo(width, width, 0, 0, 1, 0, y - width);
      builder.close();
      builder.fill();
    } else if (extra8 === height - 1) {
      builder.begin();
      builder.moveTo(q, 0);
      builder.lineTo(extra1 - width, 0);
      builder.arcTo(width, width, 0, 0, 1, extra1, width);
      builder.lineTo(extra1, y - width);
      builder.arcTo(width, width, 0, 0, 1, extra1 - width, y);
      builder.lineTo(q, y);
      builder.close();
      builder.fill();
    } else if (-1 !== extra8) {
      builder.begin();
      builder.moveTo(q, 0);
      builder.lineTo(extra1, 0);
      builder.lineTo(extra1, y);
      builder.lineTo(q, y);
      builder.close();
      builder.fill();
    }
    builder.setStrokeColor(extra4 as string);
    builder.setFillColor(extra6 as string);
    builder.begin();
    builder.moveTo(0, width);
    builder.arcTo(width, width, 0, 0, 1, width, 0);
    builder.lineTo(x - width, 0);
    builder.arcTo(width, width, 0, 0, 1, x, width);
    builder.lineTo(x, y - width);
    builder.arcTo(width, width, 0, 0, 1, x - width, y);
    builder.lineTo(width, y);
    builder.arcTo(width, width, 0, 0, 1, 0, y - width);
    builder.close();
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
    if (p3.charAt(0) === '+') {
      p3 = p3.substring(1);
    }
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
