// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupTextCalloutHandler extends BaseShapeHandler {
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
    let k;
    let l;
    let m;
    f = this.getStyleValue(style, 'linkText', 'Callout');
    g = this.getStyleValue(style, 'textSize', '17');
    h = this.getStyleValue(style, 'textColor', '#666666');
    k = this.getStyleValue(style, 'callStyle', 'line');
    l = this.getStyleValue(style, 'callDir', 'NW');
    m = this.measureTextSize(f, g, 'Arial,Helvetica,sans-serif', 0).width;
    m *= 1.2;
    if (0 == m) {
      m = 70;
    }
    builder.translate(d, y);
    builder.setFontSize(Number.parseFloat(String(g)) || 0);
    builder.setFontColor(h as string);
    d = 1.5 * g;
    if (l === 'NW') {
      if (k === 'line') {
        builder.begin();
        builder.moveTo(0, d);
        builder.lineTo(m, d);
        builder.lineTo(width, height);
        builder.stroke();
      } else if (k === 'rect') {
        builder.rect(0, 0, m, d);
        builder.fillAndStroke();
        builder.begin();
        builder.moveTo(0.5 * m, d);
        builder.lineTo(width, height);
        builder.stroke();
      } else if (k === 'roundRect') {
        builder.roundrect(0, 0, m, d, 0.25 * d, 0.25 * d);
        builder.fillAndStroke();
        builder.begin();
        builder.moveTo(0.5 * m, d);
        builder.lineTo(width, height);
        builder.stroke();
      }
      builder.text(0.5 * m, 0.5 * d, 0, 0, f, 'center', 'middle', 0, 0, 0);
    } else if (l === 'NE') {
      if (k === 'line') {
        builder.begin();
        builder.moveTo(width, d);
        builder.lineTo(width - m, d);
        builder.lineTo(0, height);
        builder.stroke();
      } else if (k === 'rect') {
        builder.rect(width - m, 0, m, d);
        builder.fillAndStroke();
        builder.begin();
        builder.moveTo(width - 0.5 * m, d);
        builder.lineTo(0, height);
        builder.stroke();
      } else if (k === 'roundRect') {
        builder.roundrect(width - m, 0, m, d, 0.25 * d, 0.25 * d);
        builder.fillAndStroke();
        builder.begin();
        builder.moveTo(width - 0.5 * m, d);
        builder.lineTo(0, height);
        builder.stroke();
      }
      builder.text(width - 0.5 * m, 0.5 * d, 0, 0, f, 'center', 'middle', 0, 0, 0);
    } else if (l === 'SE') {
      if (k === 'line') {
        builder.begin();
        builder.moveTo(width, height);
        builder.lineTo(width - m, height);
        builder.lineTo(0, 0);
        builder.stroke();
      } else if (k === 'rect') {
        builder.rect(width - m, height - d, m, d);
        builder.fillAndStroke();
        builder.begin();
        builder.moveTo(width - 0.5 * m, height - d);
        builder.lineTo(0, 0);
        builder.stroke();
      } else if (k === 'roundRect') {
        builder.roundrect(width - m, height - d, m, d, 0.25 * d, 0.25 * d);
        builder.fillAndStroke();
        builder.begin();
        builder.moveTo(width - 0.5 * m, height - d);
        builder.lineTo(0, 0);
        builder.stroke();
      }
      builder.text(width - 0.5 * m, height - 0.5 * d, 0, 0, f, 'center', 'middle', 0, 0, 0);
    } else if (l === 'SW') {
      if (k === 'line') {
        builder.begin();
        builder.moveTo(0, height);
        builder.lineTo(m, height);
        builder.lineTo(width, 0);
        builder.stroke();
      } else if (k === 'rect') {
        builder.rect(0, height - d, m, d);
        builder.fillAndStroke();
        builder.begin();
        builder.moveTo(0.5 * m, height - d);
        builder.lineTo(width, 0);
        builder.stroke();
      } else if (k === 'roundRect') {
        builder.roundrect(0, height - d, m, d, 0.25 * d, 0.25 * d);
        builder.fillAndStroke();
        builder.begin();
        builder.moveTo(0.5 * m, height - d);
        builder.lineTo(width, 0);
        builder.stroke();
      }
      builder.text(0.5 * m, height - 0.5 * d, 0, 0, f, 'center', 'middle', 0, 0, 0);
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
