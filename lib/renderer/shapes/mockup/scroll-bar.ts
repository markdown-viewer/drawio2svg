// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupNavigationScrollBarHandler extends BaseShapeHandler {
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
    let c = height;

    c = 20;
    b = Math.max(b, 40);
    builder.translate(x, y);
    this.renderBackground(builder, 0, 0, b, c, style, getStencilSvg, renderStencilShape, 20);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, b, c, style, getStencilSvg, renderStencilShape, 20);
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
    builder.rect(0, 0, width, height);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(extra1, 0);
    builder.lineTo(extra1, height);
    builder.moveTo(width - extra1, 0);
    builder.lineTo(width - extra1, height);
    builder.stroke();
  }

  private renderForeground(
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
    let c;
    let f;
    let g;
    c = this.getStyleNumber(style, 'barPos', 20);
    f = this.getStyleValue(style, 'fillColor2', '#99ddff');
    g = this.getStyleValue(style, 'strokeColor2', 'none');
    c = Math.max(0, c);
    c = Math.min(100, c);
    builder.setStrokeColor(g as string);
    builder.setFillColor(f as string);
    builder.begin();
    builder.moveTo(0.2 * extra1, 0.5 * height);
    builder.lineTo(0.8 * extra1, 0.2 * height);
    builder.lineTo(0.8 * extra1, 0.8 * height);
    builder.close();
    builder.moveTo(width - 0.2 * extra1, 0.5 * height);
    builder.lineTo(width - 0.8 * extra1, 0.2 * height);
    builder.lineTo(width - 0.8 * extra1, 0.8 * height);
    builder.close();
    builder.fillAndStroke();
    f = width - extra1;
    width = Math.min(60, f - extra1);
    builder.roundrect(
      extra1 + ((f - width / 2 - (extra1 + width / 2)) * c) / 100,
      0.15 * height,
      width,
      0.7 * height,
      5,
      5
    );
    builder.fillAndStroke();
  }
}
