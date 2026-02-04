// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class RackGeneralCabinetLegHandler extends BaseShapeHandler {
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
    let b = width;
    let c = height;

    b = Math.max(b, 20);
    c = Math.max(c, 20);
    builder.translate(x, y);
    this.renderBackground(builder, 0, 0, b, c, style, getStencilShape, renderStencilShape);
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
    builder.moveTo(0, height - 10);
    builder.lineTo(5, height - 10);
    builder.lineTo(5, height - 12);
    builder.lineTo(9, height - 12);
    builder.lineTo(9, height - 10);
    builder.lineTo(width - 10, height - 10);
    builder.lineTo(width - 10, 9);
    builder.lineTo(width - 12, 9);
    builder.lineTo(width - 12, 5);
    builder.lineTo(width - 10, 5);
    builder.lineTo(width - 10, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
  }
}
