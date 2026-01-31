// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupCheckboxGroupHandler extends BaseShapeHandler {
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
    d = this.getStyleValue(style, 'textColor', '#666666,#008cff').toString().split(',');
    f = this.getStyleValue(style, 'textSize', '17').toString();
    e = this.getStyleValue(style, 'mainText', 'Option 1').toString().split(',');
    g = e.length;
    h = Math.max(1.5 * f, 15);
    k = 0;
    l = -1;
    m = g * h;
    c = Math.max(c, m);
    for (n = 0; n < g; n++) {
      p = e[n];
      if (p.charAt(0) === '+') {
        p = e[n].substring(1);
        l = n;
      }
      p = this.measureTextSize(p, f, 'Arial,Helvetica,sans-serif', 0).width;
      if (p > k) {
        k = p;
      }
    }
    builder.rect(0, 0, Math.max(b, 5 + k + 30), c);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFontSize(Number.parseFloat(String(f)) || 0);
    for (n = 0; n < g; n++) {
      b = ((n * h + 0.5 * h) * c) / m;
      p = e[n];
      if (p.charAt(0) === '+') {
        builder.setFontColor(d[1] as string);
        p = e[n].substring(1);
        l = n;
      } else {
        builder.setFontColor(d[0] as string);
      }
      builder.text(32.5, b, 0, 0, p, 'left', 'middle', 0, 0, 0);
      b -= 7.5;
      builder.setFillColor('#dddddd' as string);
      builder.setStrokeColor('#999999' as string);
      if (l === n) {
        builder.setGradient('#aaaaaa', '#666666', 7.5, b, 15, 15, 'south', 1, 1);
        builder.rect(7.5, b, 15, 15);
        builder.fillAndStroke();
        builder.setStrokeColor('#333333' as string);
        builder.begin();
        builder.moveTo(11.25, b + 7.5);
        builder.lineTo(15, b + 11.25);
        builder.lineTo(18.75, b + 3.75);
        builder.stroke();
      } else {
        builder.setGradient('#eeeeee', '#cccccc', 7.5, b, 15, 15, 'south', 1, 1);
        builder.rect(7.5, b, 15, 15);
        builder.fillAndStroke();
      }
      l = -1;
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
