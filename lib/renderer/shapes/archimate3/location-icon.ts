// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Archimate3LocationIconHandler extends BaseShapeHandler {
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
    builder.translate(3, 0);
    width -= 6;
    builder.begin();
    builder.moveTo(0.5 * width, 0);
    builder.curveTo(0.2842 * width, 0, 0, 0.1006 * height, 0, 0.3001 * height);
    builder.curveTo(
      0,
      0.4071 * height,
      0.0776 * width,
      0.4777 * height,
      0.1524 * width,
      0.5485 * height
    );
    builder.curveTo(
      0.2901 * width,
      0.6788 * height,
      0.4275 * width,
      0.7993 * height,
      0.5 * width,
      height
    );
    builder.curveTo(
      0.5725 * width,
      0.7993 * height,
      0.7099 * width,
      0.6788 * height,
      0.8476 * width,
      0.5485 * height
    );
    builder.curveTo(
      0.9224 * width,
      0.4777 * height,
      width,
      0.4071 * height,
      width,
      0.3001 * height
    );
    builder.curveTo(width, 0.1006 * height, 0.7158 * width, 0, 0.5 * width, 0);
    builder.close();
    builder.fillAndStroke();
  }
}
