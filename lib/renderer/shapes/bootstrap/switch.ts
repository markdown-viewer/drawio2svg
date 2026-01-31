// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapSwitchHandler extends BaseShapeHandler {
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
    const f = this.getStyleValue(style, 'buttonState', !0);

    builder.translate(x, y);
    b = Math.max(b, 2 * height);
    this.renderBackground(builder, x, y, b, height, style, getStencilSvg, renderStencilShape, f);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, b, height, style, getStencilSvg, renderStencilShape, f);
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    if (1 == extra1) {
      builder.setStrokeColor(this.getStyleValue(style, 'onStrokeColor', '#ffffff') as string);
      builder.setFillColor(this.getStyleValue(style, 'onFillColor', '#0085FC') as string);
      builder.roundrect(0, 0, width, height, 0.5 * height, 0.5 * height);
      builder.fill();
    } else {
      builder.roundrect(0, 0, width, height, 0.5 * height, 0.5 * height);
      builder.fillAndStroke();
    }
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
    x = 0.8 * height;
    if (1 == extra1) {
      builder.setFillColor(this.getStyleValue(style, 'onStrokeColor', '#ffffff') as string);
      builder.ellipse(width - 0.9 * height, 0.1 * height, x, x);
    } else {
      builder.setFillColor(this.getStyleValue(style, 'strokeColor', '#000000') as string);
      builder.ellipse(0.1 * height, 0.1 * height, x, x);
    }
    builder.fill();
  }
}
