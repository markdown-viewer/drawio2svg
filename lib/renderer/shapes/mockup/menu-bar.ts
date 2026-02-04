// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupFormsMenuBarHandler extends BaseShapeHandler {
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
      f = this.getStyleValue(style, 'mainText', '+Menu 1, Menu 2, Menu 3').toString().split(','),
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
    builder.setStrokeColor(extra4 as string);
    builder.setFillColor(extra6 as string);
    builder.rect(0, 0, x, y);
    builder.fillAndStroke();
    builder.setStrokeColor(extra5 as string);
    builder.begin();
    for (width = 1; width < height; width++) {
      if (width !== extra8 && width !== extra8 + 1) {
        for (q = extra5 = 0; q < width; q++) {
          extra5 += extra1[q] + 2 * extra2;
        }
        extra5 = (extra5 * x) / extra3;
        builder.moveTo(extra5, 0);
        builder.lineTo(extra5, y);
      }
    }
    builder.stroke();
    if (-1 !== extra8) {
      height = 0;
      builder.setFillColor(extra7 as string);
      for (width = 0; width < extra8; width++) {
        height += extra1[width] + 2 * extra2;
      }
      height = (height * x) / extra3;
      builder.rect(height, 0, ((extra1[extra8] + 2 * extra2) * x) / extra3 + height - height, y);
      builder.fill();
    }
    builder.setStrokeColor(extra4 as string);
    builder.setFillColor(extra6 as string);
    builder.rect(0, 0, x, y);
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
