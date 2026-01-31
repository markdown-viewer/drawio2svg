// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dRdsMasterHandler extends BaseShapeHandler {
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
    builder.moveTo(0.1878 * width, 0.1932 * height);
    builder.lineTo(0.4854 * width, 0.0414 * height);
    builder.lineTo(0.5886 * width, 0.094 * height);
    builder.lineTo(0.4455 * width, 0.2308 * height);
    builder.lineTo(0.7122 * width, 0.1579 * height);
    builder.lineTo(0.8171 * width, 0.2098 * height);
    builder.lineTo(0.5187 * width, 0.3617 * height);
    builder.lineTo(0.4537 * width, 0.3293 * height);
    builder.lineTo(0.7016 * width, 0.2053 * height);
    builder.lineTo(0.3854 * width, 0.2947 * height);
    builder.lineTo(0.3187 * width, 0.2602 * height);
    builder.lineTo(0.4959 * width, 0.0992 * height);
    builder.lineTo(0.2504 * width, 0.2256 * height);
    builder.close();
    builder.fill();
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
