// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Ios7uiMarginRectHandler extends BaseShapeHandler {
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    let g;
    let h;
    let k;
    let l;
    extra1 = this.getStyleNumber(style, 'rectMargin', 0);
    g = this.getStyleNumber(style, 'rectMarginTop', 0);
    h = this.getStyleNumber(style, 'rectMarginLeft', 0);
    k = this.getStyleNumber(style, 'rectMarginBottom', 0);
    l = this.getStyleNumber(style, 'rectMarginRight', 0);
    x = this.getStyleNumber(style, 'rx', 0);
    y = this.getStyleNumber(style, 'ry', 0);
    h = extra1 + h;
    g = extra1 + g;
    width = width - l - h - extra1;
    height = height - k - g - extra1;
    if (0 < width && 0 < height) {
      builder.begin();
      builder.roundrect(h, g, width, height, x, y);
      builder.fillAndStroke();
    }
  }
}
