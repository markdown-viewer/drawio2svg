// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupGraphicsPlotChartHandler extends BaseShapeHandler {
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
    this.renderForeground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
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
    let f;
    let g;
    let h;
    let k;
    f = this.getStyleValue(style, 'strokeColor2', '#dddddd');
    x = this.getStyleValue(style, 'strokeColor3', '#666666');
    y = decodeURIComponent(
      this.getStyleValue(style, 'fillColor2', '#00aaff,#0044ff,#008cff').toString()
    ).split(',');
    g = this.getStyleValue(style, 'strokeWidth', '1');
    h = 0.03 * Math.min(width, height);
    builder.setStrokeColor(f as string);
    builder.setFillColor(y[0] as string);
    f = 0.2 * width;
    k = 0.8 * height;
    builder.begin();
    builder.moveTo(f - 0.5 * h, k - 0.5 * h);
    builder.lineTo(f + 0.5 * h, k - 0.5 * h);
    builder.lineTo(f + 0.5 * h, k + 0.5 * h);
    builder.lineTo(f - 0.5 * h, k + 0.5 * h);
    builder.close();
    builder.fillAndStroke();
    f = 0.3 * width;
    k = 0.65 * height;
    builder.begin();
    builder.moveTo(f - 0.5 * h, k - 0.5 * h);
    builder.lineTo(f + 0.5 * h, k - 0.5 * h);
    builder.lineTo(f + 0.5 * h, k + 0.5 * h);
    builder.lineTo(f - 0.5 * h, k + 0.5 * h);
    builder.close();
    builder.fillAndStroke();
    f = 0.6 * width;
    k = 0.44 * height;
    builder.begin();
    builder.moveTo(f - 0.5 * h, k - 0.5 * h);
    builder.lineTo(f + 0.5 * h, k - 0.5 * h);
    builder.lineTo(f + 0.5 * h, k + 0.5 * h);
    builder.lineTo(f - 0.5 * h, k + 0.5 * h);
    builder.close();
    builder.fillAndStroke();
    f = 0.85 * width;
    k = 0.9 * height;
    builder.begin();
    builder.moveTo(f - 0.5 * h, k - 0.5 * h);
    builder.lineTo(f + 0.5 * h, k - 0.5 * h);
    builder.lineTo(f + 0.5 * h, k + 0.5 * h);
    builder.lineTo(f - 0.5 * h, k + 0.5 * h);
    builder.close();
    builder.fillAndStroke();
    builder.setFillColor(y[1] as string);
    f = 0.08 * width;
    k = 0.65 * height;
    builder.begin();
    builder.moveTo(f, k - 0.5 * h);
    builder.lineTo(f + 0.5 * h, k + 0.5 * h);
    builder.lineTo(f - 0.5 * h, k + 0.5 * h);
    builder.close();
    builder.fillAndStroke();
    f = 0.58 * width;
    k = 0.85 * height;
    builder.begin();
    builder.moveTo(f, k - 0.5 * h);
    builder.lineTo(f + 0.5 * h, k + 0.5 * h);
    builder.lineTo(f - 0.5 * h, k + 0.5 * h);
    builder.close();
    builder.fillAndStroke();
    f = 0.72 * width;
    k = 0.92 * height;
    builder.begin();
    builder.moveTo(f, k - 0.5 * h);
    builder.lineTo(f + 0.5 * h, k + 0.5 * h);
    builder.lineTo(f - 0.5 * h, k + 0.5 * h);
    builder.close();
    builder.fillAndStroke();
    builder.setFillColor(y[2] as string);
    f = 0.32 * width;
    k = 0.28 * height;
    builder.begin();
    builder.moveTo(f, k - 0.75 * h);
    builder.lineTo(f + 0.75 * h, k);
    builder.lineTo(f, k + 0.75 * h);
    builder.lineTo(f - 0.75 * h, k);
    builder.close();
    builder.fillAndStroke();
    f = 0.92 * width;
    k = 0.45 * height;
    builder.begin();
    builder.moveTo(f, k - 0.75 * h);
    builder.lineTo(f + 0.75 * h, k);
    builder.lineTo(f, k + 0.75 * h);
    builder.lineTo(f - 0.75 * h, k);
    builder.close();
    builder.fillAndStroke();
    f = 0.81 * width;
    k = 0.37 * height;
    builder.begin();
    builder.moveTo(f, k - 0.75 * h);
    builder.lineTo(f + 0.75 * h, k);
    builder.lineTo(f, k + 0.75 * h);
    builder.lineTo(f - 0.75 * h, k);
    builder.close();
    builder.fillAndStroke();
    f = 0.51 * width;
    k = 0.7 * height;
    builder.begin();
    builder.moveTo(f, k - 0.75 * h);
    builder.lineTo(f + 0.75 * h, k);
    builder.lineTo(f, k + 0.75 * h);
    builder.lineTo(f - 0.75 * h, k);
    builder.close();
    builder.fillAndStroke();
    builder.setStrokeWidth(2 * g);
    builder.setStrokeColor(x as string);
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0, height);
    builder.lineTo(width, height);
    builder.stroke();
  }
}
