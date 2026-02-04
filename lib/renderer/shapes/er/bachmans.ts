// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ErBachmansHandler extends BaseShapeHandler {
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

    const f = this.getStyleValue(style, 'textColor', '#666666');
    const g = this.getStyleValue(style, 'fontSize', '17');

    builder.translate(x, y);
    this.renderBackground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      g,
      f
    );
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
  }

  private renderForeground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0.125 * height);
    builder.lineTo(width, 0.125 * height);
    builder.moveTo(0, 0.25 * height);
    builder.lineTo(width, 0.25 * height);
    builder.moveTo(0, 0.375 * height);
    builder.lineTo(width, 0.375 * height);
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.moveTo(0, 0.625 * height);
    builder.lineTo(width, 0.625 * height);
    builder.moveTo(0, 0.75 * height);
    builder.lineTo(width, 0.75 * height);
    builder.moveTo(0, 0.875 * height);
    builder.lineTo(width, 0.875 * height);
    builder.moveTo(0.5 * width, 0.125 * height);
    builder.lineTo(0.5 * width, height);
    builder.stroke();
    builder.begin();
    builder.setFontSize(Number.parseFloat(String(extra1)) || 0);
    builder.setFontColor(extra2 as string);
    builder.text(
      0.5 * width,
      0.0625 * height,
      0,
      0,
      "ERD Bachman's Notation",
      'center',
      'middle',
      0,
      0,
      0
    );
    builder.setFontSize(Number.parseFloat(String(0.85 * extra1)) || 0);
    builder.text(0.52 * width, 0.1875 * height, 0, 0, 'Relationship', 'left', 'middle', 0, 0, 0);
    builder.text(
      0.52 * width,
      0.3125 * height,
      0,
      0,
      'Cardinality (One)',
      'left',
      'middle',
      0,
      0,
      0
    );
    builder.text(
      0.52 * width,
      0.4375 * height,
      0,
      0,
      'Cardinality (Many)',
      'left',
      'middle',
      0,
      0,
      0
    );
    builder.text(0.52 * width, 0.5625 * height, 0, 0, 'Mandatory, One', 'left', 'middle', 0, 0, 0);
    builder.text(0.52 * width, 0.6875 * height, 0, 0, 'Mandatory, Many', 'left', 'middle', 0, 0, 0);
    builder.text(0.52 * width, 0.8125 * height, 0, 0, 'Optional, One', 'left', 'middle', 0, 0, 0);
    builder.text(0.52 * width, 0.9375 * height, 0, 0, 'Optional, Many', 'left', 'middle', 0, 0, 0);
    x = this.measureTextSize('has/forms', extra1, 'Arial,Helvetica,sans-serif', 0).width;
    builder.begin();
    builder.moveTo(0.04 * width, 0.1875 * height);
    builder.lineTo(0.25 * width - 0.5 * x, 0.1875 * height);
    builder.moveTo(0.25 * width + 0.5 * x, 0.1875 * height);
    builder.lineTo(0.46 * width, 0.1875 * height);
    builder.text(0.25 * width, 0.1875 * height, 0, 0, 'has/forms', 'center', 'middle', !0, 0, 0);
    builder.moveTo(0.04 * width, 0.3125 * height);
    builder.lineTo(0.46 * width, 0.3125 * height);
    builder.moveTo(0.04 * width, 0.4375 * height);
    builder.lineTo(0.46 * width, 0.4375 * height);
    builder.moveTo(0.46 * width, 0.405 * height);
    builder.lineTo(0.4 * width, 0.4375 * height);
    builder.lineTo(0.46 * width, 0.47 * height);
    builder.moveTo(0.04 * width, 0.5625 * height);
    builder.lineTo(0.46 * width, 0.5625 * height);
    builder.moveTo(0.38 * width, 0.53 * height);
    builder.lineTo(0.38 * width, 0.595 * height);
    builder.moveTo(0.04 * width, 0.6875 * height);
    builder.lineTo(0.46 * width, 0.6875 * height);
    builder.moveTo(0.46 * width, 0.655 * height);
    builder.lineTo(0.4 * width, 0.6875 * height);
    builder.lineTo(0.46 * width, 0.72 * height);
    builder.moveTo(0.38 * width, 0.655 * height);
    builder.lineTo(0.38 * width, 0.72 * height);
    builder.moveTo(0.04 * width, 0.8125 * height);
    builder.lineTo(0.46 * width, 0.8125 * height);
    builder.moveTo(0.04 * width, 0.9375 * height);
    builder.lineTo(0.46 * width, 0.9375 * height);
    builder.moveTo(0.46 * width, 0.905 * height);
    builder.lineTo(0.4 * width, 0.9375 * height);
    builder.lineTo(0.46 * width, 0.97 * height);
    builder.stroke();
    x = height / 15;
    builder.begin();
    builder.ellipse(0.46 * width - x, 0.8125 * height - 0.5 * x, x, x);
    builder.fillAndStroke();
    builder.begin();
    builder.ellipse(0.4 * width - x, 0.9375 * height - 0.5 * x, x, x);
    builder.fillAndStroke();
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
