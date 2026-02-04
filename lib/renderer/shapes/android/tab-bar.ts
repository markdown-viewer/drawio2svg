// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class AndroidTabBarHandler extends BaseShapeHandler {
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
      f = this.getStyleValue(style, 'mainText', '+Tab 1, Tab 2, Tab 3').toString().split(','),
        g = this.getStyleValue(style, 'textColor', 'none'),
        h = this.getStyleValue(style, 'textColor2', 'none'),
        k = this.getStyleValue(style, 'textSize', '17').toString(),
        l = this.getStyleValue(style, 'strokeColor', 'none'),
        m = this.getStyleValue(style, 'strokeColor2', 'none'),
        n = this.getStyleValue(style, 'fillColor', '#ffffff'),
        p = this.getStyleValue(style, 'fillColor2', 'none'),
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
    c = Math.max(c, 1.5 * k, 7);
    u = 10 * q + u;
    b = Math.max(b, u);
    builder.translate(d, y);
    this.renderBackground(
      builder,
      b,
      c,
      q,
      t,
      style,
      getStencilShape,
      renderStencilShape,
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
    extra7?: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.setStrokeColor(extra3 as string);
    builder.setFillColor(extra5 as string);
    builder.rect(0, 0, x, y);
    builder.fillAndStroke();
    builder.setStrokeColor(extra4 as string);
    builder.begin();
    for (extra3 = 1; extra3 < width; extra3++) {
      if (extra3 !== extra7 && extra3 !== extra7 + 1) {
        for (extra5 = extra4 = 0; extra5 < extra3; extra5++) {
          extra4 += height[extra5] + 2 * extra1;
        }
        extra4 = (extra4 * x) / extra2;
        builder.moveTo(extra4, 0.2 * y);
        builder.lineTo(extra4, 0.8 * y);
      }
    }
    builder.stroke();
    width = 0;
    builder.setFillColor(extra6 as string);
    for (extra3 = 0; extra3 < extra7; extra3++) {
      width += height[extra3] + 2 * extra1;
    }
    width = (width * x) / extra2;
    x = ((height[extra7] + 2 * extra1) * x) / extra2;
    x += width;
    builder.rect(width, 0, x - width, y);
    builder.fill();
    builder.setAlpha(1);
    builder.setFillColor('#33b5e5' as string);
    builder.rect(width, 0.9 * y, x - width, 0.1 * y);
    builder.fill();
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
