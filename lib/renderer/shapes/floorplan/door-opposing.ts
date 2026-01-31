// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class FloorplanDoorOpposingHandler extends BaseShapeHandler {
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
    x = width * Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.3)));
    builder.rect(0, x, width, 5);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(x, x);
    builder.lineTo(x, x + 5);
    builder.arcTo(x, x, 0, 0, 0, 0, 0);
    builder.lineTo(0, x);
    builder.moveTo(x, x + 5);
    builder.arcTo(width - x, width - x, 0, 0, 0, width, 5 + width);
    builder.lineTo(width, x + 5);
    builder.stroke();
  }
}
