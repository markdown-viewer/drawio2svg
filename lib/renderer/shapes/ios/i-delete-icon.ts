// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIDeleteIconHandler extends BaseShapeHandler {
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

    const f = this.getStyleValue(style, 'strokeColor', '').toString();

    builder.translate(x, y);
    this.renderBackground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      f
    );
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
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
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    x = this.getStyleValue(style, 'fillColor', '').toString();
    y = this.getStyleValue(style, 'fillColor2', '').toString();
    builder.setGradient(x, y, 0, 0, width, height, 'south', 1, 1);
    builder.setStrokeWidth(1.5);
    builder.setStrokeColor(extra1 as string);
    builder.ellipse(0, 0, width, height);
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    builder.setStrokeWidth(2.5);
    builder.begin();
    builder.moveTo(0.25 * width, 0.5 * height);
    builder.lineTo(0.75 * width, 0.5 * height);
    builder.stroke();
  }
}
