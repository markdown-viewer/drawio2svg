// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class EipRetAddrHandler extends BaseShapeHandler {
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
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
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
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.05 * width, 0.11 * height);
    builder.lineTo(0.25 * width, 0.11 * height);
    builder.moveTo(0.05 * width, 0.18 * height);
    builder.lineTo(0.25 * width, 0.18 * height);
    builder.moveTo(0.05 * width, 0.25 * height);
    builder.lineTo(0.25 * width, 0.25 * height);
    builder.setStrokeWidth(2);
    builder.moveTo(0.3 * width, 0.63 * height);
    builder.lineTo(0.8 * width, 0.63 * height);
    builder.moveTo(0.3 * width, 0.72 * height);
    builder.lineTo(0.8 * width, 0.72 * height);
    builder.moveTo(0.3 * width, 0.8 * height);
    builder.lineTo(0.8 * width, 0.8 * height);
    builder.stroke();
    builder.setFillColor('#EDEDED' as string);
    builder.rect(0.8 * width, 0.1 * height, 0.12 * width, 0.19 * height);
    builder.fillAndStroke();
  }
}
