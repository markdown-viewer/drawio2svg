// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupContainersHorTabBarHandler extends BaseShapeHandler {
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
    let h;

    let f;
    let g;
    let k;
    let l;
    let m;
    let n;
    let p = 0;
    let q;
    let currW;
    for (
      f = this.getStyleValue(style, 'textSize', '17').toString(),
        g = this.getStyleValue(style, 'tabs', 'Tab 1,+Tab 2,Tab 3').toString().split(','),
        h = 1.5 * f,
        k = g.length,
        l = 20 + 5 * (k - 1) + 20 * k,
        m = [],
        n = -1,
        p = 0;
      p < k;
      p++
    ) {
      q = g[p];
      if ('+' === q.charAt(0)) {
        q = q.substring(1);
        n = p;
      }
      currW = this.measureTextSize(q, f, 'Arial,Helvetica,sans-serif', 0).width;
      m[p] = 0 === currW ? 40 : currW;
      l += m[p];
    }
    b = Math.max(b, l);
    c = Math.max(c, h + 5);
    builder.translate(x, y);
    this.renderBackground(builder, b, c, 5, h, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.render_backTabs(builder, b, c, 5, h, 10, 5, 10, k, m, n);
    this.render_focusTab(builder, b, c, 5, h, 10, 5, 10, k, m, n);
    this.render_tabText(builder, b, c, 5, h, 10, 5, 10, k, m, n, g);
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
    builder.moveTo(0, height + width);
    builder.arcTo(width, width, 0, 0, 1, width, height);
    builder.lineTo(x - width, height);
    builder.arcTo(width, width, 0, 0, 1, x, height + width);
    builder.lineTo(x, y);
    builder.lineTo(0, y);
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
    p10: any
  ): void {
    if (!builder) return;
    let n;
    p1 = this.getStyleValue(this.renderCtx.style, 'tabStyle', 'block');
    for (p2 = 0; p2 < p8; p2++) {
      n = p9[p2] + 2 * p7;
      if (p10 !== p2) {
        if (p1 === 'block') {
          builder.rect(p5, 0, n, p4);
        } else if (p1 === 'cone') {
          builder.begin();
          builder.moveTo(p5, p4);
          builder.lineTo(p5 + 0.5 * p7, 0);
          builder.lineTo(p5 + n - 0.5 * p7, 0);
          builder.lineTo(p5 + n, p4);
        } else if (p1 === 'halfCone') {
          builder.begin();
          builder.moveTo(p5, p4);
          builder.lineTo(p5 + 0.5 * p7, 0);
          builder.lineTo(p5 + n, 0);
          builder.lineTo(p5 + n, p4);
        } else if (p1 === 'round') {
          builder.begin();
          builder.moveTo(p5 - p3, p4);
          builder.arcTo(p3, p3, 0, 0, 0, p5, p4 - p3);
          builder.lineTo(p5, p3);
          builder.arcTo(p3, p3, 0, 0, 1, p5 + p3, 0);
          builder.lineTo(p5 + n - p3, 0);
          builder.arcTo(p3, p3, 0, 0, 1, p5 + n, p3);
          builder.lineTo(p5 + n, p4 - p3);
          builder.arcTo(p3, p3, 0, 0, 0, p5 + n + p3, p4);
        }
        builder.fillAndStroke();
      }
      p5 = p5 + n + p6;
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
    p10: any
  ): void {
    if (!builder) return;
    let n;
    p2 = this.getStyleValue(this.renderCtx.style, 'tabStyle', 'block');
    p8 = this.getStyleValue(this.renderCtx.style, 'fillColor2', '#008cff');
    builder.setStrokeColor(p8 as string);
    builder.setFillColor(p8 as string);
    for (p8 = 0; p8 <= p10; p8++) {
      n = p9[p8] + 2 * p7;
      if (p10 === p8) {
        if (p2 === 'block') {
          builder.begin();
          builder.moveTo(0, p4 + p3);
          builder.arcTo(p3, p3, 0, 0, 1, p3, p4);
          builder.lineTo(p5, p4);
          builder.lineTo(p5, 0);
          builder.lineTo(p5 + n, 0);
          builder.lineTo(p5 + n, p4);
          builder.lineTo(p1 - p3, p4);
          builder.arcTo(p3, p3, 0, 0, 1, p1, p4 + p3);
          builder.close();
        } else if (p2 === 'cone') {
          builder.begin();
          builder.moveTo(0, p4 + p3);
          builder.arcTo(p3, p3, 0, 0, 1, p3, p4);
          builder.lineTo(p5, p4);
          builder.lineTo(p5 + 0.5 * p7, 0);
          builder.lineTo(p5 + n - 0.5 * p7, 0);
          builder.lineTo(p5 + n, p4);
          builder.lineTo(p1 - p3, p4);
          builder.arcTo(p3, p3, 0, 0, 1, p1, p4 + p3);
          builder.close();
        } else if (p2 === 'halfCone') {
          builder.begin();
          builder.moveTo(0, p4 + p3);
          builder.arcTo(p3, p3, 0, 0, 1, p3, p4);
          builder.lineTo(p5, p4);
          builder.lineTo(p5 + 0.5 * p7, 0);
          builder.lineTo(p5 + n, 0);
          builder.lineTo(p5 + n, p4);
          builder.lineTo(p1 - p3, p4);
          builder.arcTo(p3, p3, 0, 0, 1, p1, p4 + p3);
          builder.close();
        } else if (p2 === 'round') {
          builder.begin();
          builder.moveTo(0, p4 + p3);
          builder.arcTo(p3, p3, 0, 0, 1, p3, p4);
          builder.lineTo(p5 - p3, p4);
          builder.arcTo(p3, p3, 0, 0, 0, p5, p4 - p3);
          builder.lineTo(p5, p3);
          builder.arcTo(p3, p3, 0, 0, 1, p5 + p3, 0);
          builder.lineTo(p5 + n - p3, 0);
          builder.arcTo(p3, p3, 0, 0, 1, p5 + n, p3);
          builder.lineTo(p5 + n, p4 - p3);
          builder.arcTo(p3, p3, 0, 0, 0, p5 + n + p3, p4);
          builder.lineTo(p1 - p3, p4);
          builder.arcTo(p3, p3, 0, 0, 1, p1, p4 + p3);
          builder.close();
        }
        builder.fillAndStroke();
      }
      p5 = p5 + n + p6;
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
    p11: any
  ): void {
    if (!builder) return;
    let p;
    let q;
    p1 = this.getStyleValue(this.renderCtx.style, 'textColor', '#666666');
    p2 = this.getStyleValue(this.renderCtx.style, 'textColor2', '#ffffff');
    p3 = this.getStyleValue(this.renderCtx.style, 'textSize', '17').toString();
    builder.setFontColor(p1 as string);
    builder.setFontSize(Number.parseFloat(String(p3)) || 0);
    for (p3 = 0; p3 < p8; p3++) {
      p = p11[p3];
      if (p3 === p10) {
        builder.setFontColor(p2 as string);
      }
      if ('+' === p.charAt(0)) {
        p = p.substring(1);
      }
      q = p9[p3] + 2 * p7;
      builder.text(p5 + p7, 0.5 * p4, 0, 0, p, 'left', 'middle', 0, 0, 0);
      p5 = p5 + q + p6;
      if (p3 === p10) {
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
