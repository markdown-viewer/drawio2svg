// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupFormsSplitterHandler extends BaseShapeHandler {
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
    let b = width;

    b = Math.max(b, 35);
    builder.translate(x, y);
    this.renderBackground(builder, 0, 0, b, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, b, height, style, getStencilSvg, renderStencilShape);
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
    builder.moveTo(0, 0.5 * height - 5);
    builder.lineTo(width, 0.5 * height - 5);
    builder.lineTo(width, 0.5 * height + 5);
    builder.lineTo(0, 0.5 * height + 5);
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
    b = this.getStyleValue(style, 'strokeColor', '#999999');
    builder.begin();
    builder.moveTo(0, 0.5 * height - 5);
    builder.lineTo(width, 0.5 * height - 5);
    builder.moveTo(width, 0.5 * height + 5);
    builder.lineTo(0, 0.5 * height + 5);
    builder.stroke();
    builder.setFillColor(b as string);
    builder.ellipse(0.5 * width - 17, 0.5 * height - 2, 4, 4);
    builder.fill();
    builder.ellipse(0.5 * width - 2, 0.5 * height - 2, 4, 4);
    builder.fill();
    builder.ellipse(0.5 * width + 13, 0.5 * height - 2, 4, 4);
    builder.fill();
  }
}
