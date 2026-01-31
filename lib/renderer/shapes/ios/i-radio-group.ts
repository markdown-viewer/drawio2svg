// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIRadioGroupHandler extends BaseShapeHandler {
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
    builder.translate(d, e);
    f = this.getStyleValue(style, 'textColor2', '#666666').toString();
    g = this.getStyleValue(style, 'fontSize', '8').toString();
    d = decodeURIComponent(this.getStyleValue(style, 'buttonText', 'Option 1').toString()).split(
      ','
    );
    e = d.length;
    h = Math.max(1.5 * g, 5);
    k = 0;
    l = -1;
    m = e * h;
    c = Math.max(c, m);
    for (n = 0; n < e; n++) {
      p = d[n];
      if (p.charAt(0) === '+') {
        p = d[n].substring(1);
        l = n;
      }
      p = this.measureTextSize(p, g, 'Arial,Helvetica,sans-serif', 0).width;
      if (p > k) {
        k = p;
      }
    }
    builder.roundrect(0, 0, Math.max(b, 5 + k + 10), c, 2.5, 2.5);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFontSize(Number.parseFloat(String(g)) || 0);
    builder.setFontColor(f as string);
    for (n = 0; n < e; n++) {
      b = ((n * h + 0.5 * h) * c) / m;
      p = d[n];
      if (p.charAt(0) === '+') {
        p = d[n].substring(1);
        l = n;
      }
      builder.text(12.5, b, 0, 0, p, 'left', 'middle', 0, 0, 0);
      b -= 2.5;
      builder.setFillColor('#dddddd' as string);
      builder.setStrokeColor('#000000' as string);
      if (l === n) {
        builder.setGradient('#aaaaaa', '#666666', 2.5, b, 5, 5, 'south', 1, 1);
        builder.ellipse(2.5, b, 5, 5);
        builder.fillAndStroke();
        builder.setFillColor('#333333' as string);
        builder.setStrokeColor('#333333' as string);
        builder.ellipse(3.75, b + 1.25, 2.5, 2.5);
      } else {
        builder.setGradient('#eeeeee', '#cccccc', 2.5, b, 5, 5, 'south', 1, 1);
        builder.ellipse(2.5, b, 5, 5);
      }
      builder.fillAndStroke();
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
