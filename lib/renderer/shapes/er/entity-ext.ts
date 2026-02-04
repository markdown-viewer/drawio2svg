// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ErEntityExtHandler extends BaseShapeHandler {
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
    f = this.getStyleValue(style, 'buttonText', 'Entity');
    g = this.getStyleValue(style, 'subText', '+ attribute 1,+ attribute 2,+ attribute 3')
      .toString()
      .split(',');
    h = this.getStyleValue(style, 'strokeColor', '#666666');
    k = this.getStyleValue(style, 'fontSize', '17');
    l = this.getStyleValue(style, 'fillColor', '#008cff');
    m = this.getStyleValue(style, 'fillColor2', '#ffffff');
    n = 0;
    builder.translate(x, y);
    for (p = 1.25 * k, q = 0; q < g.length; q++) {
      t = this.measureTextSize(g[q], k, 'Arial,Helvetica,sans-serif', 0).width;
      if (t > n) {
        n = t;
      }
    }
    b = Math.max(b, 20, n + 10);
    c = Math.max(c, 20, (g.length + 1) * p);
    this.renderBackground(builder, x, y, b, c, style, getStencilShape, renderStencilShape, 10);
    builder.setShadow(!1);
    this.render_shapes(builder, x, y, b, c, k, l, m, 10, p);
    this.render_mainText(builder, x, y, b, c, f, k, m);
    this.render_attrText(builder, x, y, b, c, g, k, h, p, 10);
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
    extra1?: any
  ): void {
    if (!builder) return;
    x = this.getStyleValue(style, 'buttonStyle', 'round').toString();
    builder.begin();
    if ('round' === x) {
      builder.moveTo(0, extra1);
      builder.arcTo(extra1, extra1, 0, 0, 1, extra1, 0);
      builder.lineTo(width - extra1, 0);
      builder.arcTo(extra1, extra1, 0, 0, 1, width, extra1);
      builder.lineTo(width, height - extra1);
      builder.arcTo(extra1, extra1, 0, 0, 1, width - extra1, height);
      builder.lineTo(extra1, height);
      builder.arcTo(extra1, extra1, 0, 0, 1, 0, height - extra1);
    } else if ('rect' === x) {
      builder.moveTo(0, 0);
      builder.lineTo(width, 0);
      builder.lineTo(width, height);
      builder.lineTo(0, height);
    }
    builder.close();
    builder.fillAndStroke();
  }

  private render_shapes(
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
    p1 = this.getStyleValue(this.renderCtx.style, 'buttonStyle', 'round').toString();
    if ('round' === p1) {
      builder.begin();
      builder.moveTo(0, p8);
      builder.arcTo(p8, p8, 0, 0, 1, p8, 0);
      builder.lineTo(p3 - p8, 0);
      builder.arcTo(p8, p8, 0, 0, 1, p3, p8);
      builder.lineTo(p3, p9);
      builder.lineTo(0, p9);
      builder.close();
      builder.fill();
      builder.setFillColor(p7 as string);
      builder.begin();
      builder.moveTo(p3, p9);
      builder.lineTo(p3, p4 - p8);
      builder.arcTo(p8, p8, 0, 0, 1, p3 - p8, p4);
      builder.lineTo(p8, p4);
      builder.arcTo(p8, p8, 0, 0, 1, 0, p4 - p8);
      builder.lineTo(0, p9);
      builder.close();
      builder.fill();
    } else if ('rect' === p1) {
      builder.begin();
      builder.moveTo(0, 0);
      builder.lineTo(p3, 0);
      builder.lineTo(p3, p9);
      builder.lineTo(0, p9);
      builder.close();
      builder.fill();
      builder.setFillColor(p7 as string);
      builder.begin();
      builder.moveTo(0, p9);
      builder.lineTo(p3, p9);
      builder.lineTo(p3, p4);
      builder.lineTo(0, p4);
      builder.close();
      builder.fill();
    }
    builder.begin();
    if ('round' === p1) {
      builder.moveTo(0, p8);
      builder.arcTo(p8, p8, 0, 0, 1, p8, 0);
      builder.lineTo(p3 - p8, 0);
      builder.arcTo(p8, p8, 0, 0, 1, p3, p8);
      builder.lineTo(p3, p4 - p8);
      builder.arcTo(p8, p8, 0, 0, 1, p3 - p8, p4);
      builder.lineTo(p8, p4);
      builder.arcTo(p8, p8, 0, 0, 1, 0, p4 - p8);
    } else if ('rect' === p1) {
      builder.moveTo(0, 0);
      builder.lineTo(p3, 0);
      builder.lineTo(p3, p4);
      builder.lineTo(0, p4);
    }
    builder.close();
    builder.stroke();
  }

  private render_mainText(
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
    builder.setFontSize(Number.parseFloat(String(p6)) || 0);
    builder.setFontColor(p7 as string);
    builder.text(0.5 * p3, 0.5 * p6, 0, 0, p5, 'center', 'middle', 0, 0, 0);
  }

  private render_attrText(
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
    for (p1 = 0; p1 < p5.length; p1++) {
      (builder.begin(),
        builder.setFontSize(p6),
        builder.setFontColor(p7),
        builder.text(0.5 * p9, (p1 + 1.5) * p8, 0, 0, p5[p1], 'left', 'middle', 0, null, 0, 0, 0));
    }
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
