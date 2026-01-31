// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIPrevNextHandler extends BaseShapeHandler {
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
    this.renderBackground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
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
    x = this.getStyleValue(style, 'fillColor', '').toString();
    y = this.getStyleValue(style, 'fillColor2', '').toString();
    builder.setGradient(x, y, 0, 0, width, height, 'south', 1, 1);
    builder.roundrect(0, 0, width, height, 5, 5);
    builder.fill();
    builder.begin();
    builder.moveTo(0.5 * width, 0);
    builder.lineTo(0.5 * width, height);
    builder.stroke();
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
    x = this.getStyleValue(style, 'fillColor3', '').toString();
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.25 * width, 0.25 * height);
    builder.lineTo(0.35 * width, 0.75 * height);
    builder.lineTo(0.15 * width, 0.75 * height);
    builder.close();
    builder.fill();
    builder.begin();
    builder.moveTo(0.75 * width, 0.75 * height);
    builder.lineTo(0.85 * width, 0.25 * height);
    builder.lineTo(0.65 * width, 0.25 * height);
    builder.close();
    builder.fill();
  }
}
