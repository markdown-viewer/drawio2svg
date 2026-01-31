// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIInfoIconHandler extends BaseShapeHandler {
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
    builder.setFillColor('#ffffff' as string);
    builder.moveTo(0.47 * width, 0.334 * height);
    builder.arcTo(0.1 * width, 0.15 * height, 60, 0, 1, 0.61 * width, 0.42 * height);
    builder.lineTo(0.51 * width, 0.7 * height);
    builder.arcTo(0.026 * width, 0.03 * height, 30, 0, 0, 0.54 * width, 0.74 * height);
    builder.lineTo(0.608 * width, 0.684 * height);
    builder.arcTo(0.02 * width, 0.015 * height, 0, 0, 1, 0.638 * width, 0.706 * height);
    builder.arcTo(0.45 * width, 0.45 * height, 0, 0, 1, 0.42 * width, 0.865 * height);
    builder.arcTo(0.1 * width, 0.08 * height, -15, 0, 1, 0.325 * width, 0.77 * height);
    builder.lineTo(0.358 * width, 0.66 * height);
    builder.lineTo(0.435 * width, 0.46 * height);
    builder.arcTo(0.023 * width, 0.03 * height, 0, 0, 0, 0.4 * width, 0.43 * height);
    builder.lineTo(0.338 * width, 0.484 * height);
    builder.arcTo(0.01 * width, 0.015 * height, 45, 0, 1, 0.31 * width, 0.47 * height);
    builder.arcTo(0.3 * width, 0.3 * height, 0, 0, 1, 0.47 * width, 0.334 * height);
    builder.fill();
    builder.begin();
    builder.moveTo(0.5438 * width, 0.141 * height);
    builder.arcTo(0.0776 * width, 0.0898 * height, 40, 0, 1, 0.6671 * width, 0.2308 * height);
    builder.arcTo(0.0776 * width, 0.0898 * height, 40, 0, 1, 0.5438 * width, 0.141 * height);
    builder.close();
    builder.fill();
  }
}
