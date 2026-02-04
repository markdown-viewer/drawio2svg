// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class FloorplanDoorDoubleHandler extends BaseShapeHandler {
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
    x = 0.5 * width;
    builder.rect(0, 0, width, 5);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(x, 0);
    builder.lineTo(x, 5);
    builder.moveTo(x, 5);
    builder.arcTo(x, x, 0, 0, 1, 0, 5 + x);
    builder.lineTo(0, 5);
    builder.moveTo(x, 5);
    builder.arcTo(x, x, 0, 0, 0, width, 5 + x);
    builder.lineTo(width, 5);
    builder.stroke();
  }
}
