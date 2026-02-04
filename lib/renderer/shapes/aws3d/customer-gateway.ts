// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dCustomerGatewayHandler extends BaseShapeHandler {
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
      getStencilShape,
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
      getStencilShape,
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
    getStencilShape?: RenderContext['getStencilShape'],
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
    builder.moveTo(0.4199 * width, 0.5447 * height);
    builder.lineTo(0.4199 * width, 0.035 * height);
    builder.lineTo(0.8946 * width, 0);
    builder.lineTo(width, 0.0691 * height);
    builder.lineTo(width, 0.4134 * height);
    builder.lineTo(0.6812 * width, 0.7247 * height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
    builder.save();
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
    builder.moveTo(0.4199 * width, 0.5447 * height);
    builder.lineTo(0.4199 * width, 0.035 * height);
    builder.lineTo(0.6838 * width, 0.2072 * height);
    builder.lineTo(0.6838 * width, 0.7247 * height);
    builder.close();
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.6838 * width, 0.2072 * height);
    builder.lineTo(width, 0.0691 * height);
    builder.lineTo(width, 0.4134 * height);
    builder.lineTo(0.6838 * width, 0.7247 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0.4199 * width, 0.5447 * height);
    builder.lineTo(0.4199 * width, 0.035 * height);
    builder.lineTo(0.6838 * width, 0.2072 * height);
    builder.lineTo(0.6838 * width, 0.7247 * height);
    builder.close();
    builder.stroke();
    builder.restore();
    builder.setLineJoin('round');
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0.6838 * width, 0.2072 * height);
    builder.lineTo(width, 0.0691 * height);
    builder.lineTo(width, 0.4134 * height);
    builder.lineTo(0.6838 * width, 0.7247 * height);
    builder.close();
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.begin();
    builder.moveTo(0.4199 * width, 0.5447 * height);
    builder.lineTo(0.4199 * width, 0.035 * height);
    builder.lineTo(0.8946 * width, 0);
    builder.lineTo(width, 0.0691 * height);
    builder.lineTo(width, 0.4134 * height);
    builder.lineTo(0.6812 * width, 0.7247 * height);
    builder.close();
    builder.stroke();
    builder.restore();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.929 * height);
    builder.lineTo(0, 0.5866 * height);
    builder.lineTo(0.3171 * width, 0.1031 * height);
    builder.lineTo(0.5784 * width, 0.2753 * height);
    builder.lineTo(0.5784 * width, 0.7928 * height);
    builder.lineTo(0.1054 * width, height);
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
    getStencilShape?: RenderContext['getStencilShape'],
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
      builder.setAlpha(y[0]);
    } else {
      builder.setAlpha(y[1]);
    }
    builder.begin();
    builder.moveTo(0, 0.929 * height);
    builder.lineTo(0, 0.5866 * height);
    builder.lineTo(0.1054 * width, 0.6537 * height);
    builder.lineTo(0.1054 * width, height);
    builder.close();
    builder.fill();
    if ('0' == h) {
      builder.setAlpha(y[1]);
    } else {
      builder.setAlpha(y[0]);
    }
    builder.begin();
    builder.moveTo(0.1054 * width, height);
    builder.lineTo(0.1054 * width, 0.6537 * height);
    builder.lineTo(0.5784 * width, 0.2753 * height);
    builder.lineTo(0.5784 * width, 0.7928 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.929 * height);
    builder.lineTo(0, 0.5866 * height);
    builder.lineTo(0.1054 * width, 0.6537 * height);
    builder.lineTo(0.1054 * width, height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.1054 * width, height);
    builder.lineTo(0.1054 * width, 0.6537 * height);
    builder.lineTo(0.5784 * width, 0.2753 * height);
    builder.lineTo(0.5784 * width, 0.7928 * height);
    builder.close();
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.929 * height);
    builder.lineTo(0, 0.5866 * height);
    builder.lineTo(0.3171 * width, 0.1031 * height);
    builder.lineTo(0.5784 * width, 0.2753 * height);
    builder.lineTo(0.5784 * width, 0.7928 * height);
    builder.lineTo(0.1054 * width, height);
    builder.close();
    builder.stroke();
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.7575 * width, 0.3969 * height);
    builder.arcTo(0.2142 * width, 0.2432 * height, 0, 0, 1, 0.7686 * width, 0.3259 * height);
    builder.arcTo(0.2142 * width, 0.2432 * height, 0, 0, 1, 0.8055 * width, 0.2481 * height);
    builder.arcTo(0.2142 * width, 0.2432 * height, 0, 0, 1, 0.8406 * width, 0.2091 * height);
    builder.lineTo(0.8269 * width, 0.2665 * height);
    builder.lineTo(0.8372 * width, 0.2607 * height);
    builder.lineTo(0.8372 * width, 0.3444 * height);
    builder.lineTo(0.7832 * width, 0.3804 * height);
    builder.lineTo(0.7832 * width, 0.3658 * height);
    builder.close();
    builder.moveTo(0.8466 * width, 0.2082 * height);
    builder.arcTo(0.0514 * width, 0.0584 * height, 0, 0, 1, 0.8766 * width, 0.1955 * height);
    builder.arcTo(0.0514 * width, 0.0584 * height, 0, 0, 1, 0.9186 * width, 0.2286 * height);
    builder.arcTo(0.12 * width, 0.1362 * height, 0, 0, 1, 0.9297 * width, 0.2821 * height);
    builder.lineTo(0.9006 * width, 0.2831 * height);
    builder.lineTo(0.9006 * width, 0.3016 * height);
    builder.lineTo(0.85 * width, 0.3366 * height);
    builder.lineTo(0.85 * width, 0.251 * height);
    builder.lineTo(0.8586 * width, 0.2471 * height);
    builder.close();
    builder.moveTo(0.9297 * width, 0.2967 * height);
    builder.arcTo(0.2142 * width, 0.2432 * height, 0, 0, 1, 0.9195 * width, 0.3667 * height);
    builder.arcTo(0.2571 * width, 0.2918 * height, 0, 0, 1, 0.8869 * width, 0.4436 * height);
    builder.arcTo(0.1714 * width, 0.1946 * height, 0, 0, 1, 0.8466 * width, 0.4903 * height);
    builder.lineTo(0.8595 * width, 0.4358 * height);
    builder.lineTo(0.8492 * width, 0.4416 * height);
    builder.lineTo(0.8492 * width, 0.357 * height);
    builder.lineTo(0.9006 * width, 0.32004 * height);
    builder.lineTo(0.9006 * width, 0.3346 * height);
    builder.close();
    builder.moveTo(0.838 * width, 0.4942 * height);
    builder.arcTo(0.0857 * width, 0.0973 * height, 0, 0, 1, 0.8072 * width, 0.5049 * height);
    builder.arcTo(0.0514 * width, 0.0584 * height, 0, 0, 1, 0.7712 * width, 0.4815 * height);
    builder.arcTo(0.1714 * width, 0.1946 * height, 0, 0, 1, 0.7566 * width, 0.4163 * height);
    builder.lineTo(0.7832 * width, 0.4173 * height);
    builder.lineTo(0.7832 * width, 0.4008 * height);
    builder.lineTo(0.8372 * width, 0.3638 * height);
    builder.lineTo(0.8372 * width, 0.4494 * height);
    builder.lineTo(0.8278 * width, 0.4562 * height);
    builder.close();
    builder.fill();
  }
}
