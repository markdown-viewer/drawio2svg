// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupGraphicsLineChartHandler extends BaseShapeHandler {
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
    p1 = this.getStyleValue(this.renderCtx.style, 'strokeColor2', '#666666');
    p2 = this.getStyleValue(this.renderCtx.style, 'strokeColor3', '#008cff');
    f = this.getStyleValue(this.renderCtx.style, 'strokeColor4', '#dddddd');
    g = this.getStyleValue(this.renderCtx.style, 'strokeWidth', '1');
    builder.setStrokeWidth(2 * g);
    builder.setStrokeColor(f as string);
    builder.begin();
    builder.moveTo(0, p4);
    builder.lineTo(0.3 * p3, 0.5 * p4);
    builder.lineTo(0.6 * p3, 0.74 * p4);
    builder.lineTo(0.9 * p3, 0.24 * p4);
    builder.stroke();
    builder.setStrokeColor(p2 as string);
    builder.begin();
    builder.moveTo(0, p4);
    builder.lineTo(0.3 * p3, 0.65 * p4);
    builder.lineTo(0.6 * p3, 0.6 * p4);
    builder.lineTo(0.9 * p3, 0.35 * p4);
    builder.stroke();
    builder.setStrokeColor(p1 as string);
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0, p4);
    builder.lineTo(p3, p4);
    builder.stroke();
  }
}
