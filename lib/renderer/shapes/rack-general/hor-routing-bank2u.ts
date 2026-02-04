// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class RackGeneralHorRoutingBank2UHandler extends BaseShapeHandler {
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
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.rect(10, 4, 17, 6.8);
    builder.stroke();
    builder.rect(31, 4, 17, 6.8);
    builder.stroke();
    builder.rect(52, 4, 17, 6.8);
    builder.stroke();
    builder.rect(73, 4, 17, 6.8);
    builder.stroke();
    builder.rect(94, 4, 17, 6.8);
    builder.stroke();
    builder.rect(115, 4, 17, 6.8);
    builder.stroke();
    builder.rect(136, 4, 17, 6.8);
    builder.stroke();
    builder.rect(10, 18.8, 17, 6.8);
    builder.stroke();
    builder.rect(31, 18.8, 17, 6.8);
    builder.stroke();
    builder.rect(52, 18.8, 17, 6.8);
    builder.stroke();
    builder.rect(73, 18.8, 17, 6.8);
    builder.stroke();
    builder.rect(94, 18.8, 17, 6.8);
    builder.stroke();
    builder.rect(115, 18.8, 17, 6.8);
    builder.stroke();
    builder.rect(136, 18.8, 17, 6.8);
    builder.stroke();
  }
}
