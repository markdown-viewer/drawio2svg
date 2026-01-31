// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupGraphicsGanttChartHandler extends BaseShapeHandler {
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
    x = decodeURIComponent(
      this.getStyleValue(style, 'fillColor2', '#888888,#bbbbbb').toString()
    ).split(',');
    this.getStyleValue(style, 'textColor', '#666666');
    this.getStyleValue(style, 'textSize', '#12');
    builder.begin();
    builder.moveTo(0, 0.13 * height);
    builder.lineTo(width, 0.13 * height);
    builder.moveTo(0.4 * width, 0);
    builder.lineTo(0.4 * width, height);
    builder.moveTo(0.4 * width, 0.065 * height);
    builder.lineTo(width, 0.065 * height);
    builder.moveTo(0.03 * width, 0);
    builder.lineTo(0.03 * width, 0.13 * height);
    builder.moveTo(0.1 * width, 0);
    builder.lineTo(0.1 * width, 0.13 * height);
    builder.moveTo(0.315 * width, 0);
    builder.lineTo(0.315 * width, 0.13 * height);
    builder.moveTo(0.45 * width, 0.065 * height);
    builder.lineTo(0.45 * width, 0.13 * height);
    builder.moveTo(0.5 * width, 0.065 * height);
    builder.lineTo(0.5 * width, height);
    builder.moveTo(0.55 * width, 0.065 * height);
    builder.lineTo(0.55 * width, 0.13 * height);
    builder.moveTo(0.6 * width, 0.065 * height);
    builder.lineTo(0.6 * width, height);
    builder.moveTo(0.65 * width, 0.065 * height);
    builder.lineTo(0.65 * width, 0.13 * height);
    builder.moveTo(0.7 * width, 0.065 * height);
    builder.lineTo(0.7 * width, height);
    builder.moveTo(0.75 * width, 0);
    builder.lineTo(0.75 * width, 0.13 * height);
    builder.moveTo(0.8 * width, 0.065 * height);
    builder.lineTo(0.8 * width, height);
    builder.moveTo(0.85 * width, 0.065 * height);
    builder.lineTo(0.85 * width, 0.13 * height);
    builder.moveTo(0.9 * width, 0.065 * height);
    builder.lineTo(0.9 * width, height);
    builder.moveTo(0.95 * width, 0.065 * height);
    builder.lineTo(0.95 * width, 0.13 * height);
    builder.stroke();
    builder.setFillColor(x[0] as string);
    builder.begin();
    builder.moveTo(0.41 * width, 0.15 * height);
    builder.lineTo(0.64 * width, 0.15 * height);
    builder.lineTo(0.64 * width, 0.18 * height);
    builder.lineTo(0.625 * width, 0.21 * height);
    builder.lineTo(0.61 * width, 0.18 * height);
    builder.lineTo(0.44 * width, 0.18 * height);
    builder.lineTo(0.425 * width, 0.21 * height);
    builder.lineTo(0.41 * width, 0.18 * height);
    builder.close();
    builder.moveTo(0.41 * width, 0.24 * height);
    builder.lineTo(0.49 * width, 0.24 * height);
    builder.lineTo(0.49 * width, 0.275 * height);
    builder.lineTo(0.41 * width, 0.275 * height);
    builder.close();
    builder.moveTo(0.46 * width, 0.31 * height);
    builder.lineTo(0.64 * width, 0.31 * height);
    builder.lineTo(0.64 * width, 0.345 * height);
    builder.lineTo(0.46 * width, 0.345 * height);
    builder.close();
    builder.moveTo(0.56 * width, 0.39 * height);
    builder.lineTo(0.69 * width, 0.39 * height);
    builder.lineTo(0.69 * width, 0.425 * height);
    builder.lineTo(0.56 * width, 0.425 * height);
    builder.close();
    builder.fill();
    builder.setFillColor(x[1] as string);
    builder.begin();
    builder.moveTo(0.46 * width, 0.32 * height);
    builder.lineTo(0.58 * width, 0.32 * height);
    builder.lineTo(0.58 * width, 0.335 * height);
    builder.lineTo(0.46 * width, 0.335 * height);
    builder.close();
    builder.fill();
  }
}
