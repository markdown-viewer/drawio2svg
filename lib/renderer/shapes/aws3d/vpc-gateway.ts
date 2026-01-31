// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dVpcGatewayHandler extends BaseShapeHandler {
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
    d = (f * width) / 116.7;
    f = (f * height) / 102.8;
    e = this.getStyleValue(style, 'strokeColor2', '#292929');
    f = Math.min(d, f);
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
    builder.setStrokeWidth(extra1);
    builder.save();
    builder.save();
    builder.save();
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.5801 * width, 0.5447 * height);
    builder.lineTo(0.5801 * width, 0.035 * height);
    builder.lineTo(0.1054 * width, 0);
    builder.lineTo(0, 0.0691 * height);
    builder.lineTo(0, 0.4134 * height);
    builder.lineTo(0.3188 * width, 0.7247 * height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
    builder.save();
    builder.setShadow(!1);
    builder.setFillColor('#000000' as string);
    x = this.getStyleValue(style, 'shadingCols', '0.1,0.3').toString().split(',');
    y = this.getStyleValue(style, 'flipH', '0');
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.5801 * width, 0.5447 * height);
    builder.lineTo(0.5801 * width, 0.035 * height);
    builder.lineTo(0.3162 * width, 0.2072 * height);
    builder.lineTo(0.3162 * width, 0.7247 * height);
    builder.close();
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[0]);
    } else {
      builder.setAlpha(x[1]);
    }
    builder.begin();
    builder.moveTo(0.3162 * width, 0.2072 * height);
    builder.lineTo(0, 0.0691 * height);
    builder.lineTo(0, 0.4134 * height);
    builder.lineTo(0.3162 * width, 0.7247 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0.5801 * width, 0.5447 * height);
    builder.lineTo(0.5801 * width, 0.035 * height);
    builder.lineTo(0.3162 * width, 0.2072 * height);
    builder.lineTo(0.3162 * width, 0.7247 * height);
    builder.close();
    builder.stroke();
    builder.restore();
    builder.setLineJoin('round');
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0.3162 * width, 0.2072 * height);
    builder.lineTo(0, 0.0691 * height);
    builder.lineTo(0, 0.4134 * height);
    builder.lineTo(0.3162 * width, 0.7247 * height);
    builder.close();
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.begin();
    builder.moveTo(0.5801 * width, 0.5447 * height);
    builder.lineTo(0.5801 * width, 0.035 * height);
    builder.lineTo(0.1054 * width, 0);
    builder.lineTo(0, 0.0691 * height);
    builder.lineTo(0, 0.4134 * height);
    builder.lineTo(0.3188 * width, 0.7247 * height);
    builder.close();
    builder.stroke();
    builder.restore();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(width, 0.929 * height);
    builder.lineTo(width, 0.5866 * height);
    builder.lineTo(0.6829 * width, 0.1031 * height);
    builder.lineTo(0.4216 * width, 0.2753 * height);
    builder.lineTo(0.4216 * width, 0.7928 * height);
    builder.lineTo(0.8946 * width, height);
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
    builder.restore();
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.setFillColor('#000000' as string);
    y = this.getStyleValue(style, 'shadingCols', '0.1,0.3').toString().split(',');
    h = this.getStyleValue(style, 'flipH', '0');
    if ('0' == h) {
      builder.setAlpha(y[1]);
    } else {
      builder.setAlpha(y[0]);
    }
    builder.begin();
    builder.moveTo(width, 0.929 * height);
    builder.lineTo(width, 0.5866 * height);
    builder.lineTo(0.8946 * width, 0.6537 * height);
    builder.lineTo(0.8946 * width, height);
    builder.close();
    builder.fill();
    if ('0' == h) {
      builder.setAlpha(y[0]);
    } else {
      builder.setAlpha(y[1]);
    }
    builder.begin();
    builder.moveTo(0.8946 * width, height);
    builder.lineTo(0.8946 * width, 0.6537 * height);
    builder.lineTo(0.4216 * width, 0.2753 * height);
    builder.lineTo(0.4216 * width, 0.7928 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(width, 0.929 * height);
    builder.lineTo(width, 0.5866 * height);
    builder.lineTo(0.8946 * width, 0.6537 * height);
    builder.lineTo(0.8946 * width, height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.8946 * width, height);
    builder.lineTo(0.8946 * width, 0.6537 * height);
    builder.lineTo(0.4216 * width, 0.2753 * height);
    builder.lineTo(0.4216 * width, 0.7928 * height);
    builder.close();
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(width, 0.929 * height);
    builder.lineTo(width, 0.5866 * height);
    builder.lineTo(0.6829 * width, 0.1031 * height);
    builder.lineTo(0.4216 * width, 0.2753 * height);
    builder.lineTo(0.4216 * width, 0.7928 * height);
    builder.lineTo(0.8946 * width, height);
    builder.close();
    builder.stroke();
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.5587 * width, 0.7743 * height);
    builder.lineTo(0.5587 * width, 0.6274 * height);
    builder.lineTo(0.5775 * width, 0.6342 * height);
    builder.lineTo(0.5775 * width, 0.57 * height);
    builder.arcTo(0.0428 * width, 0.0486 * height, 0, 0, 1, 0.6058 * width, 0.5253 * height);
    builder.arcTo(0.0686 * width, 0.0778 * height, 0, 0, 1, 0.6564 * width, 0.5447 * height);
    builder.arcTo(0.0857 * width, 0.0973 * height, 0, 0, 1, 0.6847 * width, 0.607 * height);
    builder.lineTo(0.6847 * width, 0.6877 * height);
    builder.lineTo(0.7001 * width, 0.6946 * height);
    builder.lineTo(0.7001 * width, 0.8405 * height);
    builder.close();
    builder.moveTo(0.6564 * width, 0.6741 * height);
    builder.lineTo(0.6564 * width, 0.6177 * height);
    builder.arcTo(0.06 * width, 0.0681 * height, 0, 0, 0, 0.6392 * width, 0.57 * height);
    builder.arcTo(0.0343 * width, 0.0389 * height, 0, 0, 0, 0.6195 * width, 0.5574 * height);
    builder.arcTo(0.0111 * width, 0.0126 * height, 0, 0, 0, 0.6058 * width, 0.5691 * height);
    builder.lineTo(0.6058 * width, 0.6498 * height);
    builder.close();
    builder.fill();
  }
}
