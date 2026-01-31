// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Ios7uiHorButtonBarHandler extends BaseShapeHandler {
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
      getStencilSvg,
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
    let p;
    let q;
    let t = 0;
    let l;
    let m;
    let n;
    let u;

    let f;
    let g;
    let h;
    let k;
    let v = 0;
    let r;
    for (
      f = this.getStyleValue(style, 'buttonText', '+Button 1, Button 2, Button 3')
        .toString()
        .split(','),
        g = this.getStyleValue(style, 'textColor', '#666666'),
        h = this.getStyleValue(style, 'textColor2', '#ffffff'),
        k = this.getStyleValue(style, 'fontSize', '8.5').toString(),
        l = this.getStyleValue(style, 'strokeColor', '#666666'),
        m = this.getStyleValue(style, 'fillColor', '#ffffff'),
        n = this.getStyleValue(style, 'fillColor2', '#008cff'),
        p = f.length,
        q = Array(p),
        t = 0,
        u = -1,
        v = 0;
      v < p;
      v++
    ) {
      r = f[v];
      if (r.charAt(0) === '+') {
        r = f[v].substring(1);
        u = v;
      }
      q[v] = this.measureTextSize(r, k, 'Arial,Helvetica,sans-serif', 0).width;
      t += q[v];
    }
    c = Math.max(c, 1.5 * k, 10);
    t = 5 * p + t;
    b = Math.max(b, t);
    builder.translate(d, y);
    this.renderBackground(
      builder,
      b,
      c,
      2.5,
      p,
      style,
      getStencilSvg,
      renderStencilShape,
      q,
      2.5,
      t,
      l,
      m,
      n,
      u
    );
    builder.setShadow(!1);
    for (v = d = 0; v < p; v++) {
      if (v === u) {
        builder.setFontColor(h as string);
      } else {
        builder.setFontColor(g as string);
      }
      d += 2.5;
      this.render_buttonText(builder, d, c, f[v], q[v], k, t, b);
      d = d + q[v] + 2.5;
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
    getStencilSvg?: RenderContext['getStencilSvg'],
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
    let p;
    let q = 0;
    builder.begin();
    builder.setStrokeColor(extra4 as string);
    builder.setFillColor(extra5 as string);
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
    builder.setStrokeColor(extra4 as string);
    builder.begin();
    for (extra6 = 1; extra6 < height; extra6++) {
      if (extra6 !== extra7 && extra6 !== extra7 + 1) {
        for (p = 0, q = 0; q < extra6; q++) {
          p += extra1[q] + 2 * extra2;
        }
        p = (p * x) / extra3;
        builder.moveTo(p, 0);
        builder.lineTo(p, y);
      }
    }
    builder.stroke();
    p = 0;
    builder.setStrokeColor('none' as string);
    for (extra6 = 0; extra6 < extra7; extra6++) {
      p += extra1[extra6] + 2 * extra2;
    }
    p = (p * x) / extra3;
    extra1 = ((extra1[extra7] + 2 * extra2) * x) / extra3;
    extra1 += p;
    builder.setFillColor('#0080F0' as string);
    if (0 === extra7) {
      builder.begin();
      builder.moveTo(0, width);
      builder.arcTo(width, width, 0, 0, 1, width, 0);
      builder.lineTo(extra1, 0);
      builder.lineTo(extra1, y);
      builder.lineTo(width, y);
      builder.arcTo(width, width, 0, 0, 1, 0, y - width);
      builder.close();
      builder.fill();
    } else if (extra7 === height - 1) {
      builder.begin();
      builder.moveTo(p, 0);
      builder.lineTo(extra1 - width, 0);
      builder.arcTo(width, width, 0, 0, 1, extra1, width);
      builder.lineTo(extra1, y - width);
      builder.arcTo(width, width, 0, 0, 1, extra1 - width, y);
      builder.lineTo(p, y);
      builder.close();
      builder.fill();
    } else if (-1 !== extra7) {
      builder.begin();
      builder.moveTo(p, 0);
      builder.lineTo(extra1, 0);
      builder.lineTo(extra1, y);
      builder.lineTo(p, y);
      builder.close();
      builder.fill();
    }
    builder.setStrokeColor(extra4 as string);
    builder.setFillColor(extra5 as string);
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
