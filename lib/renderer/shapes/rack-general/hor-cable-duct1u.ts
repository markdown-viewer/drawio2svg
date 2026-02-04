// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class RackGeneralHorCableDuct1UHandler extends BaseShapeHandler {
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
      getStencilShape,
      renderStencilShape,
    } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    builder.translate(x, y);
    this.renderBackground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.restore();
  }

  private renderBackground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.rect(0, 0, 160.9, 14.8);
    builder.fillAndStroke();
  }

  private renderForeground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.rect(12, 0, 3, 7);
    builder.stroke();
    builder.rect(12, 7, 3, 7.8);
    builder.stroke();
    builder.rect(45.5, 0, 3, 7);
    builder.stroke();
    builder.rect(45.5, 7, 3, 7.8);
    builder.stroke();
    builder.rect(79, 0, 3, 7);
    builder.stroke();
    builder.rect(79, 7, 3, 7.8);
    builder.stroke();
    builder.rect(112.5, 0, 3, 7);
    builder.stroke();
    builder.rect(112.5, 7, 3, 7.8);
    builder.stroke();
    builder.rect(146, 0, 3, 7);
    builder.stroke();
    builder.rect(146, 7, 3, 7.8);
    builder.stroke();
  }
}
