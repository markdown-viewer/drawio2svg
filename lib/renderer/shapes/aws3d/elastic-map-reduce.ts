// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dElasticMapReduceHandler extends BaseShapeHandler {
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
    let d = x;
    let e = y;
    let f = parseFloat(this.getStyleValue(style, 'strokeWidth', '1'));

    builder.translate(d, e);
    d = (f * width) / 123;
    f = (f * height) / 133;
    e = this.getStyleValue(style, 'strokeColor2', '#292929');
    f = Math.min(d, f);
    builder.setStrokeWidth(f);
    this.renderBackground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      f,
      e
    );
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      f,
      e
    );
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
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.7331 * height);
    builder.lineTo(0, 0.3346 * height);
    builder.lineTo(0.126 * width, 0.1316 * height);
    builder.lineTo(0.374 * width, 0);
    builder.lineTo(0.626 * width, 0);
    builder.lineTo(0.874 * width, 0.1316 * height);
    builder.lineTo(width, 0.3346 * height);
    builder.lineTo(width, 0.7331 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    builder.restore();
    builder.setShadow(!1);
    builder.setFillColor('#000000' as string);
    x = this.getStyleValue(style, 'shadingCols', '0.1,0.3').toString().split(',');
    y = this.getStyleValue(style, 'flipH', '0');
    if ('0' == y) {
      builder.setAlpha(x[0]);
    } else {
      builder.setAlpha(x[1]);
    }
    builder.begin();
    builder.moveTo(0.126 * width, 0.1316 * height);
    builder.lineTo(0.126 * width, 0.267 * height);
    builder.lineTo(0.378 * width, 0.4023 * height);
    builder.lineTo(0.5 * width, 0.6015 * height);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0, 0.7331 * height);
    builder.lineTo(0, 0.3346 * height);
    builder.close();
    builder.moveTo(0.874 * width, 0.267 * height);
    builder.lineTo(0.874 * width, 0.1316 * height);
    builder.lineTo(width, 0.3308 * height);
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.5 * width, height);
    builder.lineTo(0.5 * width, 0.6015 * height);
    builder.lineTo(0.622 * width, 0.4023 * height);
    builder.lineTo(0.874 * width, 0.267 * height);
    builder.lineTo(width, 0.3308 * height);
    builder.lineTo(width, 0.7331 * height);
    builder.close();
    builder.fill();
    builder.restore();
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0.3336 * width, 0.1789 * height);
    builder.arcTo(0.0328 * width, 0.0301 * height, 0, 0, 1, 0.359 * width, 0.1789 * height);
    builder.lineTo(0.4001 * width, 0.2015 * height);
    builder.arcTo(0.0074 * width, 0.0068 * height, 0, 0, 1, 0.4008 * width, 0.2135 * height);
    builder.lineTo(0.3574 * width, 0.2368 * height);
    builder.arcTo(0.0328 * width, 0.0301 * height, 0, 0, 1, 0.3352 * width, 0.2368 * height);
    builder.lineTo(0.2934 * width, 0.2143 * height);
    builder.arcTo(0.0074 * width, 0.0068 * height, 0, 0, 1, 0.2934 * width, 0.2015 * height);
    builder.close();
    builder.moveTo(0.3705 * width, 0.1729 * height);
    builder.arcTo(0.0074 * width, 0.0068 * height, 0, 0, 1, 0.3705 * width, 0.1602 * height);
    builder.lineTo(0.4139 * width, 0.1368 * height);
    builder.arcTo(0.0328 * width, 0.0301 * height, 0, 0, 1, 0.4336 * width, 0.1368 * height);
    builder.lineTo(0.4811 * width, 0.1617 * height);
    builder.arcTo(0.0074 * width, 0.0068 * height, 0, 0, 1, 0.4811 * width, 0.1708 * height);
    builder.lineTo(0.4328 * width, 0.1955 * height);
    builder.arcTo(0.0328 * width, 0.0301 * height, 0, 0, 1, 0.4156 * width, 0.1955 * height);
    builder.close();
    builder.moveTo(0.4467 * width, 0.1308 * height);
    builder.arcTo(0.0074 * width, 0.0068 * height, 0, 0, 1, 0.4467 * width, 0.1203 * height);
    builder.lineTo(0.491 * width, 0.0962 * height);
    builder.arcTo(0.0328 * width, 0.0301 * height, 0, 0, 1, 0.5123 * width, 0.0962 * height);
    builder.lineTo(0.559 * width, 0.1203 * height);
    builder.arcTo(0.0074 * width, 0.0068 * height, 0, 0, 1, 0.559 * width, 0.1293 * height);
    builder.lineTo(0.5123 * width, 0.1549 * height);
    builder.arcTo(0.0328 * width, 0.0301 * height, 0, 0, 1, 0.4918 * width, 0.1549 * height);
    builder.close();
    builder.moveTo(0.568 * width, 0.1383 * height);
    builder.arcTo(0.0328 * width, 0.0301 * height, 0, 0, 1, 0.5918 * width, 0.1383 * height);
    builder.lineTo(0.6361 * width, 0.1624 * height);
    builder.arcTo(0.0074 * width, 0.0068 * height, 0, 0, 1, 0.6366 * width, 0.1714 * height);
    builder.lineTo(0.5885 * width, 0.1955 * height);
    builder.arcTo(0.0328 * width, 0.0301 * height, 0, 0, 1, 0.568 * width, 0.1955 * height);
    builder.lineTo(0.523 * width, 0.1714 * height);
    builder.arcTo(0.0074 * width, 0.0068 * height, 0, 0, 1, 0.523 * width, 0.1616 * height);
    builder.close();
    builder.moveTo(0.6451 * width, 0.1789 * height);
    builder.arcTo(0.0328 * width, 0.0301 * height, 0, 0, 1, 0.6697 * width, 0.1789 * height);
    builder.lineTo(0.7123 * width, 0.2023 * height);
    builder.arcTo(0.0074 * width, 0.0068 * height, 0, 0, 1, 0.7123 * width, 0.2128 * height);
    builder.lineTo(0.6664 * width, 0.2376 * height);
    builder.arcTo(0.0328 * width, 0.0301 * height, 0, 0, 1, 0.6492 * width, 0.2376 * height);
    builder.lineTo(0.6016 * width, 0.2135 * height);
    builder.arcTo(0.0074 * width, 0.0068 * height, 0, 0, 1, 0.6016 * width, 0.2023 * height);
    builder.close();
    builder.moveTo(0.6369 * width, 0.2451 * height);
    builder.arcTo(0.0074 * width, 0.0068 * height, 0, 0, 1, 0.6369 * width, 0.2526 * height);
    builder.lineTo(0.5172 * width, 0.3173 * height);
    builder.arcTo(0.0328 * width, 0.0301 * height, 0, 0, 1, 0.4893 * width, 0.3173 * height);
    builder.lineTo(0.3697 * width, 0.2541 * height);
    builder.arcTo(0.0074 * width, 0.0068 * height, 0, 0, 1, 0.3697 * width, 0.2436 * height);
    builder.lineTo(0.4918 * width, 0.1782 * height);
    builder.arcTo(0.0328 * width, 0.0301 * height, 0, 0, 1, 0.5131 * width, 0.1782 * height);
    builder.close();
    builder.fill();
    builder.moveTo(0 * width, 0 * height);
    builder.lineTo(0 * width, 0 * height);
    builder.arcTo(0 * width, 0 * height, 0, 0, 1, 0 * width, 0 * height);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.126 * width, 0.1316 * height);
    builder.lineTo(0.126 * width, 0.267 * height);
    builder.lineTo(0.378 * width, 0.4023 * height);
    builder.lineTo(0.5 * width, 0.6015 * height);
    builder.lineTo(0.622 * width, 0.4023 * height);
    builder.lineTo(0.874 * width, 0.267 * height);
    builder.lineTo(0.874 * width, 0.1316 * height);
    builder.moveTo(0, 0.3346 * height);
    builder.lineTo(0.126 * width, 0.267 * height);
    builder.moveTo(0.5 * width, 0.6015 * height);
    builder.lineTo(0.5 * width, height);
    builder.moveTo(width, 0.3346 * height);
    builder.lineTo(0.87 * width, 0.267 * height);
    builder.moveTo(0.378 * width, 0.4023 * height);
    builder.lineTo(0.622 * width, 0.4023 * height);
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.begin();
    builder.moveTo(0, 0.7331 * height);
    builder.lineTo(0, 0.3346 * height);
    builder.lineTo(0.126 * width, 0.1316 * height);
    builder.lineTo(0.374 * width, 0);
    builder.lineTo(0.626 * width, 0);
    builder.lineTo(0.874 * width, 0.1316 * height);
    builder.lineTo(width, 0.3346 * height);
    builder.lineTo(width, 0.7331 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
  }
}
