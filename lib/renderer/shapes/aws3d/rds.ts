// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dRdsHandler extends BaseShapeHandler {
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
    let h;
    x = this.getStyleValue(style, 'strokeColor3', '#ffffff');
    builder.restore();
    builder.setShadow(!1);
    builder.setFillColor('#000000' as string);
    y = this.getStyleValue(style, 'shadingCols', '0.1,0.3').toString().split(',');
    h = this.getStyleValue(style, 'flipH', '0');
    if ('0' == h) {
      builder.setAlpha(y[0]);
    } else {
      builder.setAlpha(y[1]);
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
    if ('0' == h) {
      builder.setAlpha(y[1]);
    } else {
      builder.setAlpha(y[0]);
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
    builder.setFillColor(x as string);
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0, 0.6053 * height);
    builder.lineTo(0.5 * width, 0.8722 * height);
    builder.lineTo(width, 0.6053 * height);
    builder.lineTo(width, 0.6278 * height);
    builder.lineTo(0.5 * width, 0.8947 * height);
    builder.lineTo(0, 0.6278 * height);
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
