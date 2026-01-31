// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Archimate3ResourceHandler extends BaseShapeHandler {
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
    builder.begin();
    builder.moveTo(0.51 * width, 0.34 * height);
    builder.lineTo(0.51 * width, 0.65 * height);
    builder.moveTo(0.35 * width, 0.34 * height);
    builder.lineTo(0.35 * width, 0.65 * height);
    builder.moveTo(0.19 * width, 0.34 * height);
    builder.lineTo(0.19 * width, 0.65 * height);
    builder.moveTo(0.91 * width, 0.4 * height);
    builder.curveTo(
      0.93 * width,
      0.39 * height,
      0.95 * width,
      0.39 * height,
      0.97 * width,
      0.4 * height
    );
    builder.curveTo(0.99 * width, 0.4 * height, width, 0.41 * height, width, 0.43 * height);
    builder.curveTo(width, 0.48 * height, width, 0.52 * height, width, 0.57 * height);
    builder.curveTo(width, 0.58 * height, 0.99 * width, 0.59 * height, 0.98 * width, 0.6 * height);
    builder.curveTo(
      0.96 * width,
      0.6 * height,
      0.93 * width,
      0.6 * height,
      0.91 * width,
      0.6 * height
    );
    builder.moveTo(0, 0.73 * height);
    builder.curveTo(0, 0.6 * height, 0, 0.43 * height, 0, 0.27 * height);
    builder.curveTo(0, 0.24 * height, 0.03 * width, 0.21 * height, 0.08 * width, 0.21 * height);
    builder.curveTo(
      0.33 * width,
      0.2 * height,
      0.61 * width,
      0.2 * height,
      0.84 * width,
      0.21 * height
    );
    builder.curveTo(
      0.88 * width,
      0.22 * height,
      0.89 * width,
      0.24 * height,
      0.9 * width,
      0.26 * height
    );
    builder.curveTo(
      0.91 * width,
      0.41 * height,
      0.91 * width,
      0.57 * height,
      0.9 * width,
      0.72 * height
    );
    builder.curveTo(
      0.9 * width,
      0.74 * height,
      0.88 * width,
      0.78 * height,
      0.83 * width,
      0.79 * height
    );
    builder.curveTo(
      0.57 * width,
      0.79 * height,
      0.32 * width,
      0.79 * height,
      0.06 * width,
      0.79 * height
    );
    builder.curveTo(0.02 * width, 0.78 * height, 0, 0.76 * height, 0, 0.73 * height);
    builder.close();
    builder.fillAndStroke();
  }
}
