// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class GmdlMarginRectHandler extends BaseShapeHandler {
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    let g;
    let h;
    x = this.getStyleNumber(style, 'rectMargin', 0);
    g = this.getStyleNumber(style, 'rectMarginTop', 0);
    extra1 = this.getStyleNumber(style, 'rectMarginLeft', 0);
    y = this.getStyleNumber(style, 'rectMarginBottom', 0);
    h = this.getStyleNumber(style, 'rectMarginRight', 0);
    extra1 = x + extra1;
    g = x + g;
    width = width - h - extra1 - x;
    height = height - y - g - x;
    if (0 < width && 0 < height) {
      builder.begin();
      builder.rect(extra1, g, width, height);
      builder.fillAndStroke();
    }
  }
}
