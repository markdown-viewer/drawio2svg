// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupGraphicsBarChartHandler extends BaseShapeHandler {
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
    getStencilShape?: RenderContext['getStencilShape'],
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
    p1 = this.getStyleValue(this.renderCtx.style, 'strokeColor2', 'none');
    p2 = this.getStyleValue(this.renderCtx.style, 'strokeColor3', '#666666');
    f = this.getStyleValue(this.renderCtx.style, 'fillColor2', '#008cff');
    g = this.getStyleValue(this.renderCtx.style, 'fillColor3', '#dddddd');
    h = this.getStyleValue(this.renderCtx.style, 'strokeWidth', '1');
    builder.setStrokeColor(p1 as string);
    builder.setFillColor(f as string);
    builder.rect(0, 0.2 * p4, 0.75 * p3, 0.05 * p4);
    builder.fillAndStroke();
    builder.rect(0, 0.45 * p4, 0.6 * p3, 0.05 * p4);
    builder.fillAndStroke();
    builder.rect(0, 0.7 * p4, 0.95 * p3, 0.05 * p4);
    builder.fillAndStroke();
    builder.setFillColor(g as string);
    builder.rect(0, 0.25 * p4, 0.85 * p3, 0.05 * p4);
    builder.fillAndStroke();
    builder.rect(0, 0.5 * p4, 0.65 * p3, 0.05 * p4);
    builder.fillAndStroke();
    builder.rect(0, 0.75 * p4, 0.8 * p3, 0.05 * p4);
    builder.fillAndStroke();
    builder.setStrokeWidth(2 * h);
    builder.setStrokeColor(p2 as string);
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0, p4);
    builder.lineTo(p3, p4);
    builder.stroke();
  }
}
