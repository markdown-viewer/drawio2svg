// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIButtonBarHandler extends BaseShapeHandler {
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
    let p;
    let l;
    let m;
    let n;
    let t;

    let f;
    let g;
    let h;
    let k;
    let q = 0;
    let u = 0;
    let v;
    let r;
    let w;
    for (
      f = decodeURIComponent(
        this.getStyleValue(style, 'buttonText', '+Button 1, Button 2, Button 3').toString()
      ).split(','),
        g = this.getStyleValue(style, 'textColor', '#666666'),
        h = this.getStyleValue(style, 'textColor2', '#ffffff'),
        k = this.getStyleValue(style, 'fontSize', '17').toString(),
        l = this.getStyleValue(style, 'strokeColor', '#666666'),
        m = this.getStyleValue(style, 'strokeColor2', '#c4c4c4'),
        n = this.getStyleValue(style, 'fillColor', '#ffffff'),
        p = f.length,
        q = 0,
        t = -1,
        u = 0;
      u < p;
      u++
    ) {
      v = f[u];
      if (v.charAt(0) === '+') {
        v = f[u].substring(1);
        t = u;
      }
      v = this.measureTextSize(v, k, 'Arial,Helvetica,sans-serif', 0).width;
      if (v > q) {
        q = v;
      }
    }
    r = 1.5 * k;
    w = p * r;
    c = Math.max(c, w);
    b = Math.max(b, 5 + q);
    builder.translate(x, y);
    this.renderBackground(
      builder,
      b,
      c,
      2.5,
      p,
      style,
      getStencilSvg,
      renderStencilShape,
      2.5,
      p * r,
      l,
      m,
      n,
      t,
      r
    );
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      b,
      c,
      2.5,
      p,
      style,
      getStencilSvg,
      renderStencilShape,
      2.5,
      p * r,
      l,
      m,
      n,
      t,
      r
    );
    for (u = v = 0; u < p; u++) {
      if (u === t) {
        builder.setFontColor(h as string);
      } else {
        builder.setFontColor(g as string);
      }
      v += 2.5;
      this.render_buttonText(builder, b, ((u * r + 0.5 * r) * c) / w, f[u], k, m);
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
    builder.begin();
    builder.setStrokeWidth(1);
    builder.setStrokeColor(extra3 as string);
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
  }

  private renderForeground(
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
    extra1 = this.getStyleValue(style, 'strokeWidth', '1');
    builder.setStrokeWidth(extra1);
    builder.setStrokeColor(extra4 as string);
    builder.begin();
    for (extra4 = 1; extra4 < height; extra4++) {
      if (extra4 !== extra6 && extra4 !== extra6 + 1) {
        extra1 = (extra4 * extra7 * y) / extra2;
        builder.moveTo(0, extra1);
        builder.lineTo(x, extra1);
      }
    }
    builder.stroke();
    builder.setStrokeColor('none' as string);
    if (0 === extra6) {
      builder.begin();
      extra2 = (extra7 * y) / extra2;
      builder.setGradient('#5D7585', '#008cff', 0, 0, x, extra2, 'south', 1, 1);
      builder.moveTo(0, width);
      builder.arcTo(width, width, 0, 0, 1, width, 0);
      builder.lineTo(x - width, 0);
      builder.arcTo(width, width, 0, 0, 1, x, width);
      builder.lineTo(x, extra2);
      builder.lineTo(0, extra2);
      builder.close();
      builder.fill();
    } else if (extra6 === height - 1) {
      builder.begin();
      height = y - (extra7 * y) / extra2;
      builder.setGradient('#5D7585', '#008cff', 0, height, x, y - height, 'south', 1, 1);
      builder.moveTo(0, height);
      builder.lineTo(x, height);
      builder.lineTo(x, y - width);
      builder.arcTo(width, width, 0, 0, 1, x - width, y);
      builder.lineTo(width, y);
      builder.arcTo(width, width, 0, 0, 1, 0, y - width);
      builder.close();
      builder.fill();
    } else if (-1 !== extra6) {
      builder.begin();
      height = (extra7 * extra6 * y) / extra2;
      extra2 = (extra7 * (extra6 + 1) * y) / extra2;
      builder.setGradient('#5D7585', '#008cff', 0, height, x, extra2 - height, 'south', 1, 1);
      builder.moveTo(0, height);
      builder.lineTo(x, height);
      builder.lineTo(x, extra2);
      builder.lineTo(0, extra2);
      builder.close();
      builder.fill();
    }
    builder.begin();
    builder.setStrokeColor(extra3 as string);
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
    builder.stroke();
  }

  private render_buttonText(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any
  ): void {
    if (!builder) return;
    if (p3.charAt(0) === '+') {
      p3 = p3.substring(1);
    }
    builder.setFontSize(Number.parseFloat(String(p4)) || 0);
    builder.text(10, p2, 0, 0, p3, 'left', 'middle', 0, 0, 0);
    p3 = 0.5 * p4;
    builder.setStrokeWidth(0.3 * p4);
    builder.setStrokeColor(p5 as string);
    builder.begin();
    builder.moveTo(p1 - 20 - p3, p2 - p3);
    builder.lineTo(p1 - 20, p2);
    builder.lineTo(p1 - 20 - p3, p2 + p3);
    builder.stroke();
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
