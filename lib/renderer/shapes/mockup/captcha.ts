// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupTextCaptchaHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    this.renderBackground(builder, 0, 0, width, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, width, height, style, getStencilSvg, renderStencilShape);
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
    builder.rect(0, 0, width, height);
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
    let b;
    let c;
    let f;
    let g;
    b = this.getStyleValue(style, 'mainText', 'Note line 1');
    c = this.getStyleValue(style, 'textColor', '#666666');
    f = this.getStyleValue(style, 'textSize', '25');
    g = this.getStyleValue(style, 'fillColor2', '#88aaff');
    builder.setFillColor(g as string);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0.35 * width, 0);
    builder.lineTo(0.55 * width, 0.85 * height);
    builder.lineTo(0.4 * width, 0.75 * height);
    builder.close();
    builder.fill();
    builder.begin();
    builder.moveTo(0.7 * width, 0.1 * height);
    builder.lineTo(0.95 * width, 0.23 * height);
    builder.lineTo(width, 0.4 * height);
    builder.lineTo(width, 0.9 * height);
    builder.lineTo(width, height);
    builder.lineTo(0.8 * width, height);
    builder.close();
    builder.fill();
    builder.setFontColor(c as string);
    builder.setFontSize(Number.parseFloat(String(f)) || 0);
    builder.text(0.5 * width, 0.5 * height, 0, 0, b, 'center', 'middle', 0, 0, 0);
    builder.rect(0, 0, width, height);
    builder.stroke();
  }
}
