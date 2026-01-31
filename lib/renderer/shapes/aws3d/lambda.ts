// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dLambdaHandler extends BaseShapeHandler {
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
    d = (f * width) / 92;
    f = (f * height) / 109.5;
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
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.1671 * height);
    builder.lineTo(0.3424 * width, 0);
    builder.lineTo(0.663 * width, 0);
    builder.lineTo(width, 0.1671 * height);
    builder.lineTo(width, 0.8365 * height);
    builder.lineTo(0.663 * width, height);
    builder.lineTo(0.3424 * width, height);
    builder.lineTo(0, 0.8365 * height);
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
    let k;
    builder.restore();
    builder.setShadow(!1);
    builder.setFillColor('#000000' as string);
    x = this.getStyleValue(style, 'strokeColor', '#5E5E5E');
    y = this.getStyleValue(style, 'strokeColor3', '#ffffff');
    h = this.getStyleValue(style, 'shadingCols', '0.1,0.3').toString().split(',');
    k = this.getStyleValue(style, 'flipH', '0');
    if ('0' == k) {
      builder.setAlpha(h[0]);
    } else {
      builder.setAlpha(h[1]);
    }
    builder.begin();
    builder.moveTo(0, 0.3242 * height);
    builder.lineTo(0.3424 * width, 0.4895 * height);
    builder.lineTo(0.663 * width, 0.4895 * height);
    builder.lineTo(0.663 * width, height);
    builder.lineTo(0.3424 * width, height);
    builder.lineTo(0, 0.8365 * height);
    builder.close();
    builder.moveTo(0 * width, 0 * height);
    builder.lineTo(0 * width, 0 * height);
    builder.lineTo(0 * width, 0 * height);
    builder.lineTo(0 * width, 0 * height);
    builder.lineTo(0 * width, 0 * height);
    builder.lineTo(0 * width, 0 * height);
    builder.close();
    builder.moveTo(0 * width, 0 * height);
    builder.lineTo(0 * width, 0 * height);
    builder.lineTo(0 * width, 0 * height);
    builder.lineTo(0 * width, 0 * height);
    builder.lineTo(0 * width, 0 * height);
    builder.lineTo(0 * width, 0 * height);
    builder.close();
    builder.fill();
    if ('0' == k) {
      builder.setAlpha(h[1]);
    } else {
      builder.setAlpha(h[0]);
    }
    builder.begin();
    builder.moveTo(0.663 * width, 0.4895 * height);
    builder.lineTo(width, 0.3242 * height);
    builder.lineTo(width, 0.8365 * height);
    builder.lineTo(0.663 * width, height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.3242 * height);
    builder.lineTo(0.3424 * width, 0.4895 * height);
    builder.lineTo(0.663 * width, 0.4895 * height);
    builder.lineTo(width, 0.3242 * height);
    builder.moveTo(0.3424 * width, 0.4895 * height);
    builder.lineTo(0.3424 * width, height);
    builder.moveTo(0.663 * width, 0.4895 * height);
    builder.lineTo(0.663 * width, height);
    builder.stroke();
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.3804 * width, 0.1169 * height);
    builder.arcTo(0.5435 * width, 0.4566 * height, 0, 0, 1, 0.6087 * width, 0.1123 * height);
    builder.arcTo(0.33804 * width, 0.3196 * height, 0, 0, 1, 0.725 * width, 0.1553 * height);
    builder.arcTo(0.1304 * width, 0.1096 * height, 0, 0, 1, 0.7924 * width, 0.2402 * height);
    builder.arcTo(0.1522 * width, 0.1279 * height, 0, 0, 1, 0.725 * width, 0.3333 * height);
    builder.arcTo(0.4416 * width, 0.274 * height, 0, 0, 1, 0.6087 * width, 0.3772 * height);
    builder.arcTo(0.5435 * width, 0.4566 * height, 0, 0, 1, 0.3804 * width, 0.3708 * height);
    builder.arcTo(0.3804 * width, 0.3196 * height, 0, 0, 1, 0.2772 * width, 0.3324 * height);
    builder.arcTo(0.1522 * width, 0.1279 * height, 0, 0, 1, 0.2163 * width, 0.2539 * height);
    builder.arcTo(0.1522 * width, 0.1279 * height, 0, 0, 1, 0.2663 * width, 0.1644 * height);
    builder.arcTo(0.3804 * width, 0.3196 * height, 0, 0, 1, 0.3804 * width, 0.1169 * height);
    builder.fill();
    builder.setFillColor(y as string);
    builder.begin();
    builder.moveTo(0.5565 * width, 0.2174 * height);
    builder.arcTo(0.0652 * width, 0.0548 * height, 0, 0, 0, 0.5837 * width, 0.1945 * height);
    builder.arcTo(0.0326 * width, 0.0274 * height, 0, 0, 0, 0.5793 * width, 0.1671 * height);
    builder.arcTo(0.0652 * width, 0.0548 * height, 0, 0, 0, 0.525 * width, 0.1598 * height);
    builder.arcTo(0.0652 * width, 0.0548 * height, 0, 0, 1, 0.5543 * width, 0.1443 * height);
    builder.arcTo(0.0761 * width, 0.0639 * height, 0, 0, 1, 0.6163 * width, 0.1662 * height);
    builder.arcTo(0.0598 * width, 0.0502 * height, 0, 0, 1, 0.6087 * width, 0.2091 * height);
    builder.lineTo(0.5 * width, 0.3032 * height);
    builder.arcTo(0.0978 * width, 0.0822 * height, 0, 0, 0, 0.4728 * width, 0.3379 * height);
    builder.arcTo(0.0272 * width, 0.0228 * height, 0, 0, 0, 0.4924 * width, 0.3571 * height);
    builder.arcTo(0.0326 * width, 0.0274 * height, 0, 0, 1, 0.4489 * width, 0.3571 * height);
    builder.arcTo(0.038 * width, 0.032 * height, 0, 0, 1, 0.437 * width, 0.3242 * height);
    builder.arcTo(0.1087 * width, 0.0913 * height, 0, 0, 1, 0.4674 * width, 0.2886 * height);
    builder.lineTo(0.5141 * width, 0.2557 * height);
    builder.lineTo(0.3185 * width, 0.2895 * height);
    builder.lineTo(0.2641 * width, 0.2648 * height);
    builder.close();
    builder.fill();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.begin();
    builder.moveTo(0, 0.1671 * height);
    builder.lineTo(0.3424 * width, 0);
    builder.lineTo(0.663 * width, 0);
    builder.lineTo(width, 0.1671 * height);
    builder.lineTo(width, 0.8365 * height);
    builder.lineTo(0.663 * width, height);
    builder.lineTo(0.3424 * width, height);
    builder.lineTo(0, 0.8365 * height);
    builder.close();
    builder.stroke();
  }
}
