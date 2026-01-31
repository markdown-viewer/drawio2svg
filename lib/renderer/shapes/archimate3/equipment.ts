// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Archimate3EquipmentHandler extends BaseShapeHandler {
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
    builder.moveTo(0.72 * width, 0.38 * height);
    builder.curveTo(
      0.78 * width,
      0.38 * width,
      0.85 * width,
      0.34 * height,
      0.85 * width,
      0.26 * height
    );
    builder.curveTo(
      0.85 * width,
      0.18 * width,
      0.78 * width,
      0.14 * height,
      0.73 * width,
      0.14 * height
    );
    builder.curveTo(
      0.64 * width,
      0.14 * width,
      0.59 * width,
      0.2 * height,
      0.59 * width,
      0.26 * height
    );
    builder.curveTo(
      0.59 * width,
      0.33 * height,
      0.65 * width,
      0.38 * width,
      0.72 * width,
      0.38 * height
    );
    builder.close();
    builder.moveTo(0.68 * width, 0.52 * height);
    builder.lineTo(0.67 * width, 0.45 * height);
    builder.lineTo(0.61 * width, 0.43 * height);
    builder.lineTo(0.56 * width, 0.48 * height);
    builder.lineTo(0.5 * width, 0.42 * height);
    builder.lineTo(0.54 * width, 0.36 * height);
    builder.lineTo(0.52 * width, 0.31 * height);
    builder.lineTo(0.45 * width, 0.31 * height);
    builder.lineTo(0.45 * width, 0.22 * height);
    builder.lineTo(0.52 * width, 0.21 * height);
    builder.lineTo(0.54 * width, 0.16 * height);
    builder.lineTo(0.5 * width, 0.11 * height);
    builder.lineTo(0.56 * width, 0.05 * height);
    builder.lineTo(0.62 * width, 0.09 * height);
    builder.lineTo(0.67 * width, 0.07 * height);
    builder.lineTo(0.68 * width, 0);
    builder.lineTo(0.77 * width, 0);
    builder.lineTo(0.78 * width, 0.07 * height);
    builder.lineTo(0.83 * width, 0.09 * height);
    builder.lineTo(0.89 * width, 0.05 * height);
    builder.lineTo(0.95 * width, 0.11 * height);
    builder.lineTo(0.91 * width, 0.16 * height);
    builder.lineTo(0.93 * width, 0.21 * height);
    builder.lineTo(width, 0.22 * height);
    builder.lineTo(width, 0.31 * height);
    builder.lineTo(0.93 * width, 0.31 * height);
    builder.lineTo(0.91 * width, 0.36 * height);
    builder.lineTo(0.95 * width, 0.41 * height);
    builder.lineTo(0.89 * width, 0.47 * height);
    builder.lineTo(0.83 * width, 0.43 * height);
    builder.lineTo(0.78 * width, 0.45 * height);
    builder.lineTo(0.77 * width, 0.52 * height);
    builder.lineTo(0.68 * width, 0.52 * height);
    builder.close();
    builder.moveTo(0.36 * width, 0.81 * height);
    builder.curveTo(
      0.44 * width,
      0.81 * height,
      0.52 * width,
      0.75 * height,
      0.52 * width,
      0.67 * height
    );
    builder.curveTo(
      0.52 * width,
      0.59 * height,
      0.45 * width,
      0.51 * height,
      0.35 * width,
      0.51 * height
    );
    builder.curveTo(
      0.27 * width,
      0.51 * height,
      0.19 * width,
      0.58 * height,
      0.19 * width,
      0.67 * height
    );
    builder.curveTo(
      0.19 * width,
      0.74 * height,
      0.27 * width,
      0.82 * height,
      0.36 * width,
      0.81 * height
    );
    builder.close();
    builder.moveTo(0.21 * width, 0.98 * height);
    builder.lineTo(0.22 * width, 0.89 * height);
    builder.lineTo(0.16 * width, 0.85 * height);
    builder.lineTo(0.08 * width, 0.88 * height);
    builder.lineTo(0.02 * width, 0.79 * height);
    builder.lineTo(0.09 * width, 0.74 * height);
    builder.lineTo(0.08 * width, 0.67 * height);
    builder.lineTo(0, 0.63 * height);
    builder.lineTo(0.03 * width, 0.53 * height);
    builder.lineTo(0.12 * width, 0.54 * height);
    builder.lineTo(0.16 * width, 0.48 * height);
    builder.lineTo(0.13 * width, 0.4 * height);
    builder.lineTo(0.22 * width, 0.35 * height);
    builder.lineTo(0.28 * width, 0.42 * height);
    builder.lineTo(0.36 * width, 0.41 * height);
    builder.lineTo(0.39 * width, 0.33 * height);
    builder.lineTo(0.5 * width, 0.36 * height);
    builder.lineTo(0.49 * width, 0.45 * height);
    builder.lineTo(0.55 * width, 0.49 * height);
    builder.lineTo(0.63 * width, 0.45 * height);
    builder.lineTo(0.69 * width, 0.54 * height);
    builder.lineTo(0.62 * width, 0.6 * height);
    builder.lineTo(0.63 * width, 0.67 * height);
    builder.lineTo(0.71 * width, 0.7 * height);
    builder.lineTo(0.68 * width, 0.8 * height);
    builder.lineTo(0.59 * width, 0.79 * height);
    builder.lineTo(0.55 * width, 0.85 * height);
    builder.lineTo(0.59 * width, 0.79 * height);
    builder.lineTo(0.55 * width, 0.85 * height);
    builder.lineTo(0.59 * width, 0.93 * height);
    builder.lineTo(0.49 * width, 0.98 * height);
    builder.lineTo(0.43 * width, 0.91 * height);
    builder.lineTo(0.36 * width, 0.92 * height);
    builder.lineTo(0.32 * width, height);
    builder.lineTo(0.21 * width, 0.98 * height);
    builder.close();
    builder.fillAndStroke();
  }
}
