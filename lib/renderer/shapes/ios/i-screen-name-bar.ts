// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIScreenNameBarHandler extends BaseShapeHandler {
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
    let d = x;

    builder.translate(d, y);
    builder.setStrokeWidth(0.5);
    d = this.getStyleValue(style, 'fillColor2', '#00ff00');
    builder.setFillColor(d as string);
    builder.rect(0, 0, width, height);
    builder.fill();
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      5
    );
    builder.restore();
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
    extra1?: any
  ): void {
    if (!builder) return;
    let c;
    extra1 = this.getStyleValue(style, 'fillColor3', '#00ff00');
    builder.setGradient(extra1, extra1, 0, 0, width, 0.5 * height, 'south', 0.8, 0.1);
    builder.rect(0, 0, width, 0.5 * height);
    builder.fill();
    extra1 = decodeURIComponent(this.getStyleValue(style, 'buttonText', ''));
    c = this.getStyleValue(style, 'textColor', '#00ff00');
    builder.setFontColor(c as string);
    builder.setFontSize(Number.parseFloat(String(9.5)) || 0);
    builder.text(0.5 * width, 0.45 * height, 0, 0, extra1, 'center', 'middle', 0, 0, 0);
  }
}
