// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupContainersGroupHandler extends BaseShapeHandler {
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
    const f = this.getStyleValue(style, 'mainText', 'Group').toString();
    const g = this.getStyleValue(style, 'textSize', '17');
    let h = this.measureTextSize(f, g, 'Arial,Helvetica,sans-serif', 0).width;

    if (0 === h) {
      h = Math.max(80, h);
    }
    builder.translate(x, y);
    b = Math.max(b, h + 15);
    c = Math.max(c, g + 10);
    this.renderBackground(builder, b, c, h, g, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, b, c, h, g, style, getStencilSvg, renderStencilShape);
    this.render_buttonText(builder, b, c, f, g);
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
    builder.roundrect(0, 0.5 * height, x, y - 0.5 * height, 5, 5);
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    x = this.getStyleValue(style, 'fillColor2', '#000000');
    builder.setFillColor(x as string);
    builder.roundrect(3, 0, width + 6, 1.5 * height, 0.25 * height, 0.25 * height);
    builder.fill();
  }

  private render_buttonText(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    p1 = this.getStyleValue(this.renderCtx.style, 'textColor', '#ffffff');
    builder.setFontColor(p1 as string);
    builder.setFontSize(Number.parseFloat(String(p4)) || 0);
    builder.text(6, 0, 0, 0, p3, 'left', 'top', 0, 0, 0);
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
