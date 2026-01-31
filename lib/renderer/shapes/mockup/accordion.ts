// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupContainersAccordionHandler extends BaseShapeHandler {
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
    let b = width;
    let c = height;
    let q;
    let l;
    let m;
    let n;
    let p;
    let u;

    let f;
    let g;
    let h;
    let k;
    let t = 0;
    let v = 0;
    let r;
    let w;
    for (
      f = this.getStyleValue(style, 'mainText', '+Group 1, Group 2, Group 3').toString().split(','),
        g = this.getStyleValue(style, 'textColor', '#666666'),
        h = this.getStyleValue(style, 'textColor2', '#ffffff'),
        k = this.getStyleValue(style, 'textSize', '17').toString(),
        l = this.getStyleValue(style, 'strokeColor', '#666666'),
        m = this.getStyleValue(style, 'strokeColor2', '#c4c4c4'),
        n = this.getStyleValue(style, 'fillColor', '#ffffff'),
        p = this.getStyleValue(style, 'fillColor2', '#008cff'),
        q = f.length,
        t = 0,
        u = -1,
        v = 0;
      v < q;
      v++
    ) {
      r = f[v];
      if (r.charAt(0) === '+') {
        r = f[v].substring(1);
        u = v;
      }
      r = this.measureTextSize(r, k, 'Arial,Helvetica,sans-serif', 0).width;
      if (r > t) {
        t = r;
      }
    }
    w = 1.5 * k;
    c = Math.max(c, q * w);
    b = Math.max(b, 10 + t);
    builder.translate(x, y);
    this.renderBackground(
      builder,
      b,
      c,
      10,
      q,
      style,
      getStencilSvg,
      renderStencilShape,
      5,
      q * w,
      l,
      m,
      n,
      p,
      u,
      w
    );
    builder.setShadow(!1);
    for (v = r = 0; v < q; v++) {
      if (v === u) {
        builder.setFontColor(h as string);
      } else {
        builder.setFontColor(g as string);
      }
      r += 5;
      this.render_buttonText(
        builder,
        b,
        -1 === u || v <= u ? v * w + 0.5 * w : c - (q - v - 0.5) * w,
        f[v],
        k
      );
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
    extra7?: any,
    extra8?: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.setStrokeColor(extra3 as string);
    builder.setFillColor(extra5 as string);
    builder.moveTo(0, 0);
    builder.lineTo(x, 0);
    builder.lineTo(x, y);
    builder.lineTo(0, y);
    builder.close();
    builder.fillAndStroke();
    builder.setStrokeColor(extra4 as string);
    builder.begin();
    for (width = 1; width < height; width++) {
      if (width !== extra7) {
        extra1 = -1 === extra7 || width < extra7 ? width * extra8 : y - (height - width) * extra8;
        builder.moveTo(0, extra1);
        builder.lineTo(x, extra1);
      }
    }
    builder.stroke();
    builder.setStrokeColor('none' as string);
    builder.setFillColor(extra6 as string);
    if (-1 !== extra7) {
      builder.begin();
      height = extra8 * extra7;
      extra7 = extra8 * (extra7 + 1);
      builder.moveTo(0, height);
      builder.lineTo(x, height);
      builder.lineTo(x, extra7);
      builder.lineTo(0, extra7);
      builder.close();
      builder.fill();
    }
    builder.begin();
    builder.setStrokeColor(extra3 as string);
    builder.setFillColor(extra5 as string);
    builder.moveTo(0, 0);
    builder.lineTo(x, 0);
    builder.lineTo(x, y);
    builder.lineTo(0, y);
    builder.close();
    builder.stroke();
  }

  private render_buttonText(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    if (p3.charAt(0) === '+') {
      p3 = p3.substring(1);
    }
    builder.begin();
    builder.setFontSize(Number.parseFloat(String(p4)) || 0);
    builder.text(0.5 * p1, p2, 0, 0, p3, 'center', 'middle', 0, 0, 0);
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
