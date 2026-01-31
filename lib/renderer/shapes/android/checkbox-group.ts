// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class AndroidCheckboxGroupHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } =
      this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;
    let e = y;
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
    let q;
    builder.translate(d, e);
    f = this.getStyleValue(style, 'textColor', '#666666');
    g = this.getStyleValue(style, 'fontSize', '8').toString();
    d = this.getStyleValue(style, 'buttonText', 'Option 1').toString().split(',');
    h = this.getStyleValue(style, 'strokeColor', 'none');
    e = this.getStyleValue(style, 'strokeColor2', 'none');
    builder.setStrokeColor(e as string);
    e = d.length;
    k = Math.max(1.5 * g, 5);
    l = 0;
    m = -1;
    n = e * k;
    c = Math.max(c, n);
    for (p = 0; p < e; p++) {
      q = d[p];
      if (q.charAt(0) === '+') {
        q = d[p].substring(1);
        m = p;
      }
      q = this.measureTextSize(q, g, 'Arial,Helvetica,sans-serif', 0).width;
      if (q > l) {
        l = q;
      }
    }
    builder.roundrect(0, 0, Math.max(b, 5 + l + 10), c, 2.5, 2.5);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFontSize(Number.parseFloat(String(g)) || 0);
    builder.setFontColor(f as string);
    builder.setStrokeColor(h as string);
    for (p = 0; p < e; p++) {
      b = ((p * k + 0.5 * k) * c) / n;
      q = d[p];
      if (q.charAt(0) === '+') {
        q = d[p].substring(1);
        m = p;
      }
      builder.text(12.5, b, 0, 0, q, 'left', 'middle', 0, 0, 0);
      b -= 2.5;
      if (m === p) {
        builder.rect(2.5, b, 5, 5);
        builder.fillAndStroke();
        builder.begin();
        builder.moveTo(3.75, b + 2.5);
        builder.lineTo(5, b + 3.75);
        builder.lineTo(6.25, b + 1.25);
        builder.stroke();
      } else {
        builder.rect(2.5, b, 5, 5);
        builder.fillAndStroke();
      }
      m = -1;
    }
    builder.restore();
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
