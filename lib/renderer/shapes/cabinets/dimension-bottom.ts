// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class CabinetsDimensionBottomHandler extends BaseShapeHandler {
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
    this.renderBackground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
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
    builder.begin();
    builder.moveTo(0, height - 20);
    builder.lineTo(width, height - 20);
    builder.moveTo(10, height - 15);
    builder.lineTo(0, height - 20);
    builder.lineTo(10, height - 25);
    builder.moveTo(width - 10, height - 15);
    builder.lineTo(width, height - 20);
    builder.lineTo(width - 10, height - 25);
    builder.moveTo(0, height - 15);
    builder.lineTo(0, 0);
    builder.moveTo(width, height - 15);
    builder.lineTo(width, 0);
    builder.stroke();
  }
}
