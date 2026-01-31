// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosISortFindIconHandler extends BaseShapeHandler {
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
    builder.roundrect(0, 0, width, height, 0.1 * width, 0.1 * height);
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
    builder.setStrokeWidth(Math.min(height, width) / 20);
    builder.begin();
    builder.setFillColor('#ffffff' as string);
    builder.moveTo(0.1 * width, 0.25 * height);
    builder.lineTo(0.9 * width, 0.25 * height);
    builder.moveTo(0.1 * width, 0.4 * height);
    builder.lineTo(0.9 * width, 0.4 * height);
    builder.moveTo(0.1 * width, 0.55 * height);
    builder.lineTo(0.6 * width, 0.55 * height);
    builder.moveTo(0.1 * width, 0.7 * height);
    builder.lineTo(0.5 * width, 0.7 * height);
    builder.stroke();
    builder.begin();
    builder.ellipse(0.6 * width, 0.6 * height, 0.2 * width, 0.2 * height);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.77 * width, 0.77 * height);
    builder.lineTo(0.85 * width, 0.85 * height);
    builder.stroke();
  }
}
