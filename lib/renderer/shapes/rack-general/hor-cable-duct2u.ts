// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class RackGeneralHorCableDuct2UHandler extends BaseShapeHandler {
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
    builder.rect(0, 0, 160.9, 29.6);
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
    builder.rect(12, 0, 3, 7);
    builder.stroke();
    builder.rect(12, 7, 3, 22.6);
    builder.stroke();
    builder.rect(45.5, 0, 3, 7);
    builder.stroke();
    builder.rect(45.5, 7, 3, 22.6);
    builder.stroke();
    builder.rect(79, 0, 3, 7);
    builder.stroke();
    builder.rect(79, 7, 3, 22.6);
    builder.stroke();
    builder.rect(112.5, 0, 3, 7);
    builder.stroke();
    builder.rect(112.5, 7, 3, 22.6);
    builder.stroke();
    builder.rect(146, 0, 3, 7);
    builder.stroke();
    builder.rect(146, 7, 3, 22.6);
    builder.stroke();
  }
}
