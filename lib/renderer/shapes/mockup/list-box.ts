// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupFormsListBoxHandler extends BaseShapeHandler {
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
    let k;
    let m;
    let h;

    let l;
    let n = 0;
    let p;
    for (
      f = this.getStyleValue(style, 'fillColor', '#ffffff'),
        g = this.getStyleValue(style, 'strokeColor', '#666666'),
        h = this.getStyleValue(style, 'textSize', '17').toString(),
        k = -1,
        l = b,
        m = this.getStyleValue(style, 'subText', 'Sub Text').toString().split(','),
        n = 0;
      n < m.length;
      n++
    ) {
      p = m[n];
      if (p.charAt(0) === '+') {
        p = m[n].substring(1);
        k = n;
      }
      p = this.measureTextSize(p, h, 'Arial,Helvetica,sans-serif', 0).width;
      if (p > l) {
        l = p;
      }
    }
    builder.translate(x, y);
    b = Math.min(b, l);
    c = Math.max(c, 30 + m.length * h * 1.5);
    this.renderBackground(builder, b, c, f, g, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, b, c, g, k, style, getStencilSvg, renderStencilShape, m, h);
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
    builder.setFillColor(width as string);
    builder.setStrokeColor(height as string);
    builder.rect(0, 0, x, y);
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
    extra2?: any
  ): void {
    if (!builder) return;
    this.getStyleValue(style, 'strokeWidth', '1');
    width = this.getStyleValue(style, 'selectedColor', '#ddeeff');
    if (-1 !== height) {
      builder.setFillColor(width as string);
      builder.rect(0, 30 + height * extra2 * 1.5, x, 1.5 * extra2);
      builder.fill();
    }
    builder.begin();
    builder.moveTo(0, 30);
    builder.lineTo(x, 30);
    builder.stroke();
    height = this.getStyleValue(style, 'mainText', 'Window Title').toString();
    width = this.getStyleValue(style, 'textColor', '#666666,#008cff').toString().split(',');
    builder.setFontColor(width[1] as string);
    builder.setFontSize(Number.parseFloat(String(extra2)) || 0);
    builder.text(10, 15, 0, 0, height, 'left', 'middle', 0, 0, 0);
    builder.setFontColor(width[0] as string);
    for (height = 0; height < extra1.length; height++) {
      width = extra1[height];
      if (width.charAt(0) === '+') {
        width = extra1[height].substring(1);
      }
      builder.text(10, 30 + extra2 * (1.5 * height + 0.75), 0, 0, width, 'left', 'middle', 0, 0, 0);
    }
    builder.rect(0, 0, x, y);
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
