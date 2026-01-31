// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupIconGridHandler extends BaseShapeHandler {
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
    d = this.getStyleValue(style, 'gridSize', '3,3').toString().split(',');
    this.renderBackground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      d
    );
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
      d
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
    let c;
    let f;
    width /= parseInt(extra1[0], 10) + 0.5 * (extra1[0] - 1);
    height /= parseInt(extra1[1], 10) + 0.5 * (extra1[1] - 1);
    for (c = 0; c < extra1[0]; c++) {
      for (f = 0; f < extra1[1]; f++) {
        (builder.rect(1.5 * width * c, 1.5 * height * f, width, height), builder.fillAndStroke());
      }
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
    let c;
    let f;
    width /= parseInt(extra1[0], 10) + 0.5 * (extra1[0] - 1);
    height /= parseInt(extra1[1], 10) + 0.5 * (extra1[1] - 1);
    for (c = 0; c < extra1[0]; c++) {
      for (f = 0; f < extra1[1]; f++) {
        (builder.begin(),
          builder.moveTo(1.5 * width * c, 1.5 * height * f),
          builder.lineTo(1.5 * width * c + width, 1.5 * height * f + height),
          builder.moveTo(1.5 * width * c + width, 1.5 * height * f),
          builder.lineTo(1.5 * width * c, 1.5 * height * f + height),
          builder.stroke());
      }
    }
  }
}
