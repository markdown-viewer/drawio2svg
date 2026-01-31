// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupContainersVerTabBarHandler extends BaseShapeHandler {
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
    let f;

    let g;
    let h;
    let k;
    let l;
    let m;
    let n = 0;
    let p;
    for (
      f = this.getStyleValue(style, 'textSize', '17').toString(),
        g = this.getStyleValue(style, 'tabs', 'Tab 1,+Tab 2,Tab 3').toString().split(','),
        h = 1.5 * f,
        k = g.length,
        l = [],
        m = -1,
        n = 0;
      n < k;
      n++
    ) {
      p = g[n];
      if ('+' === p.charAt(0)) {
        p = p.substring(1);
        m = n;
      }
      p = this.measureTextSize(p, f, 'Arial,Helvetica,sans-serif', 0).width;
      l[n] = 0 === p ? 42 : p;
    }
    f = 20 + Math.max.apply(Math, l);
    b = Math.max(b, f + 5);
    c = Math.max(c, 20 + k * h + 5 * (k - 1));
    builder.translate(x, y);
    this.renderBackground(builder, b, c, 5, f, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.render_backTabs(builder, b, c, 5, h, f, 10, 5, 10, k, l, m);
    this.render_focusTab(builder, b, c, 5, h, f, 10, 5, 10, k, l, m);
    this.render_tabText(builder, b, c, 5, h, f, 10, 5, 10, k, l, m, g);
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(height + width, y);
    builder.arcTo(width, width, 0, 0, 1, height, y - width);
    builder.lineTo(height, width);
    builder.arcTo(width, width, 0, 0, 1, height + width, 0);
    builder.lineTo(x, 0);
    builder.lineTo(x, y);
    builder.close();
    builder.fillAndStroke();
  }

  private render_backTabs(
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
    p11: any
  ): void {
    if (!builder) return;
    p1 = this.getStyleValue(this.renderCtx.style, 'tabStyle', 'block');
    for (p2 = 0; p2 < p9; p2++) {
      if (p11 !== p2) {
        if (p1 === 'block') {
          builder.rect(0, p6, p5, p4);
        } else if (p1 === 'round') {
          builder.begin();
          builder.moveTo(p5, p6 + p4 + p3);
          builder.arcTo(p3, p3, 0, 0, 0, p5 - p3, p6 + p4);
          builder.lineTo(p3, p6 + p4);
          builder.arcTo(p3, p3, 0, 0, 1, 0, p6 + p4 - p3);
          builder.lineTo(0, p6 + p3);
          builder.arcTo(p3, p3, 0, 0, 1, p3, p6);
          builder.lineTo(p5 - p3, p6);
          builder.arcTo(p3, p3, 0, 0, 0, p5, p6 - p3);
        }
        builder.fillAndStroke();
      }
      p6 = p6 + p4 + p7;
    }
  }

  private render_focusTab(
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
    p11: any
  ): void {
    if (!builder) return;
    p1 = this.getStyleValue(this.renderCtx.style, 'tabStyle', 'block');
    p8 = this.getStyleValue(this.renderCtx.style, 'fillColor2', '#008cff');
    if (-1 !== p11) {
      p6 += (p4 + p7) * p11;
      builder.setStrokeColor(p8 as string);
      builder.setFillColor(p8 as string);
      if (p1 === 'block') {
        builder.begin();
        builder.moveTo(p5 + p3, p2);
        builder.arcTo(p3, p3, 0, 0, 1, p5, p2 - p3);
        builder.lineTo(p5, p6 + p4);
        builder.lineTo(0, p6 + p4);
        builder.lineTo(0, p6);
        builder.lineTo(p5, p6);
        builder.lineTo(p5, p3);
        builder.arcTo(p3, p3, 0, 0, 1, p5 + p3, 0);
        builder.close();
      } else if (p1 === 'round') {
        builder.begin();
        builder.moveTo(p5 + p3, p2);
        builder.arcTo(p3, p3, 0, 0, 1, p5, p2 - p3);
        builder.lineTo(p5, p6 + p4 + p3);
        builder.arcTo(p3, p3, 0, 0, 0, p5 - p3, p6 + p4);
        builder.lineTo(p3, p6 + p4);
        builder.arcTo(p3, p3, 0, 0, 1, 0, p6 + p4 - p3);
        builder.lineTo(0, p6 + p3);
        builder.arcTo(p3, p3, 0, 0, 1, p3, p6);
        builder.lineTo(p5 - p3, p6);
        builder.arcTo(p3, p3, 0, 0, 0, p5, p6 - p3);
        builder.lineTo(p5, p3);
        builder.arcTo(p3, p3, 0, 0, 1, p5 + p3, 0);
        builder.close();
      }
      builder.fillAndStroke();
    }
  }

  private render_tabText(
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
    p1 = this.getStyleValue(this.renderCtx.style, 'textColor', '#666666');
    p2 = this.getStyleValue(this.renderCtx.style, 'textColor2', '#ffffff');
    p3 = this.getStyleValue(this.renderCtx.style, 'textSize', '17').toString();
    builder.setFontColor(p1 as string);
    builder.setFontSize(Number.parseFloat(String(p3)) || 0);
    for (p3 = 0; p3 < p9; p3++) {
      p8 = p12[p3];
      if (p3 === p11) {
        builder.setFontColor(p2 as string);
      }
      if ('+' === p8.charAt(0)) {
        p8 = p8.substring(1);
      }
      builder.text(0.5 * p5, p6 + 0.5 * p4, 0, 0, p8, 'center', 'middle', 0, 0, 0);
      p6 = p6 + p4 + p7;
      if (p3 === p11) {
        builder.setFontColor(p1 as string);
      }
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
