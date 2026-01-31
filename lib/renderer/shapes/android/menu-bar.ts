// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class AndroidMenuBarHandler extends BaseShapeHandler {
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
    let c = height;

    let f;
    let g;
    let h;
    let k = 0;
    let l = 0;
    let m;
    for (
      f = this.getStyleValue(style, 'menuText', 'Item 1, Item 2, Item 3').toString().split(','),
        g = this.getStyleValue(style, 'fontSize', '12'),
        h = f.length,
        k = 0,
        l = 0;
      l < h;
      l++
    ) {
      m = this.measureTextSize(f[l], g, 'Arial,Helvetica,sans-serif', 0).width;
      if (m > k) {
        k = m;
      }
    }
    g *= 1.5;
    k = h * g;
    c = Math.max(c, k);
    builder.translate(d, y);
    builder.rect(0, 0, width, c);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.begin();
    for (l = 1; l < h; l++) {
      ((d = (l * g * c) / k), builder.moveTo(0, d), builder.lineTo(width, d));
    }
    builder.stroke();
    for (l = 0; l < h; l++) {
      ((m += 2.5),
        (d = ((l * g + 0.5 * g) * c) / k),
        builder.text(10, d, 0, 0, f[l], 'left', 'middle', 0, null, 0, 0, 0));
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
