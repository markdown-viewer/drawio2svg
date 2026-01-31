// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class GmdlPlayerHandler extends BaseShapeHandler {
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
    builder.begin();
    builder.rect(0, 0, width, height);
    builder.fill();
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
    builder.restore();
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
    if (4 <= height) {
      builder.setFillColor('#FFED00' as string);
      builder.begin();
      builder.rect(0, 0, 0.8 * width, 4);
      builder.fill();
    }
    if (14 <= height && 33 <= width) {
      builder.setFillColor('#717171' as string);
      builder.begin();
      builder.rect(width - 33, 0.5 * height - 7, 4, 14);
      builder.fill();
      builder.begin();
      builder.rect(width - 25, 0.5 * height - 7, 4, 14);
      builder.fill();
    }
  }
}
