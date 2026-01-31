// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupGraphicsBubbleChartHandler extends BaseShapeHandler {
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
    if ('none' !== this.getStyleValue(style, 'fillColor', '#ffffff')) {
      builder.setShadow(!1);
    }
    this.render_bars(builder, x, y, width, height);
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
    builder.rect(0, 0, width, height);
    builder.fillAndStroke();
  }

  private render_bars(builder: RenderContext['builder'], p1: any, p2: any, p3: any, p4: any): void {
    if (!builder) return;
    let f;
    let g;
    let h;
    f = this.getStyleValue(this.renderCtx.style, 'strokeColor2', 'none');
    p1 = this.getStyleValue(this.renderCtx.style, 'strokeColor3', '#666666');
    g = this.getStyleValue(this.renderCtx.style, 'fillColor2', '#008cff');
    p2 = this.getStyleValue(this.renderCtx.style, 'fillColor3', '#dddddd');
    h = this.getStyleValue(this.renderCtx.style, 'strokeWidth', '1');
    builder.setStrokeColor(f as string);
    builder.setFillColor(g as string);
    f = 0.14 * Math.min(p4, p3);
    builder.ellipse(0.4 * p3 - f, 0.45 * p4 - f, 2 * f, 2 * f);
    builder.fillAndStroke();
    f = 0.1 * Math.min(p4, p3);
    builder.ellipse(0.1 * p3 - f, 0.8 * p4 - f, 2 * f, 2 * f);
    builder.fillAndStroke();
    f = 0.22 * Math.min(p4, p3);
    builder.ellipse(0.7 * p3 - f, 0.7 * p4 - f, 2 * f, 2 * f);
    builder.fillAndStroke();
    builder.setFillColor(p2 as string);
    f = 0.19 * Math.min(p4, p3);
    builder.ellipse(0.15 * p3 - f, 0.25 * p4 - f, 2 * f, 2 * f);
    builder.fillAndStroke();
    f = 0.12 * Math.min(p4, p3);
    builder.ellipse(0.48 * p3 - f, 0.7 * p4 - f, 2 * f, 2 * f);
    builder.fillAndStroke();
    f = 0.1 * Math.min(p4, p3);
    builder.ellipse(0.74 * p3 - f, 0.17 * p4 - f, 2 * f, 2 * f);
    builder.fillAndStroke();
    builder.setStrokeWidth(2 * h);
    builder.setStrokeColor(p1 as string);
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0, p4);
    builder.lineTo(p3, p4);
    builder.stroke();
  }
}
