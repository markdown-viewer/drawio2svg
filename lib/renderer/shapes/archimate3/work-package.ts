// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Archimate3WorkPackageHandler extends BaseShapeHandler {
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
    builder.moveTo(0.733 * width, 0.7765 * height);
    builder.lineTo(0.3308 * width, 0.7765 * height);
    builder.curveTo(
      0.1856 * width,
      0.7765 * height,
      0.034 * width,
      0.6281 * height,
      0.034 * width,
      0.3939 * height
    );
    builder.curveTo(
      0.0314 * width,
      0.2015 * height,
      0.1742 * width,
      0.0381 * height,
      0.3308 * width,
      0.0381 * height
    );
    builder.curveTo(
      0.5106 * width,
      0.0381 * height,
      0.6267 * width,
      0.2026 * height,
      0.6267 * width,
      0.3939 * height
    );
    builder.curveTo(
      0.6267 * width,
      0.4924 * height,
      0.5785 * width,
      0.603 * height,
      0.4776 * width,
      0.6743 * height
    );
    builder.stroke();
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.7247 * width, 0.908 * height);
    builder.lineTo(0.7247 * width, 0.6418 * height);
    builder.lineTo(0.9147 * width, 0.7749 * height);
    builder.close();
    builder.fillAndStroke();
  }
}
