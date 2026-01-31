// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupTextStickyNote2Handler extends BaseShapeHandler {
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
    this.renderForeground(builder, 0, 0, width, height, style, getStencilSvg, renderStencilShape);
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
    builder.moveTo(0.03 * width, 0.07 * height);
    builder.lineTo(0.89 * width, 0.06 * height);
    builder.arcTo(2.81 * width, 2.92 * height, 1, 0, 0, 0.99 * width, 0.98 * height);
    builder.lineTo(0.09 * width, 0.99 * height);
    builder.arcTo(2.81 * width, 2.92 * height, 1, 0, 1, 0.03 * width, 0.07 * height);
    builder.close();
    builder.fill();
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
    let b;
    b = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(b as string);
    builder.begin();
    builder.moveTo(0.28 * width, 0);
    builder.lineTo(0.59 * width, 0);
    builder.lineTo(0.6 * width, 0.12 * height);
    builder.lineTo(0.28 * width, 0.13 * height);
    builder.close();
    builder.fill();
  }
}
