// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupTextAlphanumericHandler extends BaseShapeHandler {
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

    let f;
    let g;
    let h;
    f = this.getStyleValue(
      style,
      'linkText',
      '0-9 A B C D E F G H I J K L M N O P Q R S T U V X Y Z'
    );
    g = this.getStyleValue(style, 'textSize', '17');
    h = this.getStyleValue(style, 'textColor', '#0000ff');
    builder.translate(d, y);
    d = this.measureTextSize(f, g, 'Arial,Helvetica,sans-serif', 0).width;
    builder.setStrokeColor(h as string);
    builder.setFontSize(Number.parseFloat(String(g)) || 0);
    builder.setFontColor(h as string);
    builder.text(0.5 * width, 0.5 * height, 0, 0, f, 'center', 'middle', 0, 0, 0);
    builder.begin();
    builder.moveTo(0.5 * width - 0.5 * d, 0.5 * (height + parseInt(g, 10)));
    builder.lineTo(0.5 * width + 0.5 * d, 0.5 * (height + parseInt(g, 10)));
    builder.stroke();
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
