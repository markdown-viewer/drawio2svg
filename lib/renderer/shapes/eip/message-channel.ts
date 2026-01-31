// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class EipMessageChannelHandler extends BaseShapeHandler {
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
    builder.setGradient('#e6e6e6', '#808080', 0, 0, width, height, 'south', 1, 1);
    builder.begin();
    builder.moveTo(8, 0.5 * height + 10);
    builder.arcTo(12, 12, 0, 0, 1, 8, 0.5 * height - 10);
    builder.lineTo(width - 8, 0.5 * height - 10);
    builder.arcTo(12, 12, 0, 0, 1, width - 8, 0.5 * height + 10);
    builder.close();
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
    builder.setFillColor('#e6e6e6' as string);
    builder.begin();
    builder.moveTo(width - 8, 0.5 * height - 10);
    builder.arcTo(12, 12, 0, 0, 1, width - 8, 0.5 * height + 10);
    builder.arcTo(12, 12, 0, 0, 1, width - 8, 0.5 * height - 10);
    builder.fillAndStroke();
  }
}
